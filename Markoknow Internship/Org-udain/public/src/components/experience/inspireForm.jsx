/* eslint-disable no-useless-computed-key */
import React, { useState } from 'react';
import {  Box } from '@material-ui/core';
import {isBrowser, isMobile} from "react-device-detect";
import "../../stylesheets/partnership.css";
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import axios from "axios";
import { HashLink } from 'react-router-hash-link';
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



function InspireForm() {
  const body ="";
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
    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);
    
    const handleOpen = () => {
        setOpen(true);
      };
    
    const handleClose = () => {
        setOpen(false);
      };

    let name, value;

    const handleInputs = (e) => {
      name = e.target.name;
      value  = e.target.value;
      setUser({...user, [name]:value})
    }
    
    const PostData = async (e) => {
        e.preventDefault();
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
        } = user;
        const res = await fetch("/api/experienceform", {
          method:"POST",
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            fullName,
            college,
            course,
            contact,
            mail,
            linkedin,
            inspire,
            industry,
            build
          })
        })

        const data = await res.json();
        
        body  = (
          <div style={modalStyle} className={classes.paper}>
            {data.status === 422 || !data ? (<h2 id="simple-modal-title">Error Occured</h2>) : 
            (<h2 id="simple-modal-title">Thank You</h2>)}
            { data.status === 422 || !data ?
            (<p className="simple-modal-desc" id="simple-modal-description">
            PLEASE TRY AGAIN!!!
            </p>):(<p className="simple-modal-desc" id="simple-modal-description">MARKOKNOW WARMLY ACCEPTS YOUR EXPERIENCE APPLICATION.</p>)}
            {/* {msg.length>0 && 
              <p className="simple-modal-desc">{msg}</p>
            } */}
            <div className="buttons">
                <Link to="/dashboard" onClick={handleClose} style={{ textDecoration:"none", color:"black"}}>
                <button className="btn btn-primary btn-lg">
                  Dashboard
                </button></Link>
            </div>
          </div>
      );
        
    }
    
  //////////////////////////////////
    // 
  //   const body  = (
  //     <div style={modalStyle} className={classes.paper}>
  //       {data.status === 422 || !data ? (<h2 id="simple-modal-title">Error Occured</h2>) : 
  //       (<h2 id="simple-modal-title">Thank You</h2>)}
  //       { data.status === 422 || !data ?
  //       (<p className="simple-modal-desc" id="simple-modal-description">
  //       PLEASE TRY AGAIN!!!
  //       </p>):(<p className="simple-modal-desc" id="simple-modal-description">MARKOKNOW WARMLY ACCEPTS YOUR EXPERIENCE APPLICATION.</p>)}
  //       {/* {msg.length>0 && 
  //         <p className="simple-modal-desc">{msg}</p>
  //       } */}
  //       <div className="buttons">
  //           <Link to="/dashboard" onClick={handleClose} style={{ textDecoration:"none", color:"black"}}>
  //           <button className="btn btn-primary btn-lg">
  //             Dashboard
  //           </button></Link>
  //       </div>
  //     </div>
  // );  
    return (
        <>

            <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            {body}
            </Modal>
            <Box
                boxShadow={4}
                bgcolor="white"
                m={1}
                p={1}
                className="inspire_form"
                id="inspire-form"
            >
            {isBrowser && 
            <h2 className="form_heading">Hiring Inspiring Entrepreneur</h2>
            //<p className="partner_para">Know the Journey of Entrepreneurship from someone who understand this{isBrowser && <br/>}</p>
            }
            {isMobile && 
            {/* <h1 className="form_heading">Know the Journey of Entrepreneurship from someone who understand this</h1> */}
            }	
            <p className="partner_para">Make your Journey by making others how to be Entrepreneur {isMobile && <br/>}</p>
            {/* <p className="partner_para">better than you{isMobile && <br/>}</p> */}
            {/* <br/> */}

            <form method="POST" className="organise_form" >
            <div class="partnership_input">
                <input type="text" name="fullname" class="action_input" autocomplete="off" value={user.fullname} onChange={handleInputs} required placeholder="Founders Name" />
                <input type="text" name="college" class="action_input" autocomplete="off"  value={user.college} onChange={handleInputs} required placeholder="Startup Name" />                
            </div>
            <div class="partnership_input">
                <input type="contact" name="contact" class="action_input " autocomplete="off" value={user.contact} onChange={handleInputs} placeholder="Contact No." />   
                <input type="email" name="mail" class="action_input " autocomplete="off" value={user.mail} onChange={handleInputs} placeholder="MAIL ID" />
                <input type="text" name="linkedin" class="action_input " autocomplete="off" value={user.linkedin} onChange={handleInputs} placeholder="Link of the Founder talking about version" />
                <input type="text" name="course" class="action_input " autocomplete="off" value={user.course} onChange={handleInputs} placeholder="Link of Startup" />                
            </div>
            <input type="text" name="inspire" class="action_input1 " autocomplete="off" value={user.inspire} onChange={handleInputs} required placeholder="What an inspiring Entrepreneurs learn from you? " />
            <input type="text" name="industry" class="action_input1 " autocomplete="off" value={user.industry} onChange={handleInputs}  required placeholder="Drop Description of the Position you would ike to hire for" />
            <br/>
            
            <br/>
            <button type="submit" value="inspire" onClick={PostData} class="action_btn1">Submit</button>
            </form>
            <div className="arrow_detail">
                <HashLink className="hash_link arrow_detail_btn" smooth to={'/experience#experience-page'}><ArrowUpwardIcon/></HashLink>
            </div>
            </Box>
            
            
        </>
    )
}

export default InspireForm;
