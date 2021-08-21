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

function OrganiseForm() {

    const [fullname,setFullName] = useState("");
    const [org,setOrg] = useState("");
    const [desig,setDesig] = useState("");
    const [contact,setContact] = useState("");
    const [mail,setMail] = useState("");
    const [about1,setAbout1] = useState("");
    const [about2,setAbout2] = useState("");
    const [input_val,setInputVal] = useState(Date());
    const [file,setFile] = useState(null);
    const [resp,setResp] = useState("");
    const [msg,setMsg] = useState("");
    
    const classes = useStyles();
    // getModalStyle is not a pure function, we roll the style only on the first render
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);

    const handleFile = (event) => {
        setFile(event.target.files[0]);
      }

    const handleOpen = () => {
        setOpen(true);
      };
    
    const handleClose = () => {
        setOpen(false);
      };


    const clearset =()=>{
        setFullName("");
        setOrg("");
        setDesig("");
        setContact("");
        setMail("");
        setAbout1("");
        setAbout2("");
        setInputVal(Date());
        setFile(null);
    }

    const onSubmit = (e) =>{
        e.preventDefault();
        console.log(e.target.value);
        const data = new FormData();
        if(file===null){
          setMsg("Attach descripted doc to submit application");
          handleOpen(); 
        }
        else{
        data.append("FullName",fullname);
        data.append("Org",org);
        data.append("Desig",desig);
        data.append("Contact",contact);
        data.append("Mail",mail);
        data.append("About1",about1);
        data.append("About2",about2);
        data.append('file', file );
        data.append("FormType",e.target.value);
        axios.post(`${DOMAIN}/api/partnershipform`,data)
        .then((response)=>{
            setResp(response.data);
            clearset();
            handleOpen();
        })
        .catch((err)=>{
            console.log(err);
            handleOpen()
        })
      }
    }

    const body  = (
        <div style={modalStyle} className={classes.paper}>
          {resp === "success" ? (<h2 id="simple-modal-title">Thank You</h2>) : 
          (<h2 id="simple-modal-title">Error Occured</h2>)}
          { resp === "success" ?
          (<p className="simple-modal-desc" id="simple-modal-description">
          MARKOKNOW WARMLY ACCEPTS YOUR PROPOSAL FOR PARTNERING WITH US. YOU WOULD SOON GET A REVERT ON THE MAIL PROVIDED. 
          </p>):(<p className="simple-modal-desc" id="simple-modal-description">PLEASE TRY AGAIN!!!</p>)}
          {msg.length>0 && 
            <p className="simple-modal-desc">{msg}</p>
          }
          <div className="buttons">
              <Link to="/dashboard" onClick={handleClose} style={{ textDecoration:"none", color:"black"}}>
              <button className="btn btn-primary btn-lg">
                Dashboard
              </button></Link>
          </div>
        </div>
    );

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
                className="Organise_partnership"
                id="organise-form"
            >
            {isBrowser && 
            <h1 className="form_heading">Organise with Markoknow.</h1>
            }
            {isMobile && 
            <h1 className="form_heading">Organise with us.</h1>
            }
            <p className="partner_para">Be the partner with Markoknow to Organise{isMobile && <br/>} Event.</p>
            <br/>
            <form className="organise_form" onSubmit={onSubmit}>
            <div class="partnership_input">
                <input type="text" value={fullname} onChange={e => setFullName(e.target.value)} class="action_input" required placeholder="Full Name" />
                <input type="text" value={org} onChange={e => setOrg(e.target.value)} class="action_input" required placeholder="Organisation" />                
            </div>
            <div class="partnership_input">
                <input type="text" value={desig} onChange={e => setDesig(e.target.value)} class="action_input " placeholder="Designation" />
                <input type="contact" value={contact} onChange={e => setContact(e.target.value)} class="action_input " placeholder="Contact No." />                
            </div>
            <input type="email" value={mail} onChange={e => setMail(e.target.value)} class="action_input1 " required placeholder="Mail ID" />
            <input type="text" value={about1} onChange={e => setAbout1(e.target.value)} class="action_input1 " required placeholder="What event you want to Organise with use?" />
            <input type="text" value={about2} onChange={e => setAbout2(e.target.value)} class="action_input1 " placeholder="Anything more" />
            <br/>
            <label className="file_input">Upload Document:
            <input className="file_input" key={input_val} required onChange={handleFile} type="file" size="large" />
            </label>
            <br/>
            <button type="submit" value={"organise"} onClick={(e)=>{onSubmit(e,"value")}} class="action_btn1">Submit</button>
            </form>
            <div className="arrow_detail">
                <HashLink className="hash_link arrow_detail_btn" smooth to={'/partnership#partner-page'}><ArrowUpwardIcon/></HashLink>
            </div>
            </Box>
            
            
        </>
    )
}

export default OrganiseForm;