import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import {Grid2, Link, Button, Paper, TextField, Typography, IconButton} from "@mui/material";
import {Visibility, VisibilityOff} from '@mui/icons-material';
import axios from 'axios';

function Login({setIsLoggedIn, setUser}) {
    const [email, setEmail]=useState("");
    const [password, setPassword]=useState("");
    const [error, setError]= useState("");
    const [showPassword, setShowPassword]= useState(false);
    const navigate= useNavigate();


    const handleLogin=(e)=>{
        e.preventDefault();
        axios.post("http://localhost:3001/login", {email, password}, {withCredentials: true})
            .then(result => {
                if(result.data.message === "Success"){
                    axios.get('http://localhost:3001/user', {withCredentials: true})
                        .then(response => {
                            if(response.data.user){
                                setIsLoggedIn(true);
                                setUser(response.data.user);
                                localStorage.setItem('userName',response.data.user.name);
                                localStorage.setItem('userEmail', response.data.user.email);
                                localStorage.setItem('userImage', response.data.user.image);
                                navigate("/home", {state: {user: response.data.user}});
                            }
                        });
                    
                }else{
                    setError("Login failed");
                }
            })
            .catch(err => {
                if(err.response){
                    if(err.response.status === 404){
                        setError("Email not found. Please check your email.");
                    } else if (err.response.status === 500){
                        setError("Incorrect password. Please try again.");
                    } else{
                         setError("An error occured. Please try again.");   
                    }
                }else{
                    console.log(err);
                }
            });
        
    };

    const paperstyle={padding: "2rem", margin:"100px auto", borderRadius:"1rem", boxShadow:"10px 10px 10px"};
    const heading={fontSize:"2.5rem", fontWeight:"600"};
    const row={display:"flex", marginTop:"2rem"};
    const btnStyle={marginTop:"2rem", fontSize:"1.2rem", fontWeight:"700", backgroundColor:"blue", borderRadius:"0.5rem"};
    const label={fontWeight:"700"};

  return (
    <div>
        <Grid2 align="center" className="wrapper">
            <Paper style={paperstyle} sx={{width:{xs: '80vw', sm:'50vw', md:'40vw', lg:'30vw', xl:'20vw'}, height:{lg:'65vh'}}}>
                <Typography component="h1" variant='h5' style={heading}>Login</Typography>
                <form onSubmit={handleLogin}>
                    <span style={row}>
                        <TextField sx={{label:{fontWeight:'700', fontSize:"1.3rem"}}} style={label} label="Email" fullWidth variant='outlined' type="email" placeholder='Enter Email' name='email' onChange={(e)=> setEmail(e.target.value)}/>
                    </span>
                    <span style={row}>
                    <TextField sx={{label:{fontWeight:'700', fontSize:"1.3rem"}}} style={label} label="Password" fullWidth variant='outlined' type={showPassword ? "text" : "password"} placeholder='Enter Password' name='password' onChange={(e)=> setPassword(e.target.value)} InputProps={{
                        endAdornment:(
                            <IconButton onClick={()=> setShowPassword(!showPassword)} edge='end'>
                                {showPassword ? <VisibilityOff/>: <Visibility/>}
                            </IconButton>
                        ),
                    }}/>
                    </span>
                    <Button style={btnStyle} variant='contained' type='submit'>Login</Button>

                </form>
                {error && <p style={{color: 'red', fontWeight:'600'}}>{error}</p>}
                <p>Don't have an account? <Link href="/signup">SignUp</Link></p>
                <p><Link href="/forgotpassword">Forgot Password?</Link></p>
            </Paper>
        </Grid2>
    </div>
  );
}

export default Login;

