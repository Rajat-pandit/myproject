import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {Grid2, Link, Button, Paper, TextField, Typography} from "@mui/material";
import axios from 'axios';

function Login() {
    const [email, setEmail]= useState("");
    const [password, setPassword]= useState("");
    const [error, setError]= useState("");
    const navigate= useNavigate();

    const handleLogin= (e)=>{
        e.preventDefault();
        axios.post("http://localhost:3001/admin/login", {email, password}, {withCredentials:true})
            .then(result=>{
                if(result.status === 200){
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('user', JSON.stringify(result.data));
                    navigate("/dashboard");
                }
            })
            .catch(err =>{
                if (err.response){
                    setError(err.response.data.message || "Invalid email or password");
                    console.error("Error during login:", err.response);
                } else{
                    console.error("Error during login:", err);
                    setError("Something went wrong. Please try again");
                }
            });
    };

    const paperStyle= {padding:"2rem", margin:"100px auto", borderRadius:"1rem", boxShadow:"10px 10px 10px rgba(0,0,0,0.1"};
    const heading = {fontsize:"2.5rem", fontWeight:"600", textAlign:"center"};
    const row ={ display:"flex", marginTop:"2rem"};
    const btnStyle= {marginTop:"2rem", fontSize:"1.2rem", fontWeight:"700", backgroundColor: "blue", borderRadius:"0.5rem"};

    return (
        <div>
            <Grid2 align="cebter" className="wrapper">
                <Paper style={paperStyle} sx={{
                    width:{
                        xs:'80vw',
                        sm:'50vw',
                        md:'40vw',
                        lg:'30vw',
                        xl:'20vw',
                    },
                    height: {
                        lg:'75vh',
                    }
                }}>
                    <Typography component="h1" variant="h5" style={heading}>Admin Login</Typography>
                    <form onSubmit={handleLogin}>
                        <TextField style={row} required sx={{label: {fontWeight:'700', fontSize:'1.3rem'}}} fullWidth label="Email" variant="outlined" type="email" placeholder="Enter Email" name="email" onChange={(e)=> setEmail(e.target.value)}></TextField>
                        <TextField style={row} required sx={{label: {fontWeight:'700', fontSize:'1.3rem'}}} fullWidth label="Password" variant="outlined" type="password" placeholder="Enter Password" name="password" onChange={(e)=> setPassword(e.target.value)}></TextField>
                        <Button style={btnStyle} variant="contained" type="submit">Login</Button>
                    </form>
                    {error && <p style={{color:'red', fontWeight:"600", textAlign:"center"}}>{error}</p>}
                    <p>Don't have an account? <Link href="/admin/signup">Sign Up</Link></p>
                </Paper>
            </Grid2>
        </div>
    );
}
export default Login;