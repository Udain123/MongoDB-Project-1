/* eslint-disable no-useless-computed-key */
import React, { useState } from 'react';
import {  Box } from '@material-ui/core';
import {isBrowser, isMobile} from "react-device-detect";
import "../../stylesheets/partnership.css";
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import axios from "axios";
import { HashLink } from 'react-router-hash-link';
import Modal from '@material-ui/core/Modal';
import { Link } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
//import { Link } from "react-router-dom";
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



function ApplyForm() {
  // let body ="";
  //////////////////////////////////////////
    const [user,setUser]=useState({
      fullName:"",
      college:"",
      course:"",
      contact:"",
      mail:"",
      linkedin:"",
      inspire:"",
      industry:"",
      build:""
    });
    // let name, value;

    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);


    const handleOpen = () => {
        setOpen(true);
      };
      const handleClose = () => {
        setOpen(false);
      };

    const handleChange = e => {
        const {name, value} = e.target;
        setUser({
          ...user,
          [name]: value
        })
    }
    const handleSubmit = (e) => {
      e.preventDefault() 
      const {
        fullName,
        college,
        course,
        contact,
        mail,
        linkedin,
        inspire,
        industry,
        build
       } = user
       if(fullName && college && course && contact && mail && linkedin && inspire && industry && build)
       {
          axios.post("http://localhost:3002/experience",user)
          .then((res) => {
            if(res===422){
              <h2 id="simple-modal-title">Error Occured</h2> 
            }
            else{
              <h2 id="simple-modal-title">Thank You</h2>
            }
            if(res===422){
              <p className="simple-modal-desc" id="simple-modal-description">PLEASE TRY AGAIN!!!</p>
            }
            else{
              <p className="simple-modal-desc" id="simple-modal-description">MARKOKNOW WARMLY ACCEPTS YOUR EXPERIENCE APPLICATION.</p>
            }
            <div className="buttons">
                <Link to="/dashboard" onClick={handleClose} style={{ textDecoration:"none", color:"black"}}>
                 <button className="btn btn-primary btn-lg">
                   Dashboard
                 </button></Link>
            </div>
          })
       }
       else {
          alert("Please fill all the details");
       }
    }
    
   
    return (
        <>

            <Modal
            // open={open}
            // onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            {/* {body} */}
            </Modal>
            <Box
                boxShadow={4}
                bgcolor="white"
                m={1}
                p={1}
                className="apply_form"
                id="apply-form"
            >
            {isBrowser && 
            <h2 className="form_heading">Apply for Experience</h2>
            //<p className="partner_para">Know the Journey of Entrepreneurship from someone who understand this{isBrowser && <br/>}</p>
            }
            {isMobile && 
            {/* <h1 className="form_heading">Know the Journey of Entrepreneurship from someone who understand this</h1> */}
            }	
            <p className="partner_para">Know the Journey of Entrepreneurship from someone who understand this {isMobile && <br/>}</p>
            <p className="partner_para">better than you{isMobile && <br/>}</p>
            {/* <br/> */}

            <form  className="organise_form" >
            {/* {console.log("User", user)} */}
            <div class="partnership_input">
                <input type="text" name="fullName" class="action_input" autocomplete="off" value={user.fullName} onChange={handleChange} required placeholder="Full Name" />
                <input type="text" name="college" class="action_input" autocomplete="off"  value={user.college} onChange={handleChange} required placeholder="College" />                
            </div>
            <div class="partnership_input">
                <input type="text" name="course" class="action_input " autocomplete="off" value={user.course} onChange={handleChange} placeholder="Course and Year" />
                <input type="contact" name="contact" class="action_input " autocomplete="off" value={user.contact} onChange={handleChange} placeholder="Contact No." />   
                <input type="email" name="mail" class="action_input " autocomplete="off" value={user.mail} onChange={handleChange} placeholder="MAIL ID" />
                <input type="text" name="linkedin" class="action_input " autocomplete="off" value={user.linkedin} onChange={handleChange} placeholder="LinkedIN" />                
            </div>
            <input type="text" name="inspire" class="action_input1 " autocomplete="off" value={user.inspire} onChange={handleChange} required placeholder="What inspires you in Entrepreneurship? " />
            <input type="text" name="industry" class="action_input1 " autocomplete="off" value={user.industry} onChange={handleChange}  required placeholder="What industry and work type you want to assume? " />
            <input type="text" name="build" class="action_input1 " autocomplete="off" value={user.build} onChange={handleChange}   placeholder="How would this help you in building your Startup? " />
            <br/>
            
            <br/>
            <button type="submit" value="apply" onClick={handleSubmit}  class="action_btn1">Submit</button>
            </form>
            <div className="arrow_detail">
                <HashLink className="hash_link arrow_detail_btn" smooth to={'/experience#experience-page'}><ArrowUpwardIcon/></HashLink>
            </div>
            </Box>
            
            
        </>
    )
}

export default ApplyForm;