import React from 'react';
import {  Box } from '@material-ui/core';
import "../../stylesheets/partnership.css";
import { HashLink } from 'react-router-hash-link';
import {isBrowser, isMobile} from "react-device-detect";
import OrganiseForm from './organiseForm';
import SponsorForm from './sponsorForm';

function PartnerShip() {


    return (
        <div className="partner_ship">
            <Box
                boxShadow={4}
                bgcolor="white"
                m={1}
                p={1}
                className="Box_partnership"
                id="partner-page"
            >
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
            </Box>
            <OrganiseForm/>
            <SponsorForm/>
            
            
        </div>
    )
}

export default PartnerShip;
