import React from 'react'
import {isMobile} from "react-device-detect";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { NavLink } from "react-router-dom";
import "../stylesheets/Navbar.css"
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
  

function NavbarTopM({ isAuth, setIsAuth }) {

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
        <AppBar position="static" className="Navbar" style={{ backgroundColor: "black", height: "5.5rem" }}>
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              <h1><a href="/" style={{textDecoration:"none", color:"white"}}>Markoknow</a></h1>
            </Typography>

            <div>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              {isMobile &&
              <AccountCircle fontSize="large" className="account_icon"/>}
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
                  <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                </div>
              ) : (
                <div>
                  <MenuItem onClick={logoutHandler}>
                    <NavLink to="/signup" exact style={{ textDecoration: 'none', color: "black" }} className="nav-link">
                      SIGNUP
                    </NavLink>
                  </MenuItem>
                  <MenuItem onClick={logoutHandler}>
                    <NavLink to="/login" exact style={{ textDecoration: 'none', color: "black" }} className="nav-link">
                      LOGIN
                    </NavLink>
                  </MenuItem>
                </div>
              )}
            </Menu>
          </div>

           </Toolbar>
        </AppBar>
        </div>
    )
}

export default NavbarTopM