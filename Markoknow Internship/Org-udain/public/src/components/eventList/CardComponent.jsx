/* eslint-disable no-useless-computed-key */
import React,{useState} from "react";
import { makeStyles } from "@material-ui/core/styles";
import { TextField } from '@material-ui/core';
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import "../../stylesheets/event.css";
import moment from 'moment';
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css'
import axios from "axios";
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import InputAdornment from '@material-ui/core/InputAdornment';
import Modal from '@material-ui/core/Modal';
import { Grid } from "@material-ui/core";
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

const useStyles = makeStyles((theme)=>({
  root: {
    maxWidth: 700,
    width:700,
    backgroundColor: "black",
  },
  media: {
    height: "250px",
    marginLeft: "30px",
    marginRight: "30px",
    ['@media only screen and (max-width: 420px)']: {
      height: "150px",
      marginLeft: "10px",
      marginRight: "10px",                 // secondary
    },
  },
  paper: {
    position: 'absolute',
    width: 350,
    textAlign: 'center',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    // eslint-disable-next-line no-useless-computed-key
    ['@media only screen and (max-width: 420px)']: {
      width: 220, 
      marginLeft: 0,                 // secondary
    },
  },

}));

export default function CardComponent({member}) {

  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [open1, setOpen1] = React.useState(false);
  var disable1 = window.localStorage.getItem("point") < member.credit ? true : false ;
  const image = `${DOMAIN}/`+member.posterPath;
  var event = member.event;
  event = event.toUpperCase();
  const date = moment(member.eventDate).format("ll");
  const id1 = window.localStorage.getItem("id");
  const id2 = member._id;
  var eventNumbers = JSON.parse(window.localStorage.getItem("eventNumbers"));
  const [link,setLink] = useState("");
  const [mobile, setMobile] = useState("");
  const [payId,setPayId] = useState("");

  var disable2 = eventNumbers.indexOf(member.eventNumber)>-1;
  var disable = (disable1 || disable2);
  var disable3 = member.eventfee === 0 ? true : false;

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen1 = () => {
    setOpen1(true);
  };

  const handleClose1 = () => {
    setOpen1(false);
    handleClose();
    window.location.reload(false);
  };


  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  async function displayRazorpay() {
    const res = await loadScript(
      'https://checkout.razorpay.com/v1/checkout.js'
    );

    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }
    const data = {
      amount: member.eventfee,
    }

    const result = await axios.post(`${DOMAIN}/api/orderpayment`,data);

    if (!result) {
      alert('Server error. Are you online?');
      return;
    }
    const { amount, id: order_id, currency } = result.data;
    const amt = toString(amount);
    const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;

    const options = {
      key: RAZORPAY_KEY_ID, 
      amount: amt,
      currency: currency,
      name: 'Markoknow',
      description: 'Event Booking',
      order_id: order_id,
      handler: async function (response) {
        const data = {
          orderCreationId: order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
          event: event,
          eventDate: member.eventDate,
          name: window.localStorage.getItem("name"),
          email: window.localStorage.getItem("email"),
          eventId: id2,
          amount: amount,
          userId: id1,
        };

        const result = await axios.post(`${DOMAIN}/api/paymentsuccess`, data);

        if(result.data.msg === "success"){
          setPayId(result.data.paymentId);
          setLink(result.data.link);
          handleOpen1();
        }
      },
      prefill: {
        name: window.localStorage.getItem("name"),
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }

  const onUsePoint = (e) =>{
    const data = {
      event: event,
      eventDate: member.eventDate,
      userId: id1,
      credit: member.credit,
      eventNum: member.eventNumber,
      contact: mobile,
    }
    axios.post(`${DOMAIN}/api/usepoint/${id2}`,data,{
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      },
    })
    .then(response=>{
      console.log(response.data);
      window.localStorage.setItem("point" ,response.data.newPoint);
      window.localStorage.setItem("eventNumbers",JSON.stringify(response.data.eventNumber));
      setLink(response.data.link);
      handleOpen1();
    })
    .catch((err)=>{
      console.log(err);
    });
  }

  const body = (
    <div style={modalStyle} className={classes.paper} >
      <h2 id="simple-modal-title">Fill to receive further update</h2>
      <TextField
          style={{ paddingBottom: "10px", width: "100%" }}
          value={mobile}
          variant="outlined"
          onChange={e => setMobile(e.target.value)}
          type="contact"
          label="WhatsApp No."
          InputProps={{
          startAdornment: (
            <InputAdornment position="start">
                <WhatsAppIcon />
            </InputAdornment>
          ),
          }}
      />
      <div className="buttons">
          <button onClick={onUsePoint} className="btn btn-primary btn-lg">
            Book
          </button>
      </div>
    </div>
  );

  const body1 = (
    <div style={modalStyle} className={classes.paper} >
      <h2 id="simple-modal-title">Event Booked Successfully</h2>
      {payId.length>0 && <p className="simple-modal-desc" id="simple-modal-description">
        <strong>PaymentID</strong>{` `}{payId}
      </p>}
      <p className="simple-modal-desc" id="simple-modal-description">
        You will receive further updates on your WhatsApp number.
      </p>
      <div className="buttons">
          <a href={link} onClick={handleClose1} style={{ textDecoration:"none", color:"black"}}>
          <button className="btn btn-primary btn-lg">
            Add to Calender
          </button></a>
      </div>
    </div>
  );

  return (
    <Card className={`${classes.root} middle_card`}>
    <CardContent className="upper_card">
        <Typography className="event_heading" gutterBottom variant="h5" component="h2">
          {event}
        </Typography>
        <Typography className="event_heading" gutterBottom variant="h5" component="h2">
          {date}
        </Typography>
    </CardContent>
      <CardMedia
        className={classes.media}
        // image={image}
        // title="Event_image"
      ><InnerImageZoom className="event_img" src={image} alt="Event_image" /></CardMedia>
      <CardContent className="bottom_card">
        <Grid container spacing={1}>
        <Grid className="buttons_grid" item xs={6}>
        <button onClick={handleOpen} style={{backgroundColor:"#8dffcc"}} disabled={disable} className="event_btn">{member.credit > 0 ? <h1>Use Points({member.credit})</h1> : <h1>Book Free Event</h1>}</button>
        </Grid>
        <Grid className="buttons_grid" item xs={6}>
        <button onClick={displayRazorpay} style={{backgroundColor:"rgb(82, 239, 218)"}} disabled={disable3} className="event_btn"><h1>Book Now</h1></button>
        </Grid>
        </Grid>
      </CardContent>
      <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            {body}
      </Modal>
      <Modal
            open={open1}
            onClose={handleClose1}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            {body1}
      </Modal>
    </Card>
  );
}




            


//       <Modal isOpen={modal} className="centered" toggle={toggle}>
//             <ModalHeader toggle={toggle} className="about">
//                 <h1 style={{color:"green"}} className="profile_head">Registered Successfully</h1>
//                 <CancelIcon className="cross_icon" onClick={toggle}/>
//             </ModalHeader>
//             <ModalBody>
//                 <p><strong>PaymentId:</strong>{' '}{payId}</p>
//                 <p>You will receive the notification on your given whatsapp number.</p>
//             </ModalBody>
//       </Modal>
            // <Box
            //     boxShadow={3}
            //     bgcolor="#befaf2"
            //     m={1}
            //     p={1}
            //     className="Box_type_event"
            //     style={{ width: "20rem", height: "28rem", margin: "auto" }}
            // >
            //     <form className="member_ship" onSubmit={submitHandler}>
            //         <h2>Event Booking</h2> 
            //         <span style={{color:"red"}}>{option}</span>
            //         <div className="form-check">
            //             <label className="form-check-label">
            //             <Checkbox
            //                 checked={values.startup}
            //                 onChange={handleStartup}
            //                 name="checkedStartup"
            //                 color="primary"
            //             />
            //             Startup
            //             </label>
            //         </div>
            //         <div className="form-check">
            //             <label className="form-check-label">
            //             <Checkbox
            //                 checked={values.social}
            //                 onChange={handleSocial}
            //                 name="checkedSocial"
            //                 color="primary"
            //             />
            //             Social
            //             </label>
            //         </div>
            //         <div className="form-check">
            //             <label className="form-check-label">
            //             <Checkbox
            //                 checked={values.peerLearning}
            //                 onChange={handlePeerLearning}
            //                 name="checkedPeerLearning"
            //                 color="primary"
            //             />
            //             Peer Learning
            //             </label>
            //         </div>
            //         <span style={{color:"red"}}>{mobilecheck}</span>
            //         <TextField
            //             style={{ paddingBottom: "10px", width: "100%" }}
            //             value={mobile}
            //             variant="outlined"
            //             onChange={e => setMobile(e.target.value)}
            //             type="contact"
            //             label="WhatsApp No."
            //             InputProps={{
            //               startAdornment: (
            //               <InputAdornment position="start">
            //                 <WhatsAppIcon />
            //               </InputAdornment>
            //               ),
            //             }}
            //             />
            //         <br />
            //         <br />
            //         <div className="buttons">
            //             <button type="submit" variant="contained" className="btn btn-primary btn-lg">
            //                 Book
            //             </button>
            //         </div>
            //         <Modal
            //         open={open}
            //         onClose={handleClose}
            //         aria-labelledby="simple-modal-title"
            //         aria-describedby="simple-modal-description"
            //         >
            //         {body}
            //         </Modal>
            //     </form>
            // </Box>


            // const submitHandler = (e) => {
    //     e.preventDefault();

    //     let checkArray = [];
    //     for (var key in values) {
    //         if (values[key] === true) {
    //         checkArray.push(key);
    //         }
    //     }

    //     if (checkArray.length === 0) { 
    //        setOption("Please fill atleast one option");
    //       } 
    //     else if (mobile.length > 10 ||  mobile.length < 10) {
    //        setMobileCheck("Please fill valid mobile number");
    //       } 
    //     else{
    //         let checkData = {
    //           userId: window.localStorage.getItem("id"),
    //           mobileNumber: mobile,
    //           checkbox: checkArray.toString(),
    //         };
    //         axios
    //             .post(`${DOMAIN}/bookevent`, checkData, {
    //               headers: {
    //                 Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    //               },
    //             })
    //             .then((response) => {
    //             console.log(response.data);
    //             setResp(response.data.Checkvalue); 
    //             clearset();
    //             handleOpen();
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //             setResp("Post Sending Error")
    //         }); 
    //         }
    // }

    // const handleStartup = (event) => {
    //     event.persist();
    //     setValues((values) => ({
    //         ...values,
    //         startup: event.target.checked,
    //     }))
    // }
    // const handlePeerLearning = (event) => {
    //     event.persist();
    //     setValues((values) => ({
    //         ...values,
    //         peerLearning: event.target.checked,
    //     }))
    // }
    // const handleSocial = (event) => {
    //     event.persist();
    //     setValues((values) => ({
    //         ...values,
    //         social: event.target.checked,
    //     }))
    // }

    // const body = (
  //   <div style={modalStyle} className={classes.paper} >
  //     <h2 style={{color:"green"}} id="simple-modal-title">SUCCESS</h2>
  //     <p id="simple-modal-description">
  //       {resp}
  //     </p>
  //     { resp === "Information added successfully"  && 
  //     <p id="simple-modal-description">
  //       We'll soon notify you about event on your WhatsApp Number.
  //     </p>}
  //     <button style={{backgroundColor:"grey"}}>
  //       <Link to="/" style={{ textDecoration:"none", color:"black"}} className="btn-primary">Home</Link>
  //     </button>
  //   </div>
  // );
