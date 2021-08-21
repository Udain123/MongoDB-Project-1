/* eslint-disable no-useless-computed-key */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react'
import axios from "axios";
import MemberList from "./MemberList";
import "../../stylesheets/home.css";
import Modal from '@material-ui/core/Modal';
import Grid from '@material-ui/core/Grid';
import {
    BrowserView,
    MobileView
  } from "react-device-detect";
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

function Home({isAuth}) {
    const [members ,setMembers] = useState([]);
    const classes = useStyles();
    // getModalStyle is not a pure function, we roll the style only on the first render
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);
    const isAuthUser = isAuth;

    
    const handleOpen = () => {
        setOpen(true);
      };
    
    const handleClose = () => {
        setOpen(false);
      };

    const body = (
      <div style={modalStyle} className={classes.paper} >
      <h2 id="simple-modal-title">You are not Logged In</h2>
      <p className="simple-modal-desc" id="simple-modal-description">
        TO VIEW THIS PAGE, YOU NEED TO BE LOGGED IN TO THE SITE
      </p>
      <div className="buttons">
          <Link to="/login" onClick={handleClose} style={{ textDecoration:"none", color:"black"}}>
          <button className="btn btn-primary btn-lg">
            Login
          </button></Link>
      </div>
      </div>
    );


    useEffect(()=>{
        getAllMember();
    },[])

    const getAllMember = () =>{
        axios
            .get(`${DOMAIN}/api/dashboard`)
            .then((res)=>{
                setMembers(res.data.result);
            })
            .catch((err)=>{
                console.log(`Error: ${err}` );
            });
    }

    useEffect(()=>{
        if(isAuthUser){
          handleClose();
        }
        else{
          setTimeout(function(){handleOpen();},2000);
        }
      });

    

    return (
        <div>
        <Modal
            open={open}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            {body}
        </Modal>
        {/* CSS for button in about.css */}
        <div className="view_detail">         
            <div className="apply_button">
                  <button onClick={()=> window.location.href='/membership'} className="btn btn-primary btn-lg apply_btn">
                      APPLY FOR MEMBERSHIP
                  </button>
            </div>
        </div>
        <MobileView>
           <div className="container" style={{marginBottom:"5rem"}}>
            <div className="row">
            {members.map((member) => (
                <MemberList key={member._id} member={member} />
            ))}
            </div>

            </div> 
        </MobileView> 
        <BrowserView>
            <Grid container className="container">
            <Grid item xs={6}> 
                {members.map((member,i) => {
                    if(i%2===0)
                    return <MemberList key={member._id} member={member} />
                })
                }
            </Grid>
            <Grid item xs={6}>    
                {members.map((member,i) => {
                    if(i%2!==0)
                    return <MemberList key={member._id} member={member} />
                })
                }
            </Grid>
            </Grid>
        </BrowserView>
        </div>
    );
}

export default Home;
