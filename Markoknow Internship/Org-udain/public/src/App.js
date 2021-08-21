import React, { useState } from "react";
import './App.css';
import { Switch, Route, BrowserRouter, useHistory } from "react-router-dom";
import Signup from './components/auth/signup';
import Login from './components/auth/login';
import Profile from './components/auth/profile';
import MembershipForm from './components/MembershipForm';
import NavBar from './components/NavBar';
import Home from './components/Dashboard/Home.jsx';
import About from "./components/About";
import EmailVerification from "./components/email/EmailVerification";
import EmailVerSignup from "./components/email/EmailVerSignup";
import EventForm from "./components/EventForm";
import ForgetPass from "./components/forgotPassword/ForgotPass";
import ResetPassword from "./components/forgotPassword/ResetPassword";
import PartnerShip from "./components/partnership/partnerShip";
import EmailTestimonial from "./components/email/EmailTestimonial";
import Testimonials from "./components/Testimonials/TestimonialDashboard";
import Experience from "./components/experience/experience";
import Subscription from "./components/subs/Subscription";


function App() {

  const [isAuth, setIsAuth] = useState(
    window.localStorage.getItem("isAuth") || false
  );
  
  const history = useHistory();

  return (
    <div className="App">
      <BrowserRouter>
      <NavBar isAuth={isAuth} setIsAuth={setIsAuth} />
        <Switch>
        <Route 
        exact path="/dashboard" 
        component={
           () => <Home isAuth={isAuth}/>
          } 
        />
        <Route exact path="/"  
        component={
             () => <About isAuth={isAuth} />
          }
         />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/login" component={() => <Login isAuth={isAuth} setIsAuth={setIsAuth} /> } />
        <Route 
        exact path="/membership" 
        component={
             () => <MembershipForm isAuth={isAuth} />
          }   
        />
        <Route 
        exact path="/partnership" 
        component={
             () => <PartnerShip isAuth={isAuth} />
          }   
        />
        <Route 
        exact path="/forgotpassword" 
        component={ForgetPass}  
        />
        <Route 
         exact
         path="/bookevent" 
         component={
            () => <EventForm isAuth={isAuth} />
          } 
        />
        <Route 
         exact
         path="/profile/:id" 
         component={
            isAuth
              ? () => <Profile />
              : () => <Login history={history} setIsAuth={setIsAuth} />
          } 
        />
        <Route
          exact
          path="/verify_email/:token"
          isAuth={isAuth}
          component={EmailVerification}
        />
        <Route
          exact
          path="/verify_signup_email/:token"
          isAuth={isAuth}
          component={EmailVerSignup}
        />
        <Route
          exact
          path="/verify_testimonial/:token"
          isAuth={isAuth}
          component={EmailTestimonial}
        />
        <Route
          exact
          path="/resetpassword/:token"
          component={ResetPassword}
        />
        <Route
          exact
          path="/testimonials"
          component={Testimonials}
        />
        <Route
          exact
          path="/subscription"
          component={Subscription}
        />
        <Route
          exact
          path="/experience"
          component={Experience}
        />
      </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
