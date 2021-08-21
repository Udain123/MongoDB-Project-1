/* eslint-disable array-callback-return */
import React,{useState, useEffect} from 'react';
import "../../stylesheets/testimonialCard.css";
import axios from "axios";
import { Grid } from '@material-ui/core';
import TestimonialCard from './testimonials';
import { BrowserView, MobileView } from 'react-device-detect';
require("dotenv").config();
const DOMAIN = process.env.REACT_APP_DOMAIN;

function Testimonials() {

    const [members,setMembers] = useState([])

    useEffect(()=>{
        getAllMember();
    },[])

    const getAllMember = () =>{
        axios
            .get(`${DOMAIN}/api/testimonials`)
            .then((res)=>{
                setMembers(res.data.result);
            })
            .catch((err)=>{
                console.log(`Error: ${err}` );
            });
    }

    return (
        <div>
            <MobileView>
                <div className="container " style={{marginBottom:"5rem"}}>
                    <div className="row">
                        {members.slice(0,3).map((member,i) => (
                            <TestimonialCard key={member._id} member={member} color1={i} />
                        ))}
                    </div>
                </div> 
            </MobileView>
            <BrowserView>
            <Grid className="grid_testimonials" container spacing={1}>
            <Grid className="grid_test" item xs={4}>
            {members.map((member,i) => {
                    if(i%3===0)
                    return <TestimonialCard key={member._id} member={member} color1={i} />
                })
                }     
            </Grid> 
            <Grid className="grid_test" item xs={4}>
            {members.map((member,i) => {
                    if(i%3===1)
                    return <TestimonialCard key={member._id} member={member} color1={i} />
                })
                }         
            </Grid> 
            <Grid className="grid_test" item xs={4}>
            {members.map((member,i) => {
                    if(i%3===2)
                    return <TestimonialCard key={member._id} member={member} color1={i} />
                })
                }         
            </Grid> 
        </Grid>
        </BrowserView>
        </div>
    )
}

export default Testimonials;