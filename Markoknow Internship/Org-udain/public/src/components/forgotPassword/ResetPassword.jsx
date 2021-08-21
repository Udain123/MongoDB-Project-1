/* eslint-disable no-useless-escape */
/* eslint-disable no-useless-computed-key */
import {  Box, TextField } from '@material-ui/core';
import React, { useState, useEffect } from 'react'
import {Link} from "react-router-dom";
import usePasswordValidator from "../auth/passwordutils";
import Modal from '@material-ui/core/Modal';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import { makeStyles } from '@material-ui/core/styles';
import "../../stylesheets/loginform.css"
import axios from 'axios';

require("dotenv").config();
const DOMAIN = process.env.REACT_APP_DOMAIN;


function rand() {
    return Math.round(Math.random() * 20) - 10;
  }
  
  function getModalStyle() {
    const top = 50 + rand();
    const left = 50 + rand();
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }
  
  const useStyles = makeStyles((theme) => ({
    paper: {
      position: 'absolute',
      width: 250,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      ['@media only screen and (max-width: 420px)']: {
        marginLeft: 30,                   // secondary
      },
    },
  }));

function ResetPassword({match}) {

    const [email, setEmail] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [password, setPassword, passwordError] = usePasswordValidator({
        min: 8,
        max: 15
    });
    const [error, setError] = useState("");
    const [response, setResponse] = useState("Error !! Please try again");
    //eslint-disable-next-line no-unused-vars

    const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);


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

    useEffect(()=>{
      axios
      .get(`${DOMAIN}/reset`,{
      params: {
        resetPasstoken: match.params.token
      }
    })
    .then((response)=>{
      if(response.data.message === "password reset link a-ok"){
      setEmail(response.data.email); 
      console.log(response.data.message);
    }else{
        setError(response.data);
        console.log(response.data);
    }
    })
    .catch(err => {
    console.log(err);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

      const handleOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };
    
      const body  = (
        <div style={modalStyle} className={classes.paper}>
          {response === "password updated" ? (<h2 style={{color:"green"}} id="simple-modal-title">Success</h2>) : 
          (<h2 style={{color:"red"}} id="simple-modal-title">Failure</h2>)}
          <p id="simple-modal-description">
            {response} 
          </p>
          {response === "password updated" &&
          <p id="simple-modal-description">
            Now you can login with your new password. 
          </p>}
          <button style={{backgroundColor:"grey"}}>
            <Link to="/" style={{ textDecoration:"none", color:"black"}} className="btn-primary">Home</Link>
          </button>
        </div>
      );

      const clearset = () => {
          setEmail("");
          setPassword("");
          setConfirmPassword("");
      }

  var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

  const validationForm = () => {
    if(password.length < 8){
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
        console.log(email);
        if(validationForm()){
        console.log("validate");
        const registered = {
          email: email,
          password: password,
        };
        axios
      .post(`${DOMAIN}/api/updatepassword`, registered)
      .then((response) => {
          console.log(response.data.message);
          setResponse(response.data.message);
          clearset();
          handleOpen();
        })
        .catch((err) => {
            console.log(err);
            setError("Post Request Error");
        });
      }
      else{
        setError("Validation Error!! Please fill the form correctly");
      }
    };

    return (
    <div className="Login_Form">

    { error.length > 0 && 
      <div style={{width: "21rem", margin: "auto" }} className="Alert_type">
      <Alert 
          severity="error"
      >
      <AlertTitle>ERROR OCCURED</AlertTitle>
        <strong>{error}</strong> 
        </Alert>
        </div>
    }

    <Box
        boxShadow={3}
        bgcolor="#bfffe3"
        m={1}
        p={1}
        style={{ width: "20rem", height: "20rem", margin: "auto" }}
        className="Box_type"
    >
      <form className="login_form" onSubmit={handleSubmit}>
        <h3>Reset Password</h3>

        <span className="error">{passwordError}</span>
        <TextField
          style={{ paddingBottom: "15px", width: "100%" }}
          value={password}
          variant="outlined"
          onChange={e => setPassword(e.target.value)}
          type="password"
          required
          label="New Password"
        />
        
        <span className="error">{confirmPasswordError}</span>
        <TextField
          style={{ paddingBottom: "15px", width: "100%" }}
          value={confirmPassword}
          variant="outlined"
          onChange={e => setConfirmPassword(e.target.value)}
          type="password"
          label="Confirm New Password"
        />
        
        <div className="buttons">
            <button type="submit" variant="contained" className="btn btn-primary btn-lg">
                Submit
            </button>
        </div>
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
        { body }
        </Modal>
      </form>
    </Box>
    </div>
    )
}

export default ResetPassword