/* eslint-disable no-useless-computed-key */
import { Box, Link, TextField } from '@material-ui/core'
import React,{useState, useEffect} from 'react';
import Grid from '@material-ui/core/Grid';
import { NavLink } from "react-router-dom";
//import List from "@material-ui/core/List"; RiCoinsFill
import { RiCoinsFill } from 'react-icons/ri';
import Fab from '@material-ui/core/Fab';
import EditIcon from '@material-ui/icons/Edit';
import Modal from '@material-ui/core/Modal';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import "../../stylesheets/home.css";

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


function MemberList({member}) {

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
    
    const linkin = member.linkedin;
    const src = `${DOMAIN}/${member.imagePath}`;
    const id = member.userId;
    const [desig1,setDesig1] = useState("");
    const [comp1,setComp1] = useState("");
    const [desig,setDesig] = useState("");
    const [comp,setComp] = useState("");
    const [desig2,setDesig2] = useState(member.designation);
    const [comp2,setComp2] = useState(member.company);

    useEffect(()=>{
        if(desig){
            setDesig1(desig);
        }
        else{
            setDesig1(desig2);
        }
        if(comp){
            setComp1(comp);
        }
        else{
            setComp1(comp2);
        }
    },[desig,desig2,comp,comp2]);


    const handleSubmit = (e) => {
        e.preventDefault();
        let data = {
            designation: desig1,
            company: comp1,
        };
        axios
            .post(`${DOMAIN}/api/member/edit/`+ id, data, {
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
          <h2 id="simple-modal-title">Update your position field</h2>
          <form onSubmit={handleSubmit}>
          <TextField
            style={{ paddingBottom: "15px", width: "100%" }}
            value={desig}
            onChange={e => setDesig(e.target.value)}
            type="text"
            variant="outlined"
            required
            label="Designation"
            size="small"
          /> 
          <TextField
            style={{ paddingBottom: "15px", width: "100%" }}
            value={comp}
            onChange={e => setComp(e.target.value)}
            type="text"
            variant="outlined"
            required
            label="Company"
            size="small"
            />    
          </form>
          <div className="buttons">
              <button type="submit" onClick={handleSubmit} className="btn btn-primary btn-lg">
                Submit
              </button>
          </div>
        </div>
      );

    return(
        <div>
       <Box 
        boxShadow={5}
        bgcolor="#befaf2"
        className="member_box"
        >
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            {body}
        </Modal>
        <Grid className="member_card" container spacing={1}>  
           <Grid item xs={4}>
                <img className="img_member" src={src} alt="profile_photo"/><br/>
                <Fab className="member_cont"><Link
             style={{cursor:"pointer"}} 
             onClick={() => { window.open(linkin ,'_blank')}}
             color="inherit"><LinkedInIcon /></Link><p className="member_cont1">-Connect</p></Fab><br/>
            <Fab style={{cursor:"inherit"}} className="member_cont"><RiCoinsFill size="25px"/><p className="member_cont1">-{member.point} pts</p></Fab>
           </Grid>
           <Grid className="member_details" item xs={8}>
            <div>
            <h2 className="member_info member_info_name"><strong>{member.name}</strong><div id="border_bottom_1"></div></h2>
            <p className="member_info member_info_desig"><strong>{desig1} at {comp1}
            {id === window.localStorage.getItem("id") && 
            <>
            <EditIcon className="edit_icon" onClick={handleOpen}/>  
            </>
            }</strong></p>
            <p className="member_info"><strong>About:</strong> {member.about}</p>
            </div>
            <div>
            { id === window.localStorage.getItem("id") && 
            <div className="view_detail">
                <NavLink className="view_detail_btn" to={"/profile/"+id}>View Detail </NavLink>
            </div>
            }
            </div>
           </Grid>
        </Grid>
        </Box>
        <br/>
        </div>
    )
}


export default MemberList;
