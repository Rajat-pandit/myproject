const express= require("express");
const mongoose= require("mongoose");
const cors= require("cors");
const bcrypt= require("bcrypt");
const dotenv= require("dotenv");
const UserModel= require("./model/User");
const multer = require("multer");
const path = require("path");
const axios = require('axios');  // Import axios
const ProfileModel= require("./model/Profile");
const MedicalRecord= require("./model/MedicalRecord");
const PetModel= require("./model/Pet");
const RequestModel= require("./model/AdoptionRequest");
const session= require("express-session");
const Reminder = require('./model/Reminder');
const EmergencyCard= require('./model/EmergencyCard');
const VetAppointment = require('./model/VetAppointment');
const Notification = require('./model/Notification'); // Import the Notification model
const Post = require('./model/Posts');
const MongoStore= require("connect-mongo");
const {ObjectId}= require('mongodb');
const nodemailer= require('nodemailer');
const cron = require('node-cron');
const AdminModel= require('./model/AdminModel');
dotenv.config();
const app= express();
const server = require('http').Server(app);

app.use(express.json());
const allowedOrigins = ['http://localhost:3000', 'http://localhost:3002'];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {secure: process.env.NODE_ENV === 'production'}
}));

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("connected to MongoDB"))
.catch(err => console.log("Failed to connect to MongoDB", err))

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

const storage = multer.diskStorage({
    destination: (req, files, cb) => {
        cb(null, "uploads/");
    },
    filename:(req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage});

//routes for signup
app.post("/signup", upload.single('image'), async(req, res) =>{
    try{
        const {name, email, password}= req.body;
        const existingUser= await UserModel.findOne({email});
        if (existingUser){
            return res.status(400).json({error:"Email already exists"});

        }
        const hashedPassword= await bcrypt.hash(password, 10);
        const imagePath= req.file? req.file.path:null;

        const newUser= new UserModel({
                name,
                email,
                password:hashedPassword,
                image:imagePath
        });

        const savedUser= await newUser.save();
        res.status(201).json({
            id:savedUser._id,
            name: savedUser.name,
            email: savedUser.email,
            registrationDate:savedUser.registrationDate,
            image:savedUser.image,
        });
        
    } catch (error){
        res.status(500).json({error:error.message});
    }
});

//routes for login
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        
        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                // Set session with user data, including image
                req.session.user = { 
                    id: user._id, 
                    name: user.name, 
                    email: user.email,
                    image: user.image // Include image in session data
                };
                res.json({ message: "Success", user: req.session.user });
            } else {
                res.status(500).json("Incorrect password");
            }
        } else {
            res.status(404).json("No records found");
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
  });

app.post("/profiles", upload.single("photo"), async(req, res) => {
    const {petsname, breed, age, contactnumber} = req.body;
    const imagePath= req.file ? req.file.path : null;
    const {name, email}= req.session.user;
    try{
        const petProfile = new ProfileModel({
           petsName: petsname,
           breed: breed,
           age: age,
           contactNumber: contactnumber,
           image: imagePath,
           ownerName:name,
           ownerEmail: email 
        });

        await petProfile.save();
        res.status(201).send("Pet profile created successfully!");
    } catch (err){
        console.error("Error saving pet profile:", err);
        res.status(500).send(`Failed to create pet profile. Error: ${err.message}`);
    }
});

app.get('/user', (req, res) => {
    if(req.session.user){
        res.json({user: req.session.user});
    } else{
        res.status(401).json("Not authenticated");
    }
});

//for fetching pet profile
app.get('/api/profiles', (req, res) => {
    if(req.session.user) {
        ProfileModel.find({ownerEmail: req.session.user.email})
            .then(profiles => {
                if (profiles.length > 0){
                    res.json(profiles);
                } else {
                    res.status(404).send('No profiles found');
                }
            })
            .catch(error => {
                console.error('Error fetching profiles:', error);
                res.status(500).send('Internal server error');
            });
    } else{
        res.status(401).json('Not authenticated');
    }
});

app.get('/api/profiles/:petId', (req, res) => {
    const petId = req.params.petId;

    if(req.session.user) {
        ProfileModel.findById(petId)
            .then(profile => {
                if(profile){
                    res.json(profile);
                } else{
                    res.status(404).send('Pet not found');
                }
            })
            .catch(error => {
                console.error('Error fetching pet data:', error);
                res.status(500).send('Internal server error');
            });
    } else{
        res.status(401).json('Not authenticated');
    }
});

//for updating user pet profile
app.put('/api/profiles/:petId', upload.single('image'), (req, res)=> {
    const petId= req.params.petId;
    const{petsName, ownerName, ownerEmail, age, breed,  contactNumber}= req.body;
    const imageUrl= req.file ? req.file.path: null;
    if(!petsName || !ownerName || !ownerEmail || !age || !breed || ! contactNumber){
        return res.status(400).json({error: 'All fields are required.'});

    }
    if(!mongoose.Types.ObjectId.isValid(petId)){
        return res.status(400).json({error: 'Invalid pet Id format'});
    }

    const updateData={
        petsName,
        ownerName,
        ownerEmail,
        age,
        breed,
        contactNumber,
    };
    if(imageUrl){
        updateData.image= imageUrl;
    }
    ProfileModel.findByIdAndUpdate(petId, updateData, {new:true})
    .then(updatedProfile=>{
        if(updatedProfile){
            res.json(updatedProfile)
        } else{
            res.status(404).json({error:'Pet profile not found'});
        }
    })
    .catch(error =>{
        console.error('Error updating profile:', error);
        res.status(500).json({error:'Internal server error', details: error.message});
    });
});

//for posting medical record
app.post('/api/medical-records', async (req, res) => {
    try{
        const {date, vetName, description, diagnosis, treatment, medications,notes, nextVisit, petId}= req.body;
        const newMedicalRecord= new MedicalRecord({
            date,
            vetName,
            description,
            diagnosis,
            treatment,
            medications,
            notes,
            nextVisit,
            petId,
        });

        await newMedicalRecord.save();
        res.status(201).json(newMedicalRecord);
    } catch (error){
        res.status(500).json({message:'Error creating medical record', error: error.message});
    }
});

//for getting medical record
app.get('/api/medical-records/:petId', async(req,res) => {
    const {petId}= req.params;

    if(!ObjectId.isValid(petId)){
        return res.status(400).json({message: 'Invalid petId'});
    }

    try{
        const medicalRecords= await MedicalRecord.find({petId: new ObjectId(petId)});
        if(medicalRecords.length ===0){
            return res.status(404).json({message: 'No medical records found for this pet'});
        }
        res.status(200).json(medicalRecords);
    } catch (error){
        console.error('Error fetching medical records:', error);
        res.status(500).json({message:'Error fetching medical records', error: error.message});
    }
});

//for deleting medical record
app.delete('/api/medical-records/:id', async(req, res) => {
    const recordId= req.params.id;
    try{
        const result= await MedicalRecord.findByIdAndDelete(recordId);
        if( !result){
            return res.status(404).json({error: 'Record not found'});
        }
        return res.status(200).json({message:'Record deleted successfully'});
    } catch (err){
        return res.status(500).json({error:'Error deleting record', details: err.message});
    }
});

//for postinf the available pets
app.post('/api/pets', upload.single('petImage'), async (req, res) => {
    try{
        const {petName, breed, age}= req.body;
        const petImage= req.file ? req.file.path: null;

        const newPet= new PetModel({
            petName,
            breed,
            age,
            image: petImage
        });

        const savedPet= await newPet.save();
        res.status(201).json(savedPet);
    } catch (error) {
        res.status(500).json({message:'Error adding pet', error});
    }
});

//for editing the adoptable pets information
app.put('/api/pets/:petId', upload.single('petImage'), (req,res) =>{
    const petId= req.params.petId;
    const {petName, breed,age}= req.body;
    const petImage= req.file? req.file.path: null;

    if(!petName || !breed ||!age){
        return res.status(400).json({error:'All fields are required.'});
    }

    const updateData= {
        petName,
        breed,
        age,
    };

    if(petImage){
        updateData.image= petImage;
    }

    PetModel.findByIdAndUpdate(petId, updateData, {new:true})
        .then(updatedPet => {
            if(updatedPet){
                res.json(updatedPet);
            } else{
                res.status(404).json({error:'Pet not found.'});
            }
        })
        .catch(error => {
            console.error('Error updating pet:', error);
            res.status(500).json({error: 'Internal server error'});
        });
});

//for fetching the avilable pets for adoption
app.get('/api/pets', async(req, res)=>{
    try{
        const pets= await PetModel.find();
        if(!pets || pets.length===0){
            return res.status(404).json({message:'No pets found'});
        }

        const petsWithImageURLs= pets.map(pet => ({
            ...pet.toObject(),
        }));

        res.status(200).json(petsWithImageURLs);
    } catch(error){
        res.status(500).json({messgae:'Error fetching pets', error});
    }
});

//for deleting the pets for adoption
app.delete('/api/pets/:id', async(req, res) => {
    try{
        const petId= req.params.id;
        const deletedPet= await PetModel.findByIdAndDelete(petId);

        if(!deletedPet) {
            return res.status(404).json({message:'Pet not found'});
        }

        res.status(200).json({message:'Pet deleted successfully'});
    } catch (error){
        console.error('Error deleting pet:', error);
        res.status(500).json({message:'Server error'});
    }
});

//for posting adoption request
app.post("/adopt", async(req, res)=>{
    const {petId, userName}= req.body;
    try{
        const user= await UserModel.findOne({name:userName});
        const pet= await PetModel.findById(petId);

        if(!user || !pet){
            return res.status(400).json({message: "User or Pet not found"});
        }

        const newAdoptionRequest= new RequestModel({
            petId: pet._id,
            userId: user._id,
            breed: pet.breed,
            email: user.email,
            status: "pending",
        });

        await newAdoptionRequest.save();
        res.status(200).json({
            message:`Adoption request for ${pet.petName} has been successfully submitted!`,
            adoptionRequest:newAdoptionRequest,
        });
    } catch (err){
        console.error("Error during adoption request:", err);
        res.status(500).json({message:"Error processing the adoption request", error: err});
    }
});

//for getting adoption request
app.get('/admin/adoption-requests', async(req, res)=>{
    try{
        const requests = await RequestModel.find()
        .populate('userId', 'name email')
        .populate('petId', 'petName breed');

        res.json(requests);
    } catch(err){
        console.error('Error fetching adoption requests:', err);
        res.status(500).json({message:'Error fetching adoption requests'});
    }
});

//deleting adoption request from admin
app.delete('/admin/adoption-requests/:id', async (req, res) => {
    try{
        const requestId= req.params.id;
        const request= await RequestModel.findById(requestId);
        if(!request){
            return res.status(404).json({message: 'Adoption request not found'});
        }

        await RequestModel.findByIdAndDelete(requestId);
        res.status(200).json({message:'Adoption request deleted successfully'});
    } catch (error){
        console.error("Error deleting adoption request:", error);
        res.status(500).json({message:'Error deleting adoption request'});
    }
});

//email dependicies
const transporter= nodemailer.createTransport({
    service:'gmail',
    auth:{
        user: 'fureverfriends2216@gmail.com',
        pass: 'ofxo xtte mmic smjo',
    },
});

const sendEmail = async (userEmail, status, petName, breed)=>{
    const subject = status === 'approved' ? 'Adoption Request Approved': 'Adoption Request Rejected';
    const text = status ==='approved' ? `Congratulations! Your adoption request for ${petName} (${breed}) has been approved.`
    : `Sorry, your adoption request for ${petName} (${breed}) has been rejected.`;

    const mailOptions ={
        from: 'razatp2203@gmail.com',
        to: userEmail,
        subject: subject,
        text: text,
    };

    try{
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch(error){
        console.error('Error sending email:', error);
    }
};

//updating the database for status and sending mail
app.patch('/admin/adoption-requests/:id', async(req, res) =>{
    const requestId= req.params.id;
    const {status} = req.body;

    if(!mongoose.Types.ObjectId.isValid(requestId)){
        return res.status(400).json({message: 'Invalid request Id'});
    }

    try{
        const request= await RequestModel.findById(requestId).populate('userId petId');
        if(!request){
            return res.status(404).json({message: 'Request not found'});
        }

        request.status= status;
        await request.save();

        res.json(request);
    } catch(err){
        console.error('Error updating request:', err);
        res.status(400).json({message:'Failed to update request'});
    }
});

// route for sending email
app.post('/admin/send-email', async(req,res)=>{
    const {userEmail, status, petName, breed}= req.body;
    try{
        await sendEmail(userEmail, status, petName, breed);
        res.status(200).send('Email sent successfully');
    } catch (error){
        console.error('Error sending email:', error);
        res.status(500).send('Failed to send email');
    }
});

//fetching total user in admin
app.get('/api/users/total', async (req, res) =>{
    try{
        const totalUsers= await UserModel.countDocuments();
        res.json({totalUsers});
    } catch (error){
        console.error('Error fetching total users:', error);
        res.status(500).json({message:'Server error'});
    }
});

//for getting user details in admin
app.get('/api/admin/users', async(req, res)=>{
    try{
        const users= await UserModel.find({}, 'name email registrationDate');
        res.json(users);
    } catch (error){
        console.error('Error fetching user details:', error);
        res.status(500).json({message:'Server error'});
    }
});

//for deleting user list
app.delete('/api/admin/users/:userId', async(req, res)=>{
    const userId= req.params.userId;
    try{
        const user= await UserModel.findByIdAndDelete(userId);
        if(!user){
            return res.status(404).send('User not found');
        }
        res.status(200).json({message:'User deleted successfully'});
    } catch(error){
        console.error("Error deleteing user:", error);
        res.status(500).json({message:'Server error'});
    }
});

// getting all the profile data in admin
app.get('/api/admin/user/:userEmail/pets', async (req, res) => {
    try{
        const {userEmail}= req.params;
        const petProfiles= await ProfileModel.find({ownerEmail: userEmail});
        const ownerDetails= await ProfileModel.findOne({ownerEmail: userEmail}).select('ownerName contactNumber');

        if(petProfiles.length >0 && ownerDetails){
            res.json({petProfiles, ownerDetails});
        } else{
            res.status(404).send({message:"No pet profiles or owner details for this user."});
        }
    } catch (err){
        console.error('Error fetching data:', err);
        res.status(500).send({message:'Error fetching pet profiles and owner details.'});

    }
});

//Admin SignUp Route
app.post('/admin/signup', async(req, res)=>{
    const {name, email, password}= req.body;

    const existingAdmin= await AdminModel.findOne({email});
    if (existingAdmin){
        return res.status(400).json({message:'Email Already in Use'});
    }

    const hashedPassword= await bcrypt.hash(password, 10);

    const newAdmin= new AdminModel({
        name,
        email,
        password:hashedPassword
    });

    try{
        await newAdmin.save();
        res.status(201).json({message: 'Admin Signed up Successfylly.'});
    } catch (error){
        console.error('Error signing up admin:', error);
        res.status(500).json({message:'Server error'});
    }
});

//Admin Login
app.post("/admin/login", async(req, res)=>{
    try{
        const {email, password}= req.body;
        const admin= await AdminModel.findOne({email});
        if(!admin){
            return res.status(404).json({message:"Admin not found"});
        }
        const isPasswordMatch= await bcrypt.compare(password, admin.password);
        if(!isPasswordMatch){
            return res.status(401).jsin({message:"Incorrect password"});
        }

        req.session.admin= {id: admin._id, name: admin.name, email: admin.email};
        console.log("Session after login:", req.session);
        res.status(200).json({message:"Login Successful"});
    } catch (error){
        console.error("Login error:", error);
        res.status(500).json({message:"Internal server error"});
    }
});

//getting reminders from db
app.get('/reminders/:petId', async(req, res)=> {
    try{
        const reminders= await Reminder.find({petId: req.params.petId});
        res.json(reminders);
    } catch (err) {
        console.error('Error fetching remonders:', err);
        res.status(500).json({message:'Failed to fetch reminders'});
    }
});

const sendReminderEmail = async (userEmail, petName, reminderDetails) => {
    console.log('Sending reminder email:', userEmail, petName, reminderDetails); 
    
    const subject = 'Reminder: Task for your pet';
    const text = `Hello!
  
  This is a friendly reminder for your upcoming task : "${reminderDetails.title}" with your pet, ${petName}.
  
  Task Details:
  - Date: ${reminderDetails.date}
  - Time: ${reminderDetails.time}
  - Description: ${reminderDetails.description}
  
  We hope everything goes smoothly!
  
  Best regards,  
  The Furever Friends Team`;
  
  
    const mailOptions = {
      from: 'fureverfriends2216@gmail.com',
      to: userEmail,
      subject: subject,
      text: text,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log('Reminder email sent successfully');
    } catch (error) {
      console.error('Error sending reminder email:', error);
    }
  };


//route to schedule remider email
const scheduleReminderEmails = (date, time, userEmail, petName, reminderDetails) => {
    const reminderDateTime = new Date(`${date}T${time}`);
  
    // One day before reminder
    const oneDayBefore = new Date(reminderDateTime);
    oneDayBefore.setDate(oneDayBefore.getDate() - 1);
  
    // Two hours before reminder
    const twoHoursBefore = new Date(reminderDateTime);
    twoHoursBefore.setHours(twoHoursBefore.getHours() - 2);
  
    // Send email one day before reminder
    const dayBeforeCron = `${oneDayBefore.getMinutes()} ${oneDayBefore.getHours()} ${oneDayBefore.getDate()} ${oneDayBefore.getMonth() + 1} *`; 
    cron.schedule(dayBeforeCron, async () => {
      await axios.post('http://localhost:3001/send-reminder-email', {
        userEmail, petName, reminderDetails
      });
    });
  
    // Send email two hours before reminder
    const twoHoursBeforeCron = `${twoHoursBefore.getMinutes()} ${twoHoursBefore.getHours()} ${twoHoursBefore.getDate()} ${twoHoursBefore.getMonth() + 1} *`; 
    cron.schedule(twoHoursBeforeCron, async () => {
      await axios.post('http://localhost:3001/send-reminder-email', {
        userEmail, petName, reminderDetails
      });
    });
  };
  


//route for sending posting the reminders on db.
app.post('/reminders', async (req, res) => {
    try {
      const { petId, title, description, date, time, userEmail } = req.body;

      const pet = await ProfileModel.findById(petId); 
  
      if (!pet) {
        return res.status(404).json({ message: 'Pet not found' });
      }
  
      const newReminder = new Reminder({
        petId, 
        petName: pet.petsName, 
        title,
        description,
        date,
        time,
        userEmail
      });
      const savedReminder = await newReminder.save();
  
      scheduleReminderEmails(date, time, userEmail, pet.petsName, {
        title,
        date,
        time,
        description
      });
  
      res.status(200).json(savedReminder);
    } catch (err) {
      console.error('Error saving reminder:', err);
      res.status(500).json({ message: 'Error saving reminder' });
    }
  });

//route to send reminder emails
app.post('/send-reminder-email', async (req, res) => {
    const { userEmail, petName, reminderDetails } = req.body;
    
    try {
      await sendReminderEmail(userEmail, petName, reminderDetails);
      res.status(200).send({ message: 'Reminder email sent successfully' });
    } catch (err) {
      res.status(500).send({ message: 'Error sending reminder email', error: err.message });
    }
  });

//deleting the reminders
app.delete('/reminder/:id', async (req, res)=>{
    try{
        const reminderId= req.params.id;
        const deletedReminder= await Reminder.findByIdAndDelete(reminderId);
        if(!deletedReminder){
            return res.status(404).json({message:'Reminder not found'});
        }
        res.status(200).json({message:'Reminder deleted successfully'});
    } catch (error){
        console.error(error);
        res.status(500).json({message:'Server Error'});
    }
});

//Backend for emergency card saving
app.post('/emergency-card', async (req, res) => {
    const {petName, ownerName, contactNumber, emergencyText,senderEmail, recipientEmail}= req.body;

    const emergencyCard= new EmergencyCard({
        petName,
        ownerName,
        contactNumber,
        emergencyText,
        senderEmail,
        recipientEmail,
    });

    try {
        const savedCard= await emergencyCard.save();
        res.status(200).json(savedCard);

    } catch (error){
        console.error('Error saving emergency card', error);
        res.status(500).json({error:'Something went wrong. Please try again'});
    }
});

//route for sending email for emergency card
app.post('/send-email', async (req, res)=>{
    const {emergencyCardId}= req.body;
    try{
        const card= await EmergencyCard.findById(emergencyCardId);
        if(!card){
            return res.status(404).json({success:false, message:'Emergeny card not found'});
        }
        console.log('Card details:', card);

        const {recipientEmail, emergencyText, senderEmail, petName, ownerName, contactNumber}= card;
        console.log('Sender Email:', senderEmail);

        const emailSubject= `Emergency Alert for pet:${petName} | From: ${ownerName}`;
        const emailBody= `
        Emergency Card Details:
        Pet Name: ${petName}
        Owner Name: ${ownerName}
        Contact Number: ${contactNumber}
        Emergency Details: ${emergencyText}`;

        const emailDetails={
            from:senderEmail,
            to: recipientEmail,
            subject: emailSubject,
            text: emailBody,
        };

        const info= await transporter.sendMail(emailDetails);
        res.status(200).json({success:true, message:'Email sent successfully', response: info.response});
    } catch (error){
        console.error('Error sending email', error);
        res.status(500).send('Failed to send email');
    }
});

//route for changing password
app.put("/change-password", async (req, res)=>{
    try{
        const {currentPassword, newPassword}= req.body;

        if(!req.session.user){
            return res.status(401).json({message:'User is not authenticated'});
        }

        const user= await UserModel.findById(req.session.user.id);
        if(!user) {
            return res.status(404).json({message:'User not found'});

        }

        const passwordMatch= await bcrypt.compare(currentPassword, user.password);
        if(!passwordMatch){
            return res.status(401).json({message:'Incorrect current password.'});
        }

        if(currentPassword === newPassword){
            return res.status(400).json({message:'New password cannot be the same as the current password'});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword= await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        res.status(200).json({message:'Password updated successfully.'});
    } catch (error){
        res.status(500).json({message:'Server error', error});
    }

});

//route for updating the user details
app.put('/user/update', upload.single('image'), async (req, res) => {
    if (!req.session.user) {
      return res.status(401).json("Not authenticated");
    }
    const { name } = req.body;
    const imagePath = req.file ? req.file.path : null; 
  
    if (!name && !imagePath) {
      return res.status(400).json("No data to update");
    }
    try {
      const updatedUser = await UserModel.findByIdAndUpdate(
        req.session.user.id,
        { name, image: imagePath },
        { new: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json("User not found");
      }
      req.session.user.name = updatedUser.name;
      req.session.user.image = updatedUser.image;
  
      res.json({ user: updatedUser });
    } catch (err) {
      console.error("Error updating user details:", err);
      res.status(500).json("Error updating user details");
    }
  });

//route for forgog password and sending email for link

const crypto= require ('crypto');

app.post("/forgot-password", async (req, res) => {
    try{
        const {email}= req.body;
        const user= await UserModel.findOne({email});

        if(!user){
            return res.status(404).json({message:"User not found"});
        }

        const resetToken= crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken= resetToken;
        user.resetPasswordExpires= Date.now() +  3600000;
        await user.save();

        const transporter= nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:'fureverfriends2216@gmail.com',
                pass:'ofxo xtte mmic smjo',
            }
        });
        
        const resetUrl= `http://localhost:3000/reset-password/${resetToken}`;
        const mailOptions={
            from:'fureverfriends2216@gmail.com',
            to: email,
            subject:'Password Reset Requests',
            text: `Click the following link to reset your password: ${resetUrl}`,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({message:"Password reset email sent successfully."});
    } catch (error){
        console.error('Erro in forgot password API:', error);
        res.status(500).json({message:"Server error"});
    }
});


//route for reseting password
app.post("/reset-password", async (req, res) => {
    try {
      const { token, newPassword } = req.body;
      const user = await UserModel.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },  // Token should not be expired
      });
  
      if (!user) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
  
      // Update the user's password
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;  // Remove the reset token
      user.resetPasswordExpires = undefined;  // Remove the token expiry
      await user.save();
  
      res.status(200).json({ message: "Password successfully reset!" });
    } catch (error) {
      console.error('Error in reset-password API:', error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  //routes for posting the route in community
 app.post('/create', upload.single('image'),async (req, res) =>{
    try{
        const{postContent, userName, userImage}= req.body;
        const image =req.file ? req.file.path.replace(/\\/g, '/'):null;
        if(!postContent || !userName || !userImage){
            return res.status(400).json({error:'Missing required fields'});
        }

        const userId= req.session.user?.id;
        if(!userId){
            return res.status(401).json({error:'User not authenticated'});
        }

        const newPost= new Post({
            postContent,
            image,
            user:userId,
            userName,
            userImage,
        });

        const savedPost= await newPost.save();
        res.status(201).json(savedPost);
    } catch (error){
        console.error('Error:', error);
        res.status(400).json({error:'Error creating post'});
    }
 });

 //backend route for getting the posts
 app.get('/posts', async(req,res) =>{
    try{
        const posts= await Post.find().populate('user', 'userName userImage');
        res.status(200).json(posts);
    } catch (error){
        console.error('Error fetching posts:', error);
        res.status(500).json({error:'Error fetching posts'});
    }
 });

 //like post route along with notification
app.post('/like/:id', async (req, res) => {
    const postId = req.params.id;
  
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    } 
    try {
      // Fetch the post and populate the user reference
      const post = await Post.findById(postId).populate('user');
      
      // Check if the post is found
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
      console.log("Post user:", post.user);
      if (!post.user) {
        return res.status(500).json({ error: 'Post user data not found' });
      } 
      const userId = req.session.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }  
      // Ensure post.likes is an array and clean it up
      post.likes = post.likes.filter(like => like); 
      // Check if the user has already liked the post
      const isAlreadyLiked = post.likes.some(like => like.toString() === userId.toString());
  
      if (!isAlreadyLiked) {
        // Add user to likes
        post.likes.push(userId);
        post.likesCount += 1;
      } else {
        // Remove user from likes
        post.likes = post.likes.filter(like => like.toString() !== userId.toString());
        post.likesCount -= 1;
      }
  
      // Save the updated post
      await post.save();
  
      // Send notification to the user who posted the post
      if (post.user._id.toString() !== userId.toString()) { // Prevent sending notification to the user who liked their own post
        const notificationMessage = `${isAlreadyLiked ? 'unliked' : 'liked'} your post.`; 
  
        
        const notification = new Notification({
          toUser: post.user._id,
          fromUserName: req.session.user.name,
          fromUserImage: req.session.user.image,  
          postId: post._id,
          message: notificationMessage,
          type: 'like', 
        });
  
        await notification.save();
      }
      // Return the updated post as response
      const updatedPost = await Post.findById(postId).populate('user');
      res.json(updatedPost);
  
    } catch (error) {
      console.error('Error liking post:', error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  });

//route for comments in posts along with notification
app.post('/comment/:postId', async (req, res) => {
    const { content, userName, userImage } = req.body;
    const userId = req.session.user?.id; 
  
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' }); 
    }
  
    try {
      const post = await Post.findById(req.params.postId);
      if (!post) return res.status(404).json({ message: 'Post not found' });
  
      const newComment = {
        user: userId,
        content,
        userName,
        userImage,
        createdAt: new Date(),
      };
  
      // Add comment to the post
      post.comments.push(newComment);
      await post.save();
  
      // Send notification to the user who posted the post
      if (post.user._id.toString() !== userId.toString()) { 
        const notificationMessage = `commented on your post.`;
  
        const notification = new Notification({
          toUser: post.user._id,
          fromUserName: userName,
          fromUserImage: userImage,  
          postId: post._id,
          message: notificationMessage,
          type: 'comment', 
        });
  
        await notification.save(); // Save notification to the database
      }
  
      res.status(200).json(post); 
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Something went wrong' });
    }
  });


// rooute for getting notification
app.get('/notifications', async (req, res) => {
    const userId = req.session.user?.id;
  
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
  
    try {
      const notifications = await Notification.find({ toUser: userId }).sort({ createdAt: -1 });
      res.json(notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  });

  
//route for mark all as read route and update if read
app.post('/notifications/markAllAsRead', async (req, res) => {
    try {
      const userId = req.session.user?.id;
      const objectId = new mongoose.Types.ObjectId(userId);
  
      await Notification.updateMany(
        { toUser: objectId, isRead: false },
        { $set: { isRead: true } }
      );
  
      res.json({ success: true });
    } catch (err) {
      console.error('Error marking notifications as read:', err);
      res.status(500).json({ error: 'Failed to mark all notifications as read' });
    }
  });

  //route for deleting notification after clicking Clear all
  app.delete('/notifications/clear', async (req, res) => {
    try {
      const userId = req.session.user?.id;
      console.log('User ID from session:', userId);
  
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
  
      const objectId = new mongoose.Types.ObjectId(userId);
  
      const result = await Notification.deleteMany({ toUser: objectId });
  
      console.log('Delete Result:', result);
  
      res.status(200).json({ message: `${result.deletedCount} notifications cleared` });
    } catch (error) {
      console.error('Error clearing notifications:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

 //route for fetching my posts
 app.get('/myposts/:userName', async (req, res) => {
    const { userName } = req.params;
    try {
        const posts = await Post.find({ userName }); 
        res.json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
  });
  
  //route for deleting the posts
  app.delete('/post/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        const deletedPost = await Post.findByIdAndDelete(postId);
        if (!deletedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ message: 'Server error while deleting post' });
    }
});

//routes for logout
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.log('Error destroying session:', err);
        return res.status(500).send({ success: false, message: 'Logout failed' });
      }
      res.clearCookie('connect.sid'); // Clear session cookie
      return res.send({ success: true });
    });
  });

  //roues for posting the vet appointment
  app.post('/appointments', async (req, res) => {
    const { ownerName, petName, age, gender, contactNumber, location, date, time } = req.body;
    try {
      const newAppointment = new VetAppointment({
        ownerName,
        petName, 
        age,
        gender,
        contactNumber,
        location,
        date,
        time,
      });
      await newAppointment.save();
      res.status(201).json({ message: 'Appointment created successfully', newAppointment });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create appointment', message: error.message });
    }
  });

  //route for getting the appointment
  app.get('/appointments/:petName', async (req, res) => {
    const { petName } = req.params;
    try {
      const appointments = await VetAppointment.find({ petName });
      res.json({ appointments });
    } catch (error) {
      console.error('Error fetching appointments:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  //routes for deleting the appointmnets
  app.delete('/appointments/:appointmentId', async (req, res) => {
    const { appointmentId } = req.params;
    try {
      const appointment = await VetAppointment.findByIdAndDelete(appointmentId); 
      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      } 
      res.status(200).json({ message: 'Appointment deleted successfully' });
    } catch (error) {
      console.error('Error deleting appointment:', error);
      res.status(500).json({ message: 'Failed to delete appointment', error: error.message });
    }
  });
  