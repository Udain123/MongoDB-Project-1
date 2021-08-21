import {  Box, TextField } from '@material-ui/core';
import React, { useState, useEffect } from 'react'
import {Link, useHistory} from "react-router-dom";
import {validateEmail} from "./validateEmail";
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import "../../stylesheets/loginform.css";
import axios from 'axios';
require("dotenv").config();
const DOMAIN = process.env.REACT_APP_DOMAIN;

function Login({isAuth, setIsAuth}) {

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [password, setPassword] = useState("");
    const [resp, setResp] = useState("");
    // eslint-disable-next-line no-unused-vars
    const [pathn,setPathn] = useState(window.location.pathname);
    const history = useHistory();

    useEffect(
        () => {
          if (!email) {
            setEmailError("");
          } else {
            if (validateEmail(email)) {
              setEmailError("");
            } else {
              setEmailError("Please enter a valid email.");
            }
          }
        },
        [email]
      );

      const clearset = () => {
          setEmail("");
          setPassword("");
          setEmailError("");
          setResp("");
      }




      const handleSubmit = (e) => {
        e.preventDefault();
        const registered = {
          email: email,
          password: password,
        }; 
        axios
      .post(`${DOMAIN}/signin`, registered)
      .then((response) => {
        if(response.status === 200){
          window.localStorage.setItem("name", response.data.user.name);
          window.localStorage.setItem("email", response.data.user.email);
          window.localStorage.setItem("id", response.data.user._id);
          window.localStorage.setItem("token", response.data.token);
          window.localStorage.setItem("isAuth", true);
          window.localStorage.setItem("isAdmin", response.data.user.isAdmin);
          window.localStorage.setItem("point", response.data.user.markoknowPoints);
          window.localStorage.setItem("eventNumbers",JSON.stringify(response.data.user.eventNumber));
          setIsAuth(true);
          console.log("Logged in Successfully");
          clearset();
          history.push(`/profile/${response.data.user._id}`);
        }
        else if(response.status === 203){
          setResp(response.data.message);
          console.log(resp);
        }
      })
      .catch((error)=>{
        console.log(error.message);
        console.log(resp);
        clearset();
      });
    };

    return (
        <div className="Login_Form">
        { (pathn === "/dashboard" || pathn === "/bookevent" || pathn === "/membership") && 
      <div style={{width: "21rem", margin: "auto" }} className="Alert_type">
      <Alert 
          severity="info"
      >
      <AlertTitle>INFO</AlertTitle>
        <strong>Please First Login to visit this Page</strong> 
        </Alert>
        </div>
        }

        { resp.length > 0 && 
      <div style={{width: "21rem", margin: "auto" }} className="Alert_type">
      <Alert 
          severity="error"
      >
      <AlertTitle>ERROR OCCURED</AlertTitle>
        <strong>{resp}</strong> 
        </Alert>
        </div>
    }
    <Box
        boxShadow={3}
        bgcolor="#bfffe3"
        m={1}
        p={1}
        style={{ width: "20rem", height: "20rem", margin: "auto" }}
        className="Box_type"
    >
      <form className="login_form" onSubmit={handleSubmit}>
        <h3>Login</h3>
        <span className="error">{emailError}</span>
        <TextField
          style={{ paddingBottom: "15px", width: "100%" }}
          value={email}
          variant="outlined"
          onChange={e => setEmail(e.target.value)}
          type="email"
          required
          label="Email"
        />
        
        <TextField
          style={{ paddingBottom: "15px", width: "100%" }}
          value={password}
          variant="outlined"
          onChange={e => setPassword(e.target.value)}
          type="password"
          label="Password"
        />

        <div className="not_member">
            Not a member? <Link exact="true" to="/signup">click here</Link>
            <Link style={{paddingLeft:"0.9rem"}} exact="true" to="/forgotpassword">Forgot Password?</Link>
        </div>
        <br/>
        
        
        <div className="buttons">
            <button type="submit" variant="contained" className="btn btn-primary btn-lg">
                Login
            </button>
        </div>
      </form>
    </Box>
    </div>
    )
}

export default Login
