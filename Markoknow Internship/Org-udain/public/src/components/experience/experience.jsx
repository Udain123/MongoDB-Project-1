import React from 'react';
import {  Box } from '@material-ui/core';
import "../../stylesheets/partnership.css";
import { HashLink } from 'react-router-hash-link';
import {isBrowser, isMobile} from "react-device-detect";
import ApplyForm from './applyForm';
import InspireForm from './inspireForm';

function Experience() {


    return (
        <div className="partner_ship">
            <Box
                boxShadow={4}
                bgcolor="white"
                m={1}
                p={1}
                className="Box_partnership"
                id="experience-page"
            >
            <h1 className="partner_heading" >Experience</h1>
            {isBrowser &&
            <p className="partner_para">Get experience of How an Early Stage Startup works and choose the founder<br/> whose story inspires you the most</p>
            }
            {isMobile &&
                <p className="partner_para">Get experience of How an Early Stage Startup works and choose the founder<br/> whose story inspires you the most</p>
            }
            
            <br/>
            <div class="partnership_btn">
                <HashLink className="hash_link" smooth to={'/experience#apply-form'}>
                    <button name="submit" class="exp_btn first">Apply for Experience</button>
                </HashLink>
                <HashLink className="hash_link" smooth to={'/experience#inspire-form'}>
                    <button name="submit" class="exp_btn first">Inspire Young Entrepreneurs</button>                
                </HashLink>
            </div>
            </Box>
            <ApplyForm/>
            <InspireForm/> 
            
            
        </div>
    )
}

export default Experience;
