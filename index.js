const express = require("express");
const shortid = require("shortid");
const app = express();
const port = 5000;

/**
 * All Todo List
 */

let todos = [];

/**
 * Middleware Configuration
 */
app.use(express.json());

/**
 * Router Configuration
 */
app.delete("/todos/:id", (req, res) => {
  const { id } = req.params;
  const index = todos.findIndex((todo) => todo.id === id);
  todos.splice(index, 1);
  return res.status(204).json({ message: "Todo Deleted" });
});

app.patch("/todos/:id", (req, res) => {
  const { id } = req.params;
  const { text, isCompleted } = req.body;
  const index = todos.findIndex((todo) => todo.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Todo Not Found" });
  } else {
    todos[index].text = text || todos[index].text;
    todos[index].isCompleted = isCompleted || todos[index].isCompleted;
    return res.status(200).json({ message: "Todo Updated Successfully Done!" });
  }
});

/**
 * if todo is already exists then update it or new one will be created
 */
app.put("/todos/:id", (req, res) => {
  const { id } = req.params;
  const { text, isCompleted } = req.body;
  const todo = todos.find((todo) => todo.id === id);

  if (!todo) {
    const newtodo = {
      id: shortid.generate(),
      text,
      isCompleted: false,
      created: new Date(),
    };
    todos.push(newtodo);
    res.status(201).json({ message: "Todo Created successfully", ...newtodo });
  } else {
    todo.text = text || todo.text;
    todo.isCompleted = isCompleted || todo.isCompleted;
    const todoIndex = todos.findIndex((todo) => todo.id === id);
    todos[todoIndex] = todo;
    res.status(201).json({ message: "Todo Update successfully", ...todo });
  }
});

/**
 * Get todo at specific item
 */
app.get("/todos/:id", (req, res) => {
  const { id } = req.params;
  const todo = todos.find((todo) => todo.id === id);
  res.status(201).json(todo);
});

/**
 * Get All Todos
 */
app.get("/todos", (req, res) => {
  const getTodo = todos.map((todo) => ({ id: todo.id, todo: todo.text }));
  res.status(200).json(getTodo);
});

/**
 * Add a new todo item to Database
 */
app.post("/todos", (req, res) => {
  const { text } = req.body;

  const todo = {
    id: shortid.generate(),
    text,
    isCompleted: false,
    created: new Date(),
  };
  todos.push(todo);
  res.status(201).json({ message: "Todo Created successfully", ...todo });
});

/**
 * Server Configuration
 */
app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
