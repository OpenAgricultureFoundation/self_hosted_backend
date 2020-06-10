import React, {useEffect, useState} from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    NavLink as RRNavLink
} from "react-router-dom";
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import './App.css';
import DeviceList from "./DeviceList";
import DownloadData from "./DownloadData";

function App() {

    return (
        <Router>
            <div>
                <Navbar color="light" light expand="md">
                    <NavbarBrand>OpenAg Selfhosted Backend</NavbarBrand>
                    <Nav>
                        <NavItem>
                            <NavLink tag={RRNavLink} to="/">Device Listing</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink tag={RRNavLink} to="/downloadData">Download Data</NavLink>
                        </NavItem>
                    </Nav>
                </Navbar>

            </div>
            <Switch>
                <Route path="/downloadData">
                    <DownloadData/>
                </Route>
                <Route path="/">
                    <DeviceList/>
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
