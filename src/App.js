import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import React, { Component } from "react";
import Navigation from "./components/navbar/navigation";
import Home from "./components/home/home";
import Login from "./components/loging/loging";
import Register from "./components/register/register";
import { Route, Switch, Redirect } from "react-router-dom";
import Notfound from "./components/not-found";
import { setTheData, getTheData } from "./helpers/localStorage";
import apiRequest from "./helpers/api";

class App extends Component {
  state = {
    account: {
      username: "",
      password: "",
    },
    error: {},

    user: getTheData().username || false,
  };

  handleChange = (e) => {
    const { account } = this.state;
    account[e.target.name] = e.target.value;
    this.setState({ account });
  };

  valdiate = () => {
    const { account } = this.state;
    const error = {};

    if (account.username.trim() === "") {
      error.username = "Username is required";
    }
    if (account.password.trim() === "") {
      error.password = "Password is required";
    }

    return error.username || error.password ? error : "";
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    if (getTheData().username) return (window.location = "/");

    const error = this.valdiate();
    if (error) return this.setState({ error });

    // call the server
    const { account } = this.state;
    const response = await apiRequest(account, "patch");
    setTheData("user", response);

    if (response) {
      window.location = "/";
    } else {
      this.setState({
        error: { wronguser: "Username or Password is not correct" },
      });
    }
  };

  handleRegister = async (e) => {
    e.preventDefault();
    const { account } = this.state;

    if (getTheData().username) return (window.location = "/");

    const error = this.valdiate();
    if (error) return this.setState({ error });
    if (account.confirm !== account.password)
      return this.setState({ error: { confirm: "password doesn't match" } });

    // call the server
    const response = await apiRequest(account, "post");
    setTheData("user", response);

    if (response) {
      window.location = "/";
    } else {
      this.setState({
        error: { userexist: "Username already exist" },
      });
    }
  };
  render() {
    const { error, user } = this.state;
    return (
      <div>
        <Navigation />
        <div>
          <Switch>
            <Route
              path="/login"
              render={(props) => (
                <Login
                  error={error}
                  handleSubmit={this.handleSubmit}
                  handleChange={this.handleChange}
                  user={user}
                  {...props}
                />
              )}
            />
            <Route
              path="/register"
              render={(props) => (
                <Register
                  error={error}
                  handleSubmit={this.handleRegister}
                  handleChange={this.handleChange}
                  user={user}
                  {...props}
                />
              )}
            />
            <Route path="/not-found" component={Notfound} />
            <Route path="/home" exact component={Home} />
            <Route path="/" exact component={Home} />
            <Redirect to="/not-found" />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
