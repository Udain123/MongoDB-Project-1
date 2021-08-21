import { Box, Link} from '@material-ui/core'
import React from 'react';
import Grid from '@material-ui/core/Grid';
//import List from "@material-ui/core/List"; RiCoinsFill
import { RiCoinsFill } from 'react-icons/ri';
import Fab from '@material-ui/core/Fab';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import "../../stylesheets/home.css";

require("dotenv").config();
const DOMAIN = process.env.REACT_APP_DOMAIN;


function MemberAbout({member}) {

    const linkin = member.linkedin;
    const src = `${DOMAIN}/${member.imagePath}`;



    return(
        <div>
       <Box 
        boxShadow={5}
        bgcolor="#befaf2"
        className="member_about"
        >
        <Grid container spacing={1}>  
           <Grid item xs={4}>
                <img className="img_member_about" src={src} alt="profile_photo"/><br/>
                <Fab className="member_cont"><Link
             style={{cursor:"pointer"}} 
             onClick={() => { window.open(linkin ,'_blank')}}
             color="inherit"><LinkedInIcon /></Link><p className="about_cont">-Connect</p></Fab><br/>
            <Fab style={{cursor:"inherit"}} className="member_cont"><RiCoinsFill size="25px"/><p className="about_cont">-{member.point} pts</p></Fab>
           </Grid>
           <Grid className="member_details" item xs={8}>
            <div>
            <h2 className="member_info_head"><strong>{member.name}</strong><div id="border_bottom_1"></div></h2>
            <p className="member_info_about"><strong>{member.designation} at {member.company}
            </strong></p>
            <p className="member_info_about"><strong>About:</strong> {member.about}</p>
            </div>
           </Grid>
        </Grid>
        </Box>
        <br/>
        </div>
    )
}


export default MemberAbout;