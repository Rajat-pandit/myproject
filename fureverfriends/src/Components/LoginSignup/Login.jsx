import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import {Grid2, Link, Button, Paper, TextField, Typography} from "@mui/material";

function Login({setIsLoggedIn, isLoggedin}) {
    const [email, setEmail]=useState("");
    const [password, setPassword]=useState("");
    const navigate= useNavigate();
    const handleLogin=(e)=>{
        e.preventDefault();
        setIsLoggedIn(true);
        navigate("/home");
    };

    const paperstyle={padding: "2rem", margin:"100px auto", borderRadius:"1rem", boxShadow:"10px 10px 10px"};
    const heading={fontSize:"2.5rem", fontWeight:"600"};
    const row={display:"flex", marginTop:"2rem"};
    const btnStyle={marginTop:"2rem", fontSize:"1.2rem", fontWeight:"700", backgroundColor:"blue", borderRadius:"0.5rem"};
    const label={fontWeight:"700"};

  return (
    <div>
        <Grid2 align="center" className="wrapper">
            <Paper style={paperstyle} sx={{width:{xs: '80vw', sm:'50vw', md:'40vw', lg:'30vw', xl:'20vw'}, height:{lg:'60vh'}}}>
                <Typography component="h1" variant='h5' style={heading}>Login</Typography>
                <form onSubmit={handleLogin}>
                    <span style={row}>
                        <TextField sx={{label:{fontWeight:'700', fontSize:"1.3rem"}}} style={label} label="Email" fullWidth variant='outlined' type="email" placeholder='Enter Email' name='email' onChange={(e)=> setEmail(e.target.value)}/>
                    </span>
                    <span style={row}>
                    <TextField sx={{label:{fontWeight:'700', fontSize:"1.3rem"}}} style={label} label="Password" fullWidth variant='outlined' type="password" placeholder='Enter Password' name='password' onChange={(e)=> setPassword(e.target.value)}/>
                    </span>
                    <Button style={btnStyle} variant='contained' type='submit'>Login</Button>

                </form>
                <p>Don't have an account? <Link href="/signup">SignUp</Link></p>
            </Paper>
        </Grid2>
    </div>
  );
}

export default Login;