import { Router } from "express";
import { Todo } from "../models/todo";
import fs from "fs/promises";
import path from "path";

type RequestBody = { text: string };
type RequestParams = { todoId: string };
type RequestQueries = { isCompleted?: string; searchTerm?: string };

// Path give us the current path 👇 here we concatenate a relative path ../db/data.json
const dataFilePath = path.join(__dirname, "..", "db", "data.json");

// Now todos are persisted in a json file. This task should be async
async function readTodosFromFile(): Promise<Todo[]> {
  try {
    // fs (file system) module helps us store, access, and manage data on our operating system 💻
    // in order to read a file we need to set a path and encoding 👇
    const fileContent = await fs.readFile(dataFilePath, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    return [];
  }
}

// Now todos are saved and persisted in a JSON file 📁
async function writeTodosToFile(todos: Todo[]): Promise<void> {
  // In order to save data in a file we should specify the file's path, the string to write
  // and the file character codification 🔡 👇
  await fs.writeFile(dataFilePath, JSON.stringify(todos, null, 2), "utf-8");
}

const router = Router();

// Realize that functions turns async due that now we are using async function
// in order to read and write files. 👇 📁
router.get("/todos", async (req, res, next) => {
  const params = req.query as RequestQueries;
  const { isCompleted, searchTerm } = params;

  let todoList: Todo[] = await readTodosFromFile();

  if (searchTerm) {
    todoList = todoList.filter((e) => e.text.includes(searchTerm));
  }

  if (isCompleted) {
    const searchedState = isCompleted.toLowerCase() === "true";
    todoList = todoList.filter((e) => e.isCompleted === searchedState);
  }

  res.status(200).json({ todos: todoList });
});

router.get("/users", async (req, res) => {
  res.status(200).json({ name: "michel", age: 1231243 });
});

router.get("/todos/:todoId", async (req, res, next) => {
  const body = req.params as RequestParams;
  const { todoId } = body;

  if (!todoId) {
    return res.status(404).json({
      code: "INVALID_REQUEST",
      message: "The todoId field is required.",
    });
  }

  const todoList = await readTodosFromFile();
  const foundTodo = todoList.find((e) => e.id === todoId);

  if (!foundTodo) {
    return res.status(404).json({
      code: "TODO_NOT_FOUND",
      message: "The requested todo was not found.",
    });
  } else {
    return res.status(200).json({ todo: foundTodo });
  }
});

router.post("/todos", async (req, res, next) => {
  const body = req.body as RequestBody;
  const newTodo: Todo = {
    id: new Date().toISOString(),
    text: body.text,
    isCompleted: false,
  };

  let todoList = await readTodosFromFile();
  todoList.push(newTodo);

  await writeTodosToFile(todoList);

  res
    .status(201)
    .json({ message: "Added Todo", todo: newTodo, todos: todoList });
});

router.put("/todos/:todoId", async (req, res, next) => {
  const params = req.params as RequestParams;
  const id = params.todoId;
  const body = req.body as RequestBody;

  let todoList = await readTodosFromFile();
  const todoIndex = todoList.findIndex((todoItem) => todoItem.id === id);

  if (todoIndex >= 0) {
    todoList[todoIndex] = {
      id: todoList[todoIndex].id,
      text: body.text,
      isCompleted: false,
    };

    await writeTodosToFile(todoList);

    return res.status(200).json({ message: "Updated todo", todos: todoList });
  }

  res.status(404).json({ message: "Could not find todo for this id." });
});

router.delete("/todos/:todoId", async (req, res, next) => {
  const params = req.params as RequestParams;

  let todoList = await readTodosFromFile();
  todoList = todoList.filter((todoItem) => todoItem.id !== params.todoId);

  await writeTodosToFile(todoList);

  res.status(200).json({ message: "Deleted todo", todos: todoList });
});

export default router;
