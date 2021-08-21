import React, {useState} from 'react';
import Grid from '@material-ui/core/Grid';
import {  Box } from '@material-ui/core';
import "../../stylesheets/partnership.css";
import axios from "axios";
import Row from "react-bootstrap/Row"
import Container from "react-bootstrap/Container"
import Col from "react-bootstrap/Col"
import { HashLink } from 'react-router-hash-link';
import {isBrowser, isMobile} from "react-device-detect";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { blue } from '@material-ui/core/colors';
require("dotenv").config();
const DOMAIN = process.env.REACT_APP_DOMAIN;


const useStyles = makeStyles((theme) => ({
    paper: {
      textAlign: 'center',
    },
    
  }));


function Subscription() {
    const [link,setLink] = useState("");
    const [mobile, setMobile] = useState("");
    const [payId,setPayId] = useState("");
    const [open, setOpen] = React.useState(false);
    const [open1, setOpen1] = React.useState(false);
    const id1 = window.localStorage.getItem("id");
    // const id2 = member._id;   

    const handleOpen1 = () => {
        setOpen1(true);
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
            amount: amount,
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
            description: 'Subscription',
            order_id: order_id,
            handler: async function (response) {
            const data = {
                orderCreationId: order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
                name: window.localStorage.getItem("name"),
                email: window.localStorage.getItem("email"),
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

    const classes = useStyles();
    return (
        <div className="partner_ship">
            <Box
                boxShadow={4}
                bgcolor="white"
                m={1}
                p={1}
                className="Box_partnership"
                id="subscription-page"
            >
            <div>
                <h6 className="sub_heading" >Subscription.</h6>
                <button type="submit" value="apply" className="sub_heading_btn" >Unlock 1 month free subscription</button>
            </div>
            {isBrowser &&
            <p className="sub_para">Well hop on for a Committed relationship with Entrepreneurship</p>
            }
            {isMobile &&
                <p className="sub_para">Well hop on for a Committed relationship with Entrepreneurship</p>
            }            
            <br/>
            <div className="container">
                <div className="box1 common">
                    <div className="head_sub">
                        <h4 className="sub_head">3 months Subscription</h4>
                    </div>
                    <div className="mid_sub">
                        <h4 className="sub_head">INR 199</h4>
                    </div>
                    <div className="bottom_sub">
                        <p className="para_sub">Get 500 points that would be useful in utilising 
                        in attending events, posting intern requirements, 
                        and use other services at Markoknow.</p>
                        <button type="submit" value="apply" onClick={displayRazorpay}  class="sub_btn">Sign Up</button>
                    </div>
                </div>
                <div className="box2 common">
                    <div className="head_sub">
                        <h4 className="sub_head">6 months Subscription</h4>
                    </div>
                    <div className="mid_sub">
                        <h4 className="sub_head">INR 349</h4>
                    </div>
                    <div className="bottom_sub">
                        <p className="para_sub">Get 1000 points that would be useful in utilising 
                        in attending events, posting intern requirements, 
                        and use other services at Markoknow.</p>
                        <button type="submit" value="apply" onClick={displayRazorpay}  class="sub_btn">Sign Up</button>
                    </div>
                </div>
                <div className="box3 common">
                    <div className="head_sub">
                        <h4 className="sub_head">1 yr Subscription</h4>
                    </div>
                    <div className="mid_sub">
                        <h4 className="sub_head">INR 799</h4>
                    </div>
                    <div className="bottom_sub">
                        <p className="para_sub">Get 2000 points that would be useful in utilising 
                        in attending events, posting intern requirements, 
                        and use other services at Markoknow.</p>
                        <button type="submit" value="apply" onClick={displayRazorpay}  class="sub_btn">Sign Up</button>
                    </div>
                </div>
            </div>


            </Box>
        </div>
    );
}

export default Subscription;






