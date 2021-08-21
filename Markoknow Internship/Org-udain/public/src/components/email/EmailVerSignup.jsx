import axios from "axios";
import React from "react";
import { Alert, AlertTitle } from "@material-ui/lab";
import { NavLink } from "react-router-dom";
require("dotenv").config();
const DOMAIN = process.env.REACT_APP_DOMAIN;

const EmailVerSignup = ({ match }) => {
  const [name, setName] = React.useState("");
  const [success, setSuccess] = React.useState(true);
  axios
    .post(`${DOMAIN}/verify_signup_email`, { token: match.params.token })
    .then((response) => {
      setName(response.data.name);
      setSuccess(true);
    })
    .catch((error) => {
      setSuccess(false);
    });
  return (
    <>
      <div
        style={{
          width: "50%",
          height: "50%",
          maxWeight: "500px",
          overflow: "auto",
          margin: "auto",
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
        }}
      >
        {success ? (
          <Alert severity="success">
            <AlertTitle>Successfully Verified</AlertTitle>
            Thank you for Verification {name} you can { }
            <strong>
              <NavLink to="/login" style={{textDecoration:"none"}} exact className="nav-link">
                LOGIN
              </NavLink>
            </strong>
           { } Now!
          </Alert>
        ) : (
          <Alert severity="error">
            <AlertTitle>Opps! Error Occured</AlertTitle>
            This means your link expired — <strong>Contact to Admin!</strong>
          </Alert>
        )}
      </div>
    </>
  );
};

export default EmailVerSignup;