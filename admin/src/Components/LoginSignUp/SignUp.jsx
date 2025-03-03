import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {Grid2,Link, Button, Paper, TextField, Typography} from "@mui/material";
import axios from 'axios';

function SignUp(){
    const[name, setName]= useState("");
    const [email, setEmail]= useState("");
    const [password, setPassword]= useState("");
    const [error, setError]= useState("");
    const navigate= useNavigate();

    const handleSignup= (e)=>{
        e.preventDefault();
        axios.post("http://localhost:3001/admin/signup", { name, email, password })
            .then(result => {
                if(result.status ===201){
                    navigate("/admin/login");
                }
            })
            .catch(err =>{
                if(err.response && err.response.status === 400){
                    setError("Email already in Use. Please Use a different email id");
                } else{
                    console.log(err);
                }
            });
    };

    const paperStyle ={padding:"2rem", margin:"100px auto", borderRadius:"1rem", boxShadow:"10px 10px 10px rgba(0,0,0,0.1"};
    const heading= {fontSize:"2.5rem", fontWeight:"600", textAlign:"center"};
    const row= {display:"flex", marginTop:"2rem"};
    const btnStyle={marginTop:"2rem", fontSize:"1.2rem", fontWeight:"700", backgroundColor:"blue",borderRadius:"0.5rem"};

    return(
        <div>
            <Grid2 align="center" className="wrapper">
                <Paper style={paperStyle} sx={{width:{
                    xs:'80vw',
                    sm:'50vw',
                    md:'40vw',
                    lg:'30vw',
                    xl:'20vw',
                }, height:{
                    lg:'75vh',
                }
                }}>
                    <Typography component='h1' varient='h5' style={heading}>Admin Signup</Typography>
                    <form onSubmit={handleSignup}>
                        <TextField style={row} required sx={{label: {fontWeight:'700', fontSize:'1.3rem'} }} fullWidth type="text" label="Enter Name" name="name" onChange={(e)=>setName(e.target.value)}></TextField>
                        <TextField style={row} required sx={{label: {fontWeight:'700', fontSize:'1.3rem'} }} fullWidth label="Email" variant="outlined" type="email" placeholder="Enter Email" name="email" onChange={(e)=>setEmail(e.target.value)}></TextField>
                        <TextField style={row} required sx={{label: {fontWeight:'700', fontSize:'1.3rem'} }} fullWidth label="Password" variant="outlined" type="password" placeholder="Enter password" name="password" onChange={(e)=>setPassword(e.target.value)}></TextField>
                        <Button style={btnStyle} variant="contained" type="submit">SignUp</Button>

                    </form>
                    {error && <p style={{color:'red', fontWeight:'600', textAlign:'center'}}>{error}</p>}
                    <p>Already have an account? <Link href="admin/login">Login</Link></p>
                </Paper>
            </Grid2>
        </div>
    );
};

export default SignUp;