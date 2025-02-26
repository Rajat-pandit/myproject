const express= require("express");
const mongoose= require("mongoose");
const cors= require("cors");
const bcrypt= require("bcrypt");
const dotenv= require("dotenv");
const UserModel= require("./model/User");
const multer = require("multer");
const path = require("path");
const ProfileModel= require("./model/Profile");
const MedicalRecord= require("./model/MedicalRecord");
const PetModel= require("./model/Pet");
const RequestModel= require("./model/AdoptionRequest");
const session= require("express-session");
const MongoStore= require("connect-mongo");
const {ObjectId}= require('mongodb');
const nodemailer= require('nodemailer');
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
    resave:false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl:process.env.MONGO_URI
    }),
    cookie:{maxAge:24 * 60 * 60*  1000}
}));

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("connected to MongoDB"))
.catch(err => console.log("Failed to connect to MongoDB", err))

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

app.post("/signup", async(req , res) => {
    try{
        const{name, email, password} = req.body;
        const existingUser= await UserModel.findOne({email});
        if(existingUser){
            return res.status(400).json({error: "Email already exists"});
        }
        const hashedPassword= await bcrypt.hash(password, 10);
        const newUser= new UserModel({name, email, password:hashedPassword});
        const savedUser= await newUser.save();
        res.status(201).json(savedUser);
    } catch(error){
        res.status(500).json({error: error.message});
    }
});

app.post("/login", async (req, res) => {
    try{
        const {email, password}= req.body;
        const user = await UserModel.findOne({email});
        if (user){
            const passwordMatch= await bcrypt.compare(password, user.password);
            if(passwordMatch){
                req.session.user = {id: user._id, name: user.name, email: user.email};
                res.json("Success");
            } else{
                res.status(401).json("Password doesn't match");
            }
        } else{
            res.status(404).json("No Records found");
        }
    } catch (error){
        res.status(500).json({error: error.message});
    } 
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

//email dependicies
const transporter= nodemailer.createTransport({
    service:'gmail',
    auth:{
        user: 'razatp2203@gmail.com',
        pass: 'sduq lleg xryn qlak',
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
