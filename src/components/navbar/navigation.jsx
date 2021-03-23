import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import "./navbar.css";

class Navigation extends Component {
  logout = () => {
    localStorage.setItem("user", false);
    window.location = "/";
  };

  render() {
    const user = JSON.parse(localStorage.getItem("user"));
    return (
      <Navbar collapseOnSelect expand="lg">
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <NavLink className="nav-item nav-link" to="/home">
            Tasks
          </NavLink>
          {!user && (
            <React.Fragment>
              <NavLink className="nav-item nav-link" to="/login">
                Login
              </NavLink>

              <NavLink className="nav-item nav-link" to="/register">
                Register
              </NavLink>
            </React.Fragment>
          )}
          {user && (
            <a className="nav-item nav-link" href="/" onClick={this.logout}>
              LogOut
            </a>
          )}
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default Navigation;
