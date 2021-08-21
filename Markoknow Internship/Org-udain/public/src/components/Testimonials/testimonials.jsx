import React from 'react';
import { BrowserView, MobileView } from 'react-device-detect';
import { Link } from "react-router-dom";
import "../../stylesheets/testimonialCard.css";
require("dotenv").config();
const DOMAIN = process.env.REACT_APP_DOMAIN;

function TestimonialCard({member,color1}) {

    const img = `${DOMAIN}/${member.imagePath}`;
    const pathn = window.location.pathname;
    var testimonial = member.testimonial;
    var col = "#8dffcc"
    if(color1%2!==0){ col = "#52efda"; }
    var style = { "--my-css-var": col } ;
    return (
        <div>
          <BrowserView>
            {pathn === "/testimonials" && 
            <p style={style} className="para_test">
                {member.testimonial}
            </p>}
            {pathn === "/" && 
            <p style={style} className="para_test">
                {testimonial.substring(0,135)}{testimonial.length > 130 && <Link className="hash_link" to="/testimonials">{`...`}</Link>}
            </p>}

            <div class="wrapper">
                <img className="test_img" src={img} alt="testimonia_img" />
                <h3>{member.name}</h3>
                <small>{member.designation}</small>
            </div> 
          </BrowserView>
          <MobileView>
            {pathn === "/testimonials" && 
                <p style={style} className="para_test">
                {member.testimonial}
                </p>}
                {pathn === "/" && 
                <p style={style} className="para_test">
                {testimonial.substring(0,85)}{testimonial.length > 85 && <Link className="hash_link" to="/testimonials">{`...`}</Link>}
                </p>}

              <div class="wrapper">
                <img className="test_img" src={img} alt="testimonia_img" />
                <h3>{member.name}</h3>
                <small>{member.designation}</small>
              </div> 
          </MobileView>        
        </div>
    )
}

export default TestimonialCard;
