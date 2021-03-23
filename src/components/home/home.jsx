import React, { Component } from "react";
import "./home.css";
import { Icon } from "@iconify/react";
import iosTrashOutline from "@iconify/icons-ion/ios-trash-outline";
import sharpDoneAll from "@iconify/icons-ic/sharp-done-all";
import outlineListAlt from "@iconify/icons-ic/outline-list-alt";
import { getTheData, setTheData } from "../../helpers/localStorage";
import apiRequest from "../../helpers/api";

class Home extends Component {
  state = {
    user: getTheData().username || "",
    todo: getTheData().todo || getTheData() || [],
    inputValue: "",
    todoIdForEdit: -1,
  };
  handleChange = (e) => {
    let { inputValue } = this.state;
    inputValue = e.target.value;
    this.setState({ inputValue });
  };
  addTodo = async (e) => {
    e.preventDefault();
    const { todo, inputValue, user } = this.state;

    const randomId = () => "_" + Math.random().toString(36).substr(2, 9);

    if (inputValue.trim() !== "" && user) {
      if (!getTheData().username) return (window.location = "/");

      this.setState({ todo, inputValue: "" });

      // calling the backend
      const response = await apiRequest(
        { username: user, todo: inputValue },
        "put"
      );
      setTheData("user", response);

      this.setState({ todo: getTheData().todo });
    } else {
      if (inputValue.trim() !== "") {
        this.addTaskInIndex(todo, {
          _id: randomId(),
          todo: inputValue,
          done: false,
        });
        this.setState({ todo, inputValue: "" });
        setTheData("noUser", todo);
      }
    }
  };
  deleteTodo = async (id) => {
    const { todo, user } = this.state;

    const filtredTodo = todo.filter((t) => id !== t._id);
    this.setState({ todo: filtredTodo });
    if (user) {
      if (!getTheData().username) return (window.location = "/");
      // calling the backend
      const response = await apiRequest(
        { username: user, todoId: id },
        "delete"
      );
      setTheData("user", response);
    } else {
      setTheData("noUser", filtredTodo);
    }
  };
  todoDone = async (task) => {
    const { todo, user } = this.state;
    const todoDoneId = task._id;

    if (!getTheData().username) this.reArrange(task, todo);
    const changeDone = todo.map((t) =>
      t._id === todoDoneId ? { ...t, done: !t.done } : { ...t }
    );
    this.setState({ todo: changeDone });

    if (user) {
      if (!getTheData().username) return (window.location = "/");
      // calling the backend
      const response = await apiRequest({ username: user, todoDoneId }, "put");
      setTheData("user", response);
    } else {
      setTheData("noUser", changeDone);
    }
  };
  reArrange = (task, arr) => {
    const index = arr.indexOf(task);
    let temp = arr[index];
    arr.splice(index, 1);
    if (!task.done) {
      arr.push(temp);
    } else {
      arr.unshift(temp);
    }
  };
  addTaskInIndex = (todos, task) => {
    if (todos.length > 0) {
      for (let i = 0; i < todos.length; i++) {
        if (todos[i].done) {
          todos.splice(i, 0, task);
          return;
        }
      }
      todos.push(task);
    } else {
      todos.push(task);
    }
  };
  editTodo = (task) => {
    this.setState({ todoIdForEdit: task._id });
  };
  editTask = (e) => {
    const { todo, todoIdForEdit } = this.state;
    const newValue = e.target.value;
    const newEdit = todo.map((t) =>
      t._id === todoIdForEdit ? { ...t, todo: newValue } : { ...t }
    );
    this.setState({ todo: newEdit });
  };
  onblurTask = async (task) => {
    const { todo, user } = this.state;
    if (task.todo.trim() === "") return this.deleteTodo(task._id);
    if (user) {
      if (!getTheData().username) return (window.location = "/");
      const response = await apiRequest(
        { username: user, EditTodoId: task._id, newTodoValue: task.todo },
        "put"
      );
      setTheData("user", response);
    } else {
      setTheData("noUser", todo);
    }
    this.setState({ todoIdForEdit: -1 });
  };
  handleKeyDown = (e, task) => {
    if (e.key === "Enter") {
      this.onblurTask(task);
    }
  };
  render() {
    const { user, todo, todoIdForEdit, inputValue } = this.state;
    return (
      <div className="home">
        <form className="input-group mb-3" onSubmit={this.addTodo}>
          <input
            type="text"
            value={inputValue}
            onChange={this.handleChange}
            className="form-control"
            placeholder="A Job To Do ..."
          />
          <div className="input-group-append">
            <button
              onClick={this.addTodo}
              className="btn btn-secondary"
              type="button"
            >
              Add
            </button>
          </div>
        </form>

        <div className="tasks">
          <div className="iconTasks">
            <Icon icon={outlineListAlt} />
          </div>

          <h1> Hello!! {user}</h1>
          <ul>
            {todo.map((t) => (
              <li
                className={`${t.done ? "active" : ""} ${
                  t._id === todoIdForEdit ? "edit" : ""
                }`}
                key={t._id}
              >
                <div className="done-icon-container">
                  <Icon
                    onClick={() => this.todoDone(t)}
                    className="done-icon"
                    icon={sharpDoneAll}
                  />
                </div>
                <span onClick={() => this.editTodo(t)}>
                  {t._id === todoIdForEdit ? (
                    <input
                      autoFocus
                      onKeyDown={(e) => this.handleKeyDown(e, t)}
                      onBlur={() => this.onblurTask(t)}
                      onChange={this.editTask}
                      value={t.todo}
                    />
                  ) : (
                    t.todo
                  )}
                </span>

                <Icon
                  className="icon-delete"
                  onClick={() => this.deleteTodo(t._id)}
                  icon={iosTrashOutline}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default Home;
