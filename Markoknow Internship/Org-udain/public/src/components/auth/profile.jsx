/* eslint-disable no-useless-computed-key */
/* eslint-disable no-unused-vars */
import {  Box, TextField } from '@material-ui/core';
import React, {useState,useEffect} from 'react';
import { useParams} from "react-router-dom";
import {isMobile,isBrowser} from "react-device-detect";
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
//import CancelIcon from '@material-ui/icons/Cancel';
import EditIcon from '@material-ui/icons/Edit';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { FaPaperPlane } from 'react-icons/fa';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from "react-router-dom";
import ReactRoundedImage from "react-rounded-image";
import Modal from '@material-ui/core/Modal';
import "../../stylesheets/profile.css";
import DefaultImg from "../../images/icon_download.png";
import axios from 'axios';
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

function Profile() {

    
    let params = useParams()
    const [bio,setBio] = useState("");
    const [bio1,setBio1] = useState("");
    const [point,setPoint] = useState(0);
    const [src,setSrc] = useState("IMG-icon_download.png");
    const [events, setEvents] = useState({
        meetups:0,
        workshops:0,
        sessions:0,
    });
    const [about, setAbout] = useState("");
    const [error, setError] = useState("");
    const [imgerror,setImgError] = useState(true);
    const [img, setImg] = useState(null);
    const [msg, setMsg] = useState("");
    // // eslint-disable-next-line no-unused-vars

    const [members ,setMembers] = useState([]);

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

    useEffect(()=>{

        if(params.id !== window.localStorage.getItem("id")){
            setError("error")
        }
        else{
        axios
            .get(`${DOMAIN}/api/profile/`+ params.id,{
                headers: {
                  Authorization: `Bearer ${window.localStorage.getItem("token")}`,
                }
              })
            .then(async (res)=>{
                const response = res.data.result;
                setError(res.data.message);
                await setBio(response.bio);
                setAbout(response.bio);
                setPoint(response.markoknowPoints);
                setEvents((events)=>({...events,meetups:response.events.meetups}));
                setEvents((events)=>({...events,workshops:response.events.workshops}));
                setEvents((events)=>({...events,sessions:response.events.sessions}));
                if(response.imagePath)
                    {setSrc(`${DOMAIN}/`+ response.imagePath);
                    }
            })
            .catch((err)=>{
                console.log(`Error: ${err}` );
                setError("POST Error");
            });}
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

useEffect(()=>{
    if(about){
        setBio1(about)
    }else{
            setBio1(bio);
        }
},[about,bio]);

 
const uploadImage = (e) =>{
    

      setSrc(URL.createObjectURL(e.target.files[0]));
      setImg(e.target.files[0]);
} 

const submitImage = (e) => {
    e.preventDefault();
    const data = new FormData();
    if(img===null){
        setMsg("Select image to change profile pic") 
    }
    else{
    data.append('imagePath', img );
    //   for (var [key, value] of data.entries()) {    for retrive value of data
    //     console.log(key, value);
    //    }

       axios.post(`${DOMAIN}/api/uploadpic/` + params.id, data)
              .then((resp)=>{
                   if (resp) {
                   console.log("Image has been successfully uploaded");
                   setImgError(false);
               } 
               })
               .catch((err) => {
                   console.log("Error while uploading image using multer");
                   setSrc(DefaultImg);
               });
    }
}


      const handleSubmit = (e) => {
        e.preventDefault();
        let data = {
            bio: bio1,
        };
        axios
            .post(`${DOMAIN}/api/profile/edit/`+ params.id, data, {
                headers: {
                 Authorization: `Bearer ${window.localStorage.getItem("token")}`,
                },
            })
            .then((response)=>{
                console.log(response.data.message);
                handleClose();
            })
            .catch(err=>{
                console.log(err);
                handleClose();
            }); 
      }


      const body = (
        <div style={modalStyle} className={classes.paper} >
          <h2 id="simple-modal-title">Update your Bio field</h2>
          <form onSubmit={handleSubmit}>
          <TextField
            style={{ paddingBottom: "15px", width: "100%" }}
            value={about}
            multiline
            variant="outlined"
            rowsMax={5}
            onChange={e => setAbout(e.target.value)}
            type="text"
            required
            label="Bio"
            inputProps={{ maxLength: 100 }}
          />  
          </form>
          <div className="buttons">
              <button type="submit" onClick={handleSubmit} className="btn btn-primary btn-lg">
                Submit
              </button>
          </div>
        </div>
      );


    return (
        <div className="Profile_Form">
        
        { error === "success" &&

        <Box
        boxShadow={3}
        bgcolor="#bfffe3"
        m={1}
        p={1}
        style={{ width: "18rem", margin: "auto" }}
        className="Box_type_profile"
        >
        { msg.length>0 && <h2 className="message">{msg}</h2>}
        { !imgerror && <h2 className="message">Profile Pic Uploaded Successfully!!</h2>}

        <Grid container spacing={1} className="container grid_profile">
            <Grid item xs={4}>
            {isBrowser &&
            <ReactRoundedImage
          image={src}
          roundedColor="rgb(82, 239, 218)"
          imageWidth="150"
          imageHeight="150"
          roundedSize="10"
        />}
            {isMobile &&
            <img src={src} className="profile_pic" alt="profile_pic"/>
            }
            <form onSubmit={submitImage}>
            <label htmlFor="upload-photo">
                <input
                    style={{ display: 'none' }}
                    id="upload-photo"
                    name="imagePath"
                    type="file"
                    onChange={(e)=>{uploadImage(e)}}
                    accept="image/png, image/gif, image/jpeg"
                />
                <Fab 
                size="small" 
                className="fab_add"
                component="span"
                aria-label="add"
                variant="extended"
                >
                    <AddIcon className="fab_add_icon" />
                </Fab>
            </label>
            { isBrowser && 
            <button className="submit_pic" type="submit">
                Submit <FaPaperPlane/>
            </button>}
            { isMobile && 
            <button className="submit_pic" type="submit">
                <FaPaperPlane/>
            </button>}
            </form>
            </Grid>
            <Grid item xs={8}>    
                <h1 className="profile_head">{window.localStorage.getItem("name")}</h1>
                <Grid item className="profile_head">{bio1}{'  '}<EditIcon className="edit_icon" onClick={handleOpen}/></Grid>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                >
                    {body}
                </Modal>
                
                <h3 className="profile_point" >Markoknow Points: {point}</h3>
            </Grid>
        </Grid>
        
        <Grid container className="container grid_profile">
            <Grid item xs={1}> 

            </Grid>
            <Grid item xs={6}> 
                <h2>Meetups</h2>
                <h2>Workshops</h2>
                <h2>Sessions</h2>
            </Grid>
            <Grid item xs={5}>    
                <h2>{events.meetups}</h2>
                <h2>{events.workshops}</h2>
                <h2>{events.sessions}</h2>
            </Grid>
        </Grid>

        
       <Link to="/bookevent"> 
        <div className="buttons_pro">
            <button type="submit" variant="contained" className="btn-primary btn-lg btn_profile">
                Improve Score
            </button>
        </div>
       </Link>
    </Box>
        }
        { (error === "error" || error === "POST Error") &&
            <div style={{width: "21rem", margin: "auto" }} className="Alert_type_profile">
            <Alert 
                severity="error"
            >
            <AlertTitle>ERROR OCCURED</AlertTitle>
                <strong>You are accessing wrong profile.</strong> 
            </Alert>
        </div> 
        }
    </div>
    )
}

export default Profile;





                // <Modal isOpen={modal} className="centered" toggle={toggle}>
                //     <ModalHeader toggle={toggle} className="about">
                //         <h1 className="profile_head">About</h1>
                //         <CancelIcon className="cross_icon" onClick={toggle}/>
                //     </ModalHeader>
                //         <ModalBody>
                //              <form onSubmit={handleSubmit}>
                //              <TextField
                //                 style={{ paddingBottom: "15px", width: "100%" }}
                //                 value={about}
                //                 multiline
                //                 rowsMax={5}
                //                 onChange={e => setAbout(e.target.value)}
                //                 type="text"
                //                 required
                //                 label="Bio"
                //                 inputProps={{ maxLength: 100 }}
                //             />  
                //              </form>
                //         </ModalBody>
                //         <ModalFooter>
                //             <Button color="primary" className="modal_btn" onClick={handleSubmit}>Submit</Button>
                //         </ModalFooter>
                // </Modal>