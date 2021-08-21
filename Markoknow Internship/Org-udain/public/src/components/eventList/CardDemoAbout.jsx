/* eslint-disable no-useless-computed-key */
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import "../../stylesheets/event.css";
import moment from 'moment';
import InnerImageZoom from 'react-inner-image-zoom';
import { Link } from "react-router-dom";
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css'
import { Grid } from "@material-ui/core";
require("dotenv").config();
const DOMAIN = process.env.REACT_APP_DOMAIN;

const useStyles = makeStyles((theme)=>({
  root: {
    maxWidth: 700,
    width:700,
    backgroundColor: "black",
  },
  media: {
    height: "250px",
    marginLeft: "30px",
    marginRight: "30px",
    ['@media only screen and (max-width: 420px)']: {
      height: "150px",
      marginLeft: "10px",
      marginRight: "10px",                 // secondary
    },
  },

}));

export default function CardDemoAbout({member}) {

  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const image = `${DOMAIN}/`+member.posterPath;
  var event = member.event;
  event = event.toUpperCase();
  const date = moment(member.eventDate).format("ll");

  return (
    <Card className={`${classes.root} middle_card`}>
    <CardContent className="upper_card">
        <Typography className="event_heading" gutterBottom variant="h5" component="h2">
          {event}
        </Typography>
        <Typography className="event_heading" gutterBottom variant="h5" component="h2">
          {date}
        </Typography>
    </CardContent>
      <CardMedia
        className={classes.media}
        // image={image}
        // title="Event_image"
      ><InnerImageZoom className="event_img" src={image} alt="Event_image" /></CardMedia>
      <CardContent className="bottom_card">
        <Grid container spacing={1}>
        <Grid className="buttons_grid" item xs={6}>
         <Link to={`/bookevent`} >
          <button style={{backgroundColor:"#8dffcc"}} className="event_btn">{member.credit > 0 ? <h1>Use Points({member.credit})</h1> : <h1>Book Free Event</h1>}</button>
         </Link>
        </Grid>
        <Grid className="buttons_grid" item xs={6}>
         <Link to={`/bookevent`} >
          <button style={{backgroundColor:"rgb(82, 239, 218)"}} className="event_btn"><h1>Book Now</h1></button>
         </Link>
        </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

