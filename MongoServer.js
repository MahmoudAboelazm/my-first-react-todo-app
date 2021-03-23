const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passwordHash = require("password-hash");
const cors = require("cors");
const { json } = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose.connect(
  "mongodb://127.0.0.1:27017",
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  },
  console.log("Connected to the database")
);
const ListTodo = mongoose.model(
  "list",
  new mongoose.Schema({
    todo: String,
    done: Boolean,
  })
);
const Users = mongoose.model(
  "users",
  new mongoose.Schema(
    {
      _id: { type: Number },
      username: String,
      password: String,
      todo: [ListTodo.schema],
    },
    { versionKey: false }
  )
);

// Login require ( username and password ) from the input
app.patch("/", async (req, res) => {
  const { username, password } = req.body;

  if (username) {
    const data = await Users.findOne({ username });
    !data
      ? res.send(false)
      : passwordHash.verify(password, data.password)
      ? res.send(data)
      : res.send(false);
  } else {
    res.send("login");
  }
});

//Regestiraion require ( username and password ) from the input
app.post("/", async (req, res) => {
  const { username, password } = req.body;

  if (!username) return res.send("you have to put a username");
  if (!password) return res.send("you have to put a password");

  const findUser = await Users.findOne({ username });
  if (findUser) return res.send(false);

  const allusers = await Users.find();
  const usersLength = allusers.length;
  const newUser = {
    _id: usersLength + 1,
    username,
    password: passwordHash.generate(password),
    todo: [],
  };

  new Users(newUser).save();
  res.send(newUser);
});

// Adding a todo require ( username , todo ) from the state
// Assgin done require ( username , todoId ) from the state
app.put("/", (req, res) => {
  const { username, todo, todoDoneId, EditTodoId, newTodoValue } = req.body;

  if (!username) return res.send("There is no user logged in!!!");

  // edit todo require ( username , EditTodoId, newTodoValue ) from the state
  if (EditTodoId) {
    Users.findOne({ username }, (err, user) => {
      let { todo } = user;
      const t = todo;
      t.forEach((e) => {
        if (EditTodoId.toString() === e._id.toString()) e.todo = newTodoValue;
      });
      user.todo = t;
      user.save();
      res.send(user);
    });
  }

  // Adding a todo require ( username , todo ) from the state
  if (todo) {
    Users.findOne({ username }, (err, user) => {
      if (!todo) return res.send(user);

      const newTodo = {
        todo,
        done: false,
      };
      const list = new ListTodo(newTodo);
      user.todo.push(list);
      user.save();
      res.send(user);
    });
  }

  // Assgin done require ( username , todoDoneId ) from the state
  if (todoDoneId) {
    Users.findOne({ username }, (err, user) => {
      let { todo } = user;
      const t = todo;
      t.forEach((e) => {
        todoDoneId.toString() !== e._id.toString()
          ? (e.done = e.done)
          : (e.done = !e.done);
      });
      user.todo = t;
      user.save();
      res.send(user);
    });
  }
});

// Deleting a todo require ( username , todoId ) from the state
app.delete("/", (req, res) => {
  const { username, todoId } = req.body;

  if (!username) return res.send("There is no user logged in!!!");

  Users.findOne({ username }, (err, user) => {
    if (!todoId) return res.send(user);

    let { todo } = user;
    const t = todo.filter((t) => todoId.toString() !== t._id.toString());

    user.todo = t;
    user.save();
    res.send(user);
  });
});

app.listen(5000);
