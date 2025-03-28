import React,{useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid2, Link, Button, Paper, TextField, Typography} from '@mui/material';
import axios from 'axios';

function SignUp(){
  const [name, setName]= useState("");
  const [email, setEmail]= useState("");
  const [password, setPassword]= useState("");
  const [image, setImage]= useState(null);
  const [error, setError]= useState("");
  const navigate= useNavigate();

  const handleImageChange= (e)=>{
    setImage(e.target.files[0]);
  };

  const handleSignup= (e)=>{
    e.preventDefault();
    const formData= new FormData();
    formData.append("name", name);
    formData.append("email",email);
    formData.append("password",password);
    formData.append("image", image);

    axios.post("http://localhost:3001/signup", formData, {
      headers:{
        'Content-Type':'multipart/form-data',
      },
    })
        .then(result =>{
          if(result.status === 201){
            navigate("/login");
          }
        })
        .catch(err => {
          if( err.response && err.response.status === 400){
            setError("Email already in use. Please use different Email.");
          } else{
            console.log(err);
          }
        });
    
  };

  const paperstyle={padding:"2rem", margin:"100px auto", borderRadius:"1rem", boxShadow:"10px 10px 10px"};
  const heading={ fontSize:"2.5rem", fontWeight:"600"};
  const row= {display:"flex", marginTop:"2rem"};
  const btnStyle={marginTop:"2rem", fontSize:"1.2rem", fontWeight:"700", backgroundColor:"blue", borderRadius:"0.5rem"};

  return (
    <div>
      <Grid2 align="center" className="wrapper">
        <Paper style={paperstyle} sx={{
          width:{
            xs:'80vw',
            sm:'50vw',
            md:'40vw',
            lg:'30vw',
            xl:'20vw',
          },
          height:{
            lg:'85vh',
          }
        }}>
          <Typography component="h1" variant='h5' style={heading}>Signup</Typography>
          <form onSubmit={handleSignup}>
            <TextField style={row} required sx={{label: {fontWeight:'700', fontSize:"1.3rem"}}} fullWidth type="text" label='Enter Name' variant='outlined'  placeholder="Enter Name" name='name' onChange={(e) =>setName(e.target.value)}/>
            <TextField style={row} required sx={{label: {fontWeight:'700', fontSize:"1.3rem"}}} fullWidth label='Email' variant='outlined' type="email" placeholder='Enter Email' name='email' onChange={(e) =>setEmail(e.target.value)}/>
            <TextField style={row} required sx={{label: {fontWeight:'700', fontSize:"1.3rem"}}} fullWidth label='Password' variant='outlined' type="password"  placeholder="Enter Password" name='password' onChange={(e) =>setPassword(e.target.value)}/>
            <input type='file' accept='image/*' onChange={handleImageChange} style={row}/>
            <Button style={btnStyle} variant='contained' type='submit'>Signup</Button>
            
          </form>
          {error && <p style={{color: 'red', fontWeight:"600" }}>{error}</p>}
          <p>Already have an account? <Link href="/login">Login</Link></p>
        </Paper>
      </Grid2>
    </div>
  );
}

export default SignUp;