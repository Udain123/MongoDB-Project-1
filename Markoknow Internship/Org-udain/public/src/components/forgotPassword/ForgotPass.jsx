/* eslint-disable no-useless-computed-key */
import {  Box, TextField } from '@material-ui/core';
import React, { useState, useEffect } from 'react'
import {Link} from "react-router-dom";
import {validateEmail} from "../auth/validateEmail";
import Modal from '@material-ui/core/Modal';
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

function ForgetPass() {

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [response, setResponse] = useState("Error !! Please try again");
    // eslint-disable-next-line no-unused-vars

    const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);


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

      const handleOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };
    
      const body  = (
        <div style={modalStyle} className={classes.paper}>
          {response === "saved succesfully" ? (<h2 style={{color:"green"}} id="simple-modal-title">Success</h2>) : 
          (<h2 style={{color:"red"}} id="simple-modal-title">Failure</h2>)}
          <p id="simple-modal-description">
            {response} 
          </p>
          {response === "saved succesfully" &&
          <p id="simple-modal-description">
            Reset Password Link has been sent to your email. 
          </p>}
          <button style={{backgroundColor:"grey"}}>
            <Link to="/" style={{ textDecoration:"none", color:"black"}} className="btn-primary">Home</Link>
          </button>
        </div>
      );

      const clearset = () => {
          setEmail("");
          setEmailError("");
      }




      const handleSubmit = (e) => {
        e.preventDefault();
        const registered = {
          email: email,
        }; 
        axios
      .post(`${DOMAIN}/forgetpassword`, registered)
      .then((response) => {
        setResponse(response.data.message);
        clearset();
        handleOpen();
        })
        .catch((err) => {
            console.log(err);
            setResponse("Post Request Error");
        });
    };

    return (
    <div className="Login_Form">
    <Box
        boxShadow={3}
        bgcolor="#bfffe3"
        m={1}
        p={1}
        style={{ width: "20rem", height: "15rem", margin: "auto" }}
        className="Box_type"
    >
      <form className="login_form" onSubmit={handleSubmit}>
        <h3>Forgot Password</h3>
        <span className="error">{emailError}</span>
        <TextField
          style={{ paddingBottom: "15px", width: "100%" }}
          value={email}
          variant="outlined"
          onChange={e => setEmail(e.target.value)}
          type="email"
          required
          label="Email"
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

export default ForgetPass