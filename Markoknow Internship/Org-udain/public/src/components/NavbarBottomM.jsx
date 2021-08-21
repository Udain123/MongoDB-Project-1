import React from 'react'
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Fab from '@material-ui/core/Fab';
import IconButton from "@material-ui/core/IconButton";
import PeopleIcon from '@material-ui/icons/People';
import EventIcon from '@material-ui/icons/Event';
import { FaHandshake } from 'react-icons/fa';
import "../stylesheets/Navbar.css"
import {Link} from "react-router-dom";
import Toolbar from "@material-ui/core/Toolbar";
//import Typography from "@material-ui/core/Typography";
const useStyles = makeStyles((theme) => ({

  appBar: {
    top: 'auto',
    bottom: 0,
    backgroundColor:'black',
    marginTop: theme.spacing(10),
    },
  grow: {
    flexGrow: 1,
  },
  fabButton: {
    position: 'absolute',
    zIndex: 1,
    top: -20,
    left: 0,
    right: 0,
    margin: '0 auto',
    
  },
}));

function NavbarBottomM() {

    const classes = useStyles();
    return (
        <div className={classes.root}>
        <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton aria-label="dashboard">
            <Link to="/dashboard">
              <PeopleIcon className="bottom_icon" />
            </Link>
          </IconButton>
          <Fab  aria-label="add" style={{backgroundColor:"#52efda"}} className={classes.fabButton}>
            <Link to="/bookevent">
              <EventIcon fontSize="large" className="fab_button" />
            </Link>
          </Fab>
          <div className={classes.grow} />
          <IconButton aria-label="event">
            <Link to="/partnership">
              <FaHandshake className="bottom_icon"/>
            </Link>
          </IconButton>
        </Toolbar>
      </AppBar>
        </div>
    )
}

export default NavbarBottomM