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
const session= require("express-session");
const MongoStore= require("connect-mongo");
const {ObjectId}= require('mongodb');
dotenv.config();
const app= express();
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

