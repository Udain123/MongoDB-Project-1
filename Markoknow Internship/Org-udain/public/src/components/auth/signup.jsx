/* eslint-disable no-useless-computed-key */
/* eslint-disable no-useless-escape */
import {  Box, TextField } from '@material-ui/core';
import React, { useState, useEffect } from 'react'
import {validateEmail} from "./validateEmail";
import usePasswordValidator from "./passwordutils";
import "../../stylesheets/signupform.css"
import axios from "axios";
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import {Link} from "react-router-dom";
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
require("dotenv").config();
const DOMAIN = process.env.REACT_APP_DOMAIN;

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 350,
    textAlign: 'center',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    ['@media only screen and (max-width: 420px)']: {
      width: 220, 
      marginLeft: 0,                 // secondary
    },
  },
}));


function Signup() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    //const [error, setError] = useState(true);
    const [password, setPassword, passwordError] = usePasswordValidator({
        min: 8,
        max: 15
    });
    const [resp,setResp] = useState("");
    const [mess,setMess] = useState("");
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  //modal body
  

  const body  = (
    <div style={modalStyle} className={classes.paper}>
      {resp === "Verification Email has been sent to your given email." ? (<h2 id="simple-modal-title">SUCCESS</h2>) : 
      (<h2 id="simple-modal-title">Error Occured</h2>)}
      <p className="simple-modal-desc" id="simple-modal-description">
      {resp} 
      </p>
      <div className="buttons">
          <Link to="/login" onClick={handleClose} style={{ textDecoration:"none", color:"black"}}>
          <button className="btn btn-primary btn-lg">
            Login
          </button></Link>
      </div>
    </div>
);

  useEffect(
    () => {
      if (!email) {
        setEmailError("");
      } else {
        if (validateEmail(email)) {
          setEmailError("");
        } else {
          setEmailError("Please enter a valid email.");
        }
      }
    },
    [email]
  );

  useEffect(
    () => {
      if (!confirmPassword || !password) {
        setConfirmPasswordError("");
      } else {
        if (password !== confirmPassword) {
          setConfirmPasswordError("Passwords must match.");
        } else {
          setConfirmPasswordError("");
        }
      }
    },
    [password, confirmPassword]
  );

  const clearset = () => {
    setEmail("");
    setName("");
    setConfirmPassword("");
    setConfirmPasswordError("");
    setPassword("");
    setEmailError("");
    setMess("");
}

var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

  const validationForm = () => {
    if(name.length < 1){
      return false;
    }
    else if(password.length < 8){
      return false;
    }
    else if(format.test(password)===false){
      return false;
    }
    else if(!password.match(/\d/)){
      return false;
    }
    else if(confirmPassword !== password){
      return false;
    }
    else{
      return true;
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if(validationForm()){

      const registered = {
        name: name,
        email: email,
        password: password,
      };
    axios
      .post(`${DOMAIN}/signup`, registered)
      .then((response) => {
        console.log(response.data);
        setResp(response.data.message);
        if(response.data.message === "Verification Email has been sent to your given email." ){
        clearset();
        handleOpen();}
      })
      .catch((err) => {
        console.log(err);
        setMess("Account already exists with given details.")
      });

    //console.log(username,email,password);
  }
    else
    setMess("Validation Error!! Please fill the form correctly");  
};

  return (
    <div className="Signup_Form">
    { mess.length > 0 && 
      <div style={{width: "21rem", margin: "auto" }} className="Alert_type">
      <Alert 
          severity="error"
      >
      <AlertTitle>ERROR OCCURED</AlertTitle>
        <strong>{mess}</strong> 
        </Alert>
        </div>
    }
    <Box
        boxShadow={3}
        bgcolor="#bfffe3"
        m={1}
        p={1}
        style={{ width: "20rem", height: "32rem", margin: "auto" }}
        className="Box_type"
    >
      <form className="signup_form" onSubmit={handleSubmit}>
        <h3>SignUp</h3>
        <TextField
          style={{ paddingBottom: "15px", width: "100%" }}
          value={name}
          variant="outlined"
          onChange={e => setName(e.target.value)}
          type="text"
          label="Username"
        />

        <span className="error">{emailError}</span>
        <TextField
          style={{ paddingBottom: "15px", width: "100%" }}
          value={email}
          variant="outlined"
          onChange={e => setEmail(e.target.value)}
          type="email"
          required
          label="Email"
          autoComplete="off"
        />
        
        <span className="error">{passwordError}</span>
        <TextField
          style={{ paddingBottom: "15px", width: "100%" }}
          value={password}
          variant="outlined"
          onChange={e => setPassword(e.target.value)}
          type="password"
          required
          label="Password"
        />
        
        <span className="error">{confirmPasswordError}</span>
        <TextField
          style={{ paddingBottom: "15px", width: "100%" }}
          value={confirmPassword}
          variant="outlined"
          onChange={e => setConfirmPassword(e.target.value)}
          type="password"
          label="Confirm Password"
        />

        <div>
            Already a member? <Link exact="true" to="/login">click here</Link>
        </div>
        <br/>
        
        <div className="buttons">
            <button type="submit" variant="contained" className="btn btn-primary btn-lg">
                SignUp
            </button>
        </div>
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
           >
          {body}
        </Modal>
      </form>
    </Box>
    </div>
  );
}


export default Signup
