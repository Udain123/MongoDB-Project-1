import React from 'react';
import {isBrowser} from "react-device-detect";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { NavLink } from "react-router-dom";
import "../stylesheets/Navbar.css";
import "../stylesheets/navbarTop.css";
import logomark from "../images/logomark1.jpeg";


const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      outline: "black"
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      color: "black",
      flexGrow: 1,
    },
  }));
  

function NavbarTop({ isAuth, setIsAuth }) {

    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleMenu = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const logoutHandler = () => {
      setAnchorEl(null);
      setIsAuth(false);
      window.localStorage.clear();
    };

    return (
        <div className={classes.root}>
        <AppBar position="static" className="Navbar" style={{ backgroundColor: "black", height: "6rem" }}>
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              <a href="/" style={{textDecoration:"none", color:"white"}}>
              <img className="image_logo" src={logomark} alt="Logo" />
              </a>
            </Typography>

            <div>

            <IconButton className="icons" aria-label="members">
                <NavLink to="/dashboard" className="navbar_item"><h6 className="navbar_member">MEMBERS<div id="border_bottom1"></div></h6></NavLink>
            </IconButton>

            <IconButton className="icons" aria-label="members">
                <NavLink to="/partnership" className="navbar_item"><h6 className="navbar_member">PARTNERSHIP<div id="border_bottom"></div></h6></NavLink>
            </IconButton>

            <IconButton className="icons" aria-label="members">
                <NavLink to="/bookevent" className="navbar_item"><h6 className="navbar_member">BOOK EVENT<div id="border_bottom"></div></h6></NavLink>
            </IconButton>
            
            <IconButton className="icons" aria-label="members">
                <NavLink to="/subscription" className="navbar_item"><h6 className="navbar_member">SUBSCRIPTION<div id="border_bottom"></div></h6></NavLink>
            </IconButton>
            
            <IconButton className="icons" aria-label="members">
                <NavLink to="/experience" className="navbar_item"><h6 className="navbar_member">EXPERIENCE<div id="border_bottom"></div></h6></NavLink>
            </IconButton>
            

            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
              className="account_icon icons"
            >
              {isBrowser && !isAuth &&
                <button className="btn btn-primary btn-lg log_btn">LOGIN</button>
              }
              {isBrowser && isAuth && 
              <>
              
              <button className="btn btn-primary btn-lg log_btn">{window.localStorage.getItem("name").substring(0,9)}</button>
              </>
              }
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={open}
              onClose={handleClose}
            >
              {isAuth ? (
                <div>
                  <NavLink to={"/profile/"+window.localStorage.getItem("id")} exact style={{ textDecoration: 'none', color: "black" }} className="nav-link">
                    <MenuItem onClick={handleClose}>
                      {window.localStorage.getItem("name")}
                    </MenuItem>
                  </NavLink>
                  <MenuItem onClick={logoutHandler}>LOGOUT</MenuItem>
                </div>
              ) : (
                <div>
                  <NavLink to="/signup" exact style={{ textDecoration: 'none', color: "black" }} className="nav-link"> 
                    <MenuItem onClick={logoutHandler}>
                      SIGNUP
                    </MenuItem>
                  </NavLink>
                  <NavLink to="/login" exact style={{ textDecoration: 'none', color: "black" }} className="nav-link"> 
                    <MenuItem onClick={logoutHandler}>
                      LOGIN
                    </MenuItem>
                  </NavLink>
                </div>
              )}
            </Menu>
          </div>

           </Toolbar>
        </AppBar>
        </div>
    )
}

export default NavbarTop
