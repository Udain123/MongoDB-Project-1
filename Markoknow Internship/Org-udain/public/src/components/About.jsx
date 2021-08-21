/* eslint-disable no-useless-computed-key */
/* eslint-disable array-callback-return */
import React,{useEffect,useState} from 'react';
import {  Box } from '@material-ui/core';
import {BrowserView,
    MobileView, isBrowser, isMobile} from "react-device-detect";
import Grid from '@material-ui/core/Grid';
import { Link } from "react-router-dom";
import { HashLink } from 'react-router-hash-link';
import axios from "axios";
import "../stylesheets/about.css";
import MemberAbout from './Dashboard/MemberAbout';
import {Carousel} from '3d-react-carousal';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import CardDemoAbout from "./eventList/CardDemoAbout";
import TestimonialCard from './Testimonials/testimonials';
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
      width: 450,
    //   textAlign: 'center',
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 2, 2),
      ['@media only screen and (max-width: 420px)']: {
        width: 250, 
        marginLeft: 0,                 // secondary
      },

    },
}));

function About({isAuth}) {

    const [members ,setMembers] = useState([]);
    const [members2 ,setMembers2] = useState([]);
    const [members3 ,setMembers3] = useState([]);
    let listItems = [];
    const isLogin = isAuth;
    const [values,setValues] = useState({
        name:"",
        designation:"",
        testimonial:"",
        email:"",
        linked:"",
    });
    const [file,setFile] = useState(null);
    const [input_val,setInputVal] = useState(Date());
    const [resp,setResp] = useState("");
    const [msg,setMsg] = useState("");

    const handleFile = (event) => {
        setFile(event.target.files[0]);
      }

    const classes = useStyles();
    // getModalStyle is not a pure function, we roll the style only on the first render
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);
    
    const handleOpen = () => {
        setOpen(true);
      };
    
    const handleClose = () => {
        setOpen(false);
        setMsg("");
        setResp("");
      };

      const handleName = (event) => {
        event.persist();
        setValues((values) => ({
            ...values,
            name: event.target.value,
        }));
    };
    
    const handleDesignation = (event) => {
        event.persist();
        setValues((values) => ({
            ...values,
            designation: event.target.value,
        }));
    };

    const handleTestimonial = (event) => {
        event.persist();
        setValues((values) => ({
            ...values,
            testimonial: event.target.value,
        }));
    };

    const handleEmail = (event) => {
        event.persist();
        setValues((values) => ({
            ...values,
            email: event.target.value,
        }));
    };
    
    const handleLinkedIn = (event) => {
        event.persist();
        setValues((values) => ({
            ...values,
            linked: event.target.value,
        }));
    };

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
        getAllMember2();
      },[])
    
      const getAllMember2 = () =>{
        axios
            .get(`${DOMAIN}/api/eventAbout`)
            .then((res)=>{
                setMembers2(res.data.result);
            })
            .catch((err)=>{
                console.log(`Error: ${err}` );
            });
      } 
      members2.reverse().slice(0,3).map((member) =>
              listItems.push(<CardDemoAbout key={member._id} member={member} />)
            );

    useEffect(()=>{
                getAllMember3();
            },[])
        
            const getAllMember3 = () =>{
                axios
                    .get(`${DOMAIN}/api/testimonials`)
                    .then((res)=>{
                        setMembers3(res.data.result);
                    })
                    .catch((err)=>{
                        console.log(`Error: ${err}` );
                    });
    }

    const clearset =()=>{
        setValues({
            name:"",
            designation:"",
            email:"",
            linked:"",
            testimonial:""
        })
        setFile(null);
        setInputVal(Date());
    }

    const handleSubmit = (e) =>{
        e.preventDefault();
        const data = new FormData();
        data.append("name",values.name);
        data.append("desig",values.designation);
        data.append("linkedin",values.linked);
        data.append("email",values.email);
        data.append("testimonial",values.testimonial);
        data.append('file', file );
        if(file===null){
            setMsg("Select image to change profile pic") 
        }
        else{
        axios.post(`${DOMAIN}/api/testimonialform`,data)
            .then((response)=>{
                console.log(response.data);
                setResp(response.data);
                clearset();
            })
            .catch(err=>{
                console.log(err);
            })
        }
    }


            const body = (
                <div style={modalStyle} className={classes.paper} >
                {resp === "success" && 
                <p className="test_msg">Testimonial application submitted successfully</p>
                }
                {msg.length>0 && 
                <p className="test_msg">{msg}</p>
                }
                  <form onSubmit={handleSubmit}>
                    <div class="testimonial_input">
                        <input type="text" value={values.name} onChange={handleName} class="test_input " placeholder="Name" />
                        <input type="contact" value={values.designation} onChange={handleDesignation} class="test_input " placeholder="Designation" />                
                    </div>
                    <input type="email" value={values.email} onChange={handleEmail} class="test_input1 " required placeholder="Mail ID" />
                    <textarea rows="3" cols="5" maxlength="180" type="text" value={values.testimonial} onChange={handleTestimonial} class="test_textarea1 " required placeholder="Testimonial" />
                    <input type="text" value={values.linked} onChange={handleLinkedIn} class="test_input1 " placeholder="LinkedIn" />
                    <br/>
                    <label className="test_file_input">Upload Image:
                    <input className="test_file_input" key={input_val} required onChange={handleFile} type="file" size="large" accept="image/png, image/gif, image/jpeg" />
                    </label>
                    <br/>
                    <button type="submit" value={"organise"} onClick={(e)=>{handleSubmit(e,"value")}} class="test_btn1">Submit</button>
            
                  </form>
                </div>
              );

    return (
        <div className="About_page">
            <Box
                boxShadow={4}
                bgcolor="white"
                m={1}
                p={1}
                className="Box_about"
                id="partner-page"
            >
{/* ////////////////Build Network Portion/////////////////// */}
            <div className="build_box">
                <h1 className="about_heading" >Building Your Networth.</h1>
                <p className="about_para">Start Building your Networth by Making your Entrepreneurial Aspirations Alive.</p>
                <div className="about_buttons">
                    <Link to="/signup" style={{ textDecoration:"none", color:"black"}}>
                        <button className="btn btn-primary btn-lg about_btn">
                            Create Account
                        </button>
                    </Link>
                 </div>
            </div>
            <div className="event_demo">
            { listItems.length && 
                <Carousel className="carousel_event" slides={listItems} autoplay={false}  />
            } 
            </div>
{/* ////////////////Member Portion/////////////////// */}
            <div className="member_demo">
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
                    {members.slice(0,3).map((member) => (
                        <MemberAbout key={member._id} member={member} />
                    ))}
                </div>
                </div> 
              </MobileView> 
              <BrowserView>
              <Grid container className="container">
                <Grid item xs={4}> 
                    {members.slice(0,3).map((member,i) => {
                    if(i%3===0)
                        return <MemberAbout key={member._id} member={member} />
                    })
                    }
                </Grid>
                <Grid item xs={4}> 
                    {members.slice(0,3).map((member,i) => {
                    if(i%3===1)
                        return <MemberAbout key={member._id} member={member} />
                    })
                    }
                </Grid>
                <Grid item xs={4}>    
                    {members.slice(0,3).map((member,i) => {
                    if(i%3===2)
                        return <MemberAbout key={member._id} member={member} />
                    })
                    }
                </Grid>
              </Grid> 
              </BrowserView>
              <div className="view_detail">
                <div className="apply_button">
                        <button onClick={()=> window.location.href='/dashboard'} className="btn btn-primary btn-lg apply_btn">
                            View More...
                        </button>
                </div>
              </div>  
            </div>
{/* ////////////////Partnership Portion/////////////////// */}
            <div className="partnership_demo">
                <h1 className="partner_heading" >Partner with us.</h1>
                {isBrowser &&
                    <p className="partner_para">Be the partner to Markoknow to explore the <br/> opportunities for your business.</p>
                }
                {isMobile &&
                    <p className="partner_para">Be the partner to explore opportunities<br/> with Markoknow in your venture.</p>
                }
            
                <br/>
                <div class="partnership_btn">
                    <HashLink className="hash_link" smooth to={'/partnership#organise-form'}>
                    <button name="submit" class="action_btn first">Organise Events with Markoknow</button>
                    </HashLink>
                    <HashLink className="hash_link" smooth to={'/partnership#sponsor-form'}>
                    <button name="submit" class="action_btn first">Sponsor Event at Markoknow</button>                
                    </HashLink>
                </div>
            </div>
{/* ////////////////Testimonial Portion/////////////////// */}
            <div className="testimonials_demo">
              <div className="testimonial_head">
                <div>
                    <h1 className="partner_heading" >Testimonial.</h1>
                </div>
                {isBrowser &&
                <div className="test_apply">
                        <button onClick={handleOpen} className="btn btn-primary btn-lg test_apply_btn">
                            Write a Testimonial
                        </button>
                        <Modal
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="simple-modal-title"
                            aria-describedby="simple-modal-description"
                        >
                        {body}
                        </Modal>
                </div>}

              </div>
                <p className="partner_para">Let others know your experience at Markoknow</p>
                {isMobile &&
                <div className="test_apply">
                        <button onClick={handleOpen} className="btn btn-primary btn-lg test_apply_btn">
                            Write a Testimonial
                        </button>
                        <Modal
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="simple-modal-title"
                            aria-describedby="simple-modal-description"
                        >
                        {body}
                        </Modal>
                </div>}
                <MobileView>
                    <div className="container cont1" style={{marginBottom:"5rem"}}>
                    <div className="row">
                        {members3.slice(0,3).map((member,i) => (
                            <TestimonialCard key={member._id} member={member} color1={i} />
                        ))}
                    </div>
                    </div> 
                </MobileView>
                <BrowserView>
                <Grid className="grid_testimonials" container spacing={1}>
                    <Grid className="grid_test" item xs={4}>
                        {members3.slice(0,3).map((member,i) => {
                            if(i%3===0)
                            return <TestimonialCard key={member._id} member={member} color1={i}  />
                        })
                        }     
                    </Grid> 
                    <Grid className="grid_test" item xs={4}>
                        {members3.slice(0,3).map((member,i) => {
                            if(i%3===1)
                            return <TestimonialCard key={member._id} member={member} color1={i}  />
                        })
                        }         
                    </Grid> 
                    <Grid className="grid_test" item xs={4}>
                        {members3.slice(0,3).map((member,i) => {
                            if(i%3===2)
                            return <TestimonialCard key={member._id} member={member} color1={i} />
                        })
                        }         
                    </Grid> 
                </Grid>
                </BrowserView>
              <div className="view_detail">
                <div className="apply_button">
                        <button onClick={()=> window.location.href='/testimonials'} className="btn btn-primary btn-lg apply_btn">
                            View More...
                        </button>
                </div>
              </div>

            </div>
{/* ////////////////Footer Portion/////////////////// */}
            <div className="footer_about">
            <BrowserView>
                <Grid spacing={1} container>
                    <Grid className="footer_grid" item xs={4}>
                        <h1 className="footer_head">Markoknow</h1>
                        <p className="footer_para">Markoknow stand for People Marking their journey to Build Startups by Networking. So as the idea goes, Network is your Networth, you majorly build your Network Networth through Markoknow.</p>
                    </Grid>
                    <Grid className="footer_grid" item xs={4}>
                        <h1 className="footer_head1">Pages</h1>
                        {isLogin ? 
                        (<p className="footer_para"><Link to={`/profile/`+ window.localStorage.getItem("id")} className="footer_link">Profile</Link></p>):
                        (<p className="footer_para"><Link to={`/login`} className="footer_link">Profile</Link></p>)
                        } 
                        <p className="footer_para"><Link to={`/dashboard`} className="footer_link">Members</Link></p>
                        <p className="footer_para"><Link to={`/membership`} className="footer_link">Membership</Link></p>
                        <p className="footer_para"><HashLink smooth to={`/partnership#partner-page`} className="footer_link">Partnership</HashLink></p>
                    </Grid>
                    <Grid className="footer_grid" item xs={4}>
                        <h1 className="footer_head1">Contact Us</h1>
                        <a href="mailto:hello@markoknow.com">hello@markoknow.com</a>
                        <p>cc:{` `}<a href="mailto:markoknow@gmail.com">markoknow@gmail.com</a></p>
                    </Grid>
                </Grid>
            </BrowserView>
            <MobileView>
                <div className="footer_body">
                    <h1 className="footer_head">Markoknow</h1>
                    <p className="footer_para">Markoknow stand for People Marking their journey to Build Startups by Networking. So as the idea goes, Network is your Networth, you majorly build your Network Networth through Markoknow.</p>
                    <h1 className="footer_head1">Contact Us</h1>
                    <a href="mailto:hello@markoknow.com">hello@markoknow.com</a>
                    <p style={{margin:"auto"}}>cc:{` `}<a href="mailto:markoknow@gmail.com">markoknow@gmail.com</a></p> 
                    <h1 className="footer_head1">Pages</h1>
                    <Grid container spacing={1}>
                    <Grid item xs={4}>
                    <p className="footer_para"><Link to={`/dashboard`} className="footer_link">Members</Link></p>
                    <p className="footer_para"><HashLink smooth to={`/partnership#partner-page`} className="footer_link">Partner Us</HashLink></p>
                    </Grid>
                    <Grid item xs={4}>
                    <p className="footer_para"><Link to={`/membership`} className="footer_link">Membership</Link></p>
                    <p className="footer_para"><Link to={`/testimonials`} className="footer_link">Testimonial</Link></p>
                    </Grid>
                    <Grid item xs={4}>
                    <p className="footer_para"><Link to={`/bookevent`} className="footer_link">Book Event</Link></p>
                    </Grid>
                    </Grid>
                </div>  
            </MobileView>
            </div>
            </Box>
        </div>
    )
}

export default About