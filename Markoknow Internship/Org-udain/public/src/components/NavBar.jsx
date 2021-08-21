import React from 'react'
import NavbarTop from './NavbarTop'
import {
    BrowserView,
    MobileView
  } from "react-device-detect";
import NavbarBottomM from './NavbarBottomM';
import NavbarTopM from './NavbarTopM';

function NavBar({ isAuth, setIsAuth }) {
    return (
        <div>
            <BrowserView>
                <NavbarTop isAuth={isAuth} setIsAuth={setIsAuth} />
            </BrowserView>
            <MobileView>
                <NavbarTopM isAuth={isAuth} setIsAuth={setIsAuth}/>
                <NavbarBottomM/>
            </MobileView>
        </div>
    )
}

export default NavBar
