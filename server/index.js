const express= require("express");
const mongoose= require("mongoose");
const cors= require("cors");
const bcrypt= require("bcrypt");
const dotenv= require("dotenv");
const UserModel= require("./model/User");
const session= require("express-session");
const MongoStore= require("connect-mongo");
dotenv.config();
const app= express();
app.use(express.json());
app.use(cors({
    origin:'http://localhost:3000',
    credentials: true
}));

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

app.get('/user', (req, res) => {
    if(req.session.user){
        res.json({user: req.session.user});
    } else{
        res.status(401).json("Not authenticated");
    }
});