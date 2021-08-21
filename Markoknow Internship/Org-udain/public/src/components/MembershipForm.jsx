/* eslint-disable no-useless-computed-key */
import {  Box, TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import "../stylesheets/eventandmemberform.css"
import axios from "axios";
import {validateContact} from "./validateContact";
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from "react-router-dom";

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

function MembershipForm({isAuth}) {
    
    const [values, setValues] = useState({
        username:"",
        designation:"",
        company:"",
        contact:"",
        email:"",
        linked:"",
        probono:""
    });

  const [isLoading,setIsLoading] = useState(false);
  const [contactError,setContactError] = useState("");

  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [open1, setOpen1] = React.useState(false);
  const [response, setResponse] = React.useState("Error Occur!! Please Try Again");
  const isAuthUser = isAuth;

  useEffect(
    () => {
      if (!values.contact) {
        setContactError("");
      } else {
        if (validateContact(values.contact)) {
          setContactError("");
        } else {
          setContactError("Please enter a valid Mobile No.");
        }
      }
    },
    [values.contact]
  );

  useEffect(()=>{
    if(isAuthUser){
      handleClose2();
    }
    else{
      setTimeout(function(){handleOpen2();},2000);
    }
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen2 = () => {
    setOpen1(true);
  };

  const handleClose2 = () => {
    setOpen1(false);
  };

  const body  = (
    <div style={modalStyle} className={classes.paper}>
      {response === "saved succesfully" ? (<h2 style={{color:"green"}} id="simple-modal-title">Success</h2>) : 
      (<h2 style={{color:"red"}} id="simple-modal-title">Failure</h2>)}
      <p className="simple-modal-desc" id="simple-modal-description">
        {response.toUpperCase()} 
      </p>
      { response === "saved succesfully" &&
      <p className="simple-modal-desc" id="simple-modal-description">
        YOUR MEMBERSHIP APPLICATION IS IN PROCESS. WE'll SOON NOTIFY YOU FOR YOUR MEMBERSHIP ON YOUR MAIL. 
      </p>}
      <div className="buttons">
          <Link to="/dashboard" onClick={handleClose} style={{ textDecoration:"none", color:"black"}}>
          <button className="btn btn-primary btn-lg">
            Dashboard
          </button></Link>
      </div>
    </div>
  );

  const body2 = (
    <div style={modalStyle} className={classes.paper} >
      <h2 id="simple-modal-title">You are not Logged In</h2>
      <p className="simple-modal-desc" id="simple-modal-description">
        TO USE FUNCTIONALITY OF THIS PAGE, YOU NEED TO BE LOGGED IN TO THE SITE
      </p>
      <div className="buttons">
          <Link to="/login" onClick={handleClose2} style={{ textDecoration:"none", color:"black"}}>
          <button className="btn btn-primary btn-lg">
            Login
          </button></Link>
      </div>
    </div>
  );


    const handleUserName = (event) => {
        event.persist();
        setValues((values) => ({
            ...values,
            username: event.target.value,
        }));
    };
    
    const handleDesignation = (event) => {
        event.persist();
        setValues((values) => ({
            ...values,
            designation: event.target.value,
        }));
    };
    
    const handleCompany = (event) => {
        event.persist();
        setValues((values) => ({
            ...values,
            company: event.target.value,
        }));
    };
    
    const handleContact = (event) => {
        event.persist();
        setValues((values) => ({
            ...values,
            contact: event.target.value,
        }));
    };
    
    const handleEmail = (event) => {
        event.persist();
        setValues((values) => ({
            ...values,
            email: event.target.value,
        }));
    };
    
    const handleLinkedIn = (event) => {
        event.persist();
        setValues((values) => ({
            ...values,
            linked: event.target.value,
        }));
    };
    
    const handleProbono = (event) => {
        event.persist();
        setValues((values) => ({
            ...values,
            probono: event.target.value,
        }));
    };

    const clearset = () =>{
        if(!isLoading){
        setValues({
            username:"",
            designation:"",
            company:"",
            contact:"",
            email:"",
            linked:"",
            probono:""
        });
        }
    }
    
    const submitHandler = (e) => {
        e.preventDefault();
        setIsLoading(true);
        const apply = {
           name: values.username,
           userId: window.localStorage.getItem("id"),
           designation: values.designation,
           company: values.company,
           contact: values.contact,
           email: values.email,
           linkedin: values.linked,
           probono: values.probono, 
        };

    axios
      .post(`${DOMAIN}/membership`, apply , {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setResponse(response.data.message);
        setIsLoading(false);
        clearset();
        handleOpen();
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        setResponse("Post Request Error");
      });

    }
    
    return (
        <div className="Membership_form">
        <Modal
            open={open1}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            {body2}
        </Modal>

            { isLoading && 
                <div style={{width: "21rem", margin: "auto" }} className="Alert_type">
                    <Alert 
                        severity="info"
                >
                <AlertTitle>INFO</AlertTitle>
                    <strong>Please Wait for a while .... Email validation is going on</strong> 
                    </Alert>
                </div>
        }

            <Box
                boxShadow={3}
                bgcolor="#befaf2"
                m={1}
                p={1}
                className="Box_type"
                style={{ width: "20rem", height: "38rem", margin: "auto" }}
            >
                <form className="member_ship" onSubmit={submitHandler}>
                    <h2 className="apply_head">Apply for Markoknow Membership</h2> 
                    <TextField
                        style={{ paddingBottom: "10px", width: "100%" }}
                        type="text"
                        label="Full Name"
                        name="username"
                        value={values.username}
                        onChange={handleUserName}
                        autoComplete='off'
                        required
                        inputProps={{ maxLength: 20 }}
                    />
                    <TextField
                        style={{ paddingBottom: "10px", width: "100%" }}
                        type="text"
                        label="Designation"
                        name="designation"
                        value={values.designation}
                        onChange={handleDesignation}
                        autoComplete='off'
                        required
                    />
                    <TextField
                        style={{ paddingBottom: "10px", width: "100%" }}
                        type="text"
                        label="Company"
                        name="about"
                        value={values.company}
                        onChange={handleCompany}
                        autoComplete='off'
                    />
                    <span className="error">{contactError}</span>
                    <TextField
                        style={{ paddingBottom: "10px", width: "100%" }}
                        type="text"
                        label="Contact No."
                        name="contact"
                        value={values.contact}
                        onChange={handleContact}
                        autoComplete='off'
                        required
                    />
                    <TextField
                        style={{ paddingBottom: "10px", width: "100%" }}
                        type="email"
                        label="Email"
                        name="email"
                        value={values.email}
                        onChange={handleEmail}
                        autoComplete='off'
                        required
                    />
                    <TextField
                        style={{ paddingBottom: "10px", width: "100%" }}
                        type="text"
                        label="LinkedIn"
                        name="linked"
                        value={values.linked}
                        onChange={handleLinkedIn}
                        autoComplete='off'
                        required
                    /> 
                    <TextField
                        style={{ paddingBottom: "10px", width: "100%" }}
                        type="text"
                        label="Pro bono you can offer"
                        name="probono"
                        value={values.probono}
                        onChange={handleProbono}
                        autoComplete='off'
                    />
                    <br />
                    <br />
                    <div className="buttons">
                        <button type="submit" variant="contained" className="btn btn-primary btn-lg" disabled={isLoading}>
                            Apply
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

export default MembershipForm
