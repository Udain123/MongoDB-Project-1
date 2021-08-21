/* eslint-disable no-useless-computed-key */
import { TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import "../stylesheets/eventandmemberform.css"
import axios from "axios";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Modal from '@material-ui/core/Modal';
import {Carousel} from '3d-react-carousal';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from "react-router-dom";
import CardComponent from './eventList/CardComponent';
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


function EventForm({ isAuth }) {
    
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  
  const [open1, setOpen1] = React.useState(false);
  const [event,setEvent] = useState("meetups");
  const [date1,setDate1] = useState();
  const [event2,setEvent2] = useState("meetups");
  const [date,setDate] = useState();
  const [file,setFile] = useState(null);
  const [msg2,setMsg2] = useState("");
  const [msg3,setMsg3] = useState("");
  const [fee,setFee] = useState(0);
  const [credit,setCredit] = useState(0);
  const [input_val,setInputVal] = useState(Date());
  const [input_val1,setInputVal1] = useState(Date());
  const [members ,setMembers] = useState([]);
  const [link,setLink] = useState("");
  const isAuthUser = isAuth;
  const isAdmin = window.localStorage.getItem("isAdmin");
  const defdate1 = "1999-01-01";
  const defdate = "1999-01-01T23:59";
  let listItems = [];

   const handleEvent = (event) => {
     setEvent(event.target.value)
   }

  const handleEvent2 = (event) => {
    setEvent2(event.target.value)
  }
  
   const handleFile = (event) => {
     setFile(event.target.files[0]);
   }

  const handleOpen2 = () => {
    setOpen1(true);
  };

  const handleClose2 = () => {
    setOpen1(false);
  };

  //// body of modal for login pre condition /////
  const body2 = (
    <div style={modalStyle} className={classes.paper} >
      <h2 id="simple-modal-title">You are not Logged In</h2>
      <p style={{fontSize:"10px",fontWeight:"500"}} id="simple-modal-description">
        TO VIEW THIS PAGE, YOU NEED TO BE LOGGED IN TO THE SITE
      </p>
      <div className="buttons">
          <Link to="/login" onClick={handleClose2} style={{ textDecoration:"none", color:"black"}}>
          <button className="btn btn-primary btn-lg">
            Login
          </button></Link>
      </div>
    </div>
  );

  useEffect(()=>{
    if(isAuthUser){
      handleClose2();
    }
    else{
      setTimeout(function(){handleOpen2();},2000);
    }
  });

  useEffect(()=>{
    if(date){
      setDate(date);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  useEffect(()=>{
    if(date1){
      setDate1(date1);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  useEffect(()=>{
    getAllMember();
  },[])

  const getAllMember = () =>{
    axios
        .get(`${DOMAIN}/api/eventboard`,{
            headers: {
              Authorization: `Bearer ${window.localStorage.getItem("token")}`,
            },
          })
        .then((res)=>{
            setMembers(res.data.result);
        })
        .catch((err)=>{
            console.log(`Error: ${err}` );
        });
  } 
  members.reverse().map((member) =>
          listItems.push(<CardComponent key={member._id} member={member} />)
        );

    const clearset2 = () =>{
      setEvent("meetups");
      setFile(null);
      setInputVal1(Date());
      setDate1(defdate);
    }

    const clearset3 = () =>{
      setEvent2("meetups");
      setFile(null);
      setInputVal(Date());
      setCredit(0);
      setDate(defdate);
      setFee(0);
      setLink("");
    }
    

    //////submit for markoknowpoint updation/////
    const submitHandler2 = (e) =>{
      e.preventDefault();
      const ver = window.localStorage.getItem("id");
      const data = new FormData();
      data.append('event',event);
      data.append('date',date1);
      data.append('file', file );
       axios.post(`${DOMAIN}/api/csvparse/${ver}`,data,{
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      })
      .then(response=>{
        console.log(response.data);
        setMsg2(response.data);
        clearset2();
      })
      .catch(err=>{
        console.log(err);
      })
    }
    

    /// submit for event creation //////
    const submitHandler3 = (e) =>{
      e.preventDefault();
      const ver = window.localStorage.getItem("id");
      const data = new FormData();
      if(file===null){
        setMsg3("Select Poster") 
      }
      else{
      data.append('event',event2);
      data.append('credit',credit);
      data.append('date',date);
      data.append('fee',fee);
      data.append('file', file );
      data.append('link',link);
       axios.post(`${DOMAIN}/api/eventupload/${ver}`,data,{
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      })
      .then(response=>{
        console.log(response.data);
        setMsg3(response.data);
        clearset3();
      })
      .catch(err=>{
        console.log(err);
      })
    }
  }
    
    return (
        <>        
        <div className="Event_form">
        <Modal
            open={open1}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            {body2}
        </Modal>
        { isAuthUser && isAdmin === "true" &&
        <>
        <form className="form_event" onSubmit={submitHandler2}>
        <p style={{color:"green",fontWeight:"bold"}}>{msg2}</p>
        <RadioGroup aria-label="event" name="events" value={event} onChange={handleEvent}>
          <FormControlLabel value="meetups" control={<Radio />} label="Meetups" />
          <FormControlLabel value="workshops" control={<Radio />} label="Workshops" />
          <FormControlLabel value="sessions" control={<Radio />} label="Sessions" />
        </RadioGroup>
        <div>
        <p className="message2">Point Updation Form</p>
        <TextField
          id="datetime-local"
          label="Event Date"
          type="date"
          size="small"
          value={date1}
          onChange={e => setDate1(e.target.value)}
          defaultValue={defdate1}
          className={classes.textField}
          InputLabelProps={{
          shrink: true,
          }}
        />
        <TextField type="file" key={input_val1} required name="file" onChange={handleFile}/>
        <br/>
        <br/>
				<div className="buttons">
            <button type="submit" variant="contained" className="btn btn-primary btn-lg">
                Submit
            </button>
        </div>
			  </div>
        </form>
        <form className="form_event_2" onSubmit={submitHandler3}>
        <div>
        <p className="message">{msg3}</p>
        <RadioGroup aria-label="event" name="events" value={event2} onChange={handleEvent2}>
          <FormControlLabel value="meetups" control={<Radio />} label="Meetups" />
          <FormControlLabel value="workshops" control={<Radio />} label="Workshops" />
          <FormControlLabel value="sessions" control={<Radio />} label="Sessions" />
        </RadioGroup>
        </div>
        <div>
        <p className="message2">Event Creation Form</p>
        <TextField type="number" required label="credit" value={credit} size="small" onChange={e => setCredit(e.target.value)} />
        <input style={{paddingTop:"4px",paddingBottom:"8px"}} size="small" type="file" key={input_val} required name="file" onChange={handleFile} accept="image/png, image/gif, image/jpeg"/>
        <TextField
          id="datetime-local"
          label="Event Date"
          type="datetime-local"
          size="small"
          required
          value={date}
          onChange={e => setDate(e.target.value)}
          defaultValue={defdate}
          className={classes.textField}
          InputLabelProps={{
          shrink: true,
          }}
        />
        <TextField
            type="number"
            label="Event Fee"
            name="fee"
            size="small"
            required
            value={fee}
            onChange={e => setFee(e.target.value)}
        />
        <TextField
            type="text"
            label="Calender Link"
            name="link"
            size="small"
            required
            value={link}
            onChange={e => setLink(e.target.value)}
        />
        <br/>
        <br/>
				<div className="buttons">
            <button type="submit" variant="contained" className="btn btn-primary btn-lg">
                Submit
            </button>
        </div>
			  </div>
        </form>
        </>
        }
        { listItems.length && 
        <Carousel className="carousel_event" slides={listItems} autoplay={false}  />
        }      
        </div>
        </>
    )
}

export default EventForm;