import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  //addDummyDbItems,
  //addDbItem,
  //getAllDbItems,
  //getDbItemById,
  DbItem,
  //updateDbItemById,
} from "./db";
//import filePath from "./filePath";
import { client } from "./queries";

//addDummyDbItems(10);

const app = express();

/** Parses JSON data in a request automatically */
app.use(express.json());
/** To allow 'Cross-Origin Resource Sharing': https://en.wikipedia.org/wiki/Cross-origin_resource_sharing */
app.use(cors());
// read in contents of any environment variables in the .env file
dotenv.config();
// use the environment variable PORT, or 4000 as a fallback
const PORT_NUMBER = process.env.PORT ?? 4000;

// API info page
/*app.get("/", (req, res) => {
  try{}
  catch (err){console.error(err.message)}
  const pathToFile = filePath("../public/index.html");
  res.sendFile(pathToFile);
});*/

// GET /items
app.get("/todos", async (req, res) => {
  await client.connect();
  try {
    const getAllToDos = await client.query("SELECT * FROM todolist");
    //const allToDoItems = getAllDbItems();
    res.status(200).json(getAllToDos.rows);
    console.log(getAllToDos.rows);
  } catch (err) {
    console.error(err);
  }
  await client.end();
});

// POST /items
app.post<{}, {}, DbItem>("/todos", async (req, res) => {
  await client.connect();
  try {
    const inputToDo = req.body;
    const newToDo = await client.query(
      "INSERT INTO todolist (description, creation_date, due_date) VALUES ($1, $2, $3) RETURNING *",
      [inputToDo.description, inputToDo.creationDate, inputToDo.dueDate]
    );
    //const createdToDoItem = addDbItem(newToDo);
    res.status(201).json(newToDo.rows);
  } catch (err) {
    console.error(err);
  }
  await client.end();
});

// GET /items/:id
app.get<{ id: string }>("/todos/:id", async (req, res) => {
  await client.connect();
  try {
    const getThisToDo = await client.query(
      "SELECT * FROM todolist WHERE todo_id = $1",
      [req.params.id]
    );
    //const matchingToDoItem = getDbItemById(parseInt(req.params.id));
    if (getThisToDo.rows.length > 0) {
      res.status(200).json(getThisToDo.rows);
    }
  } catch (err) {
    console.error(err);
  }
  await client.end();
});

// DELETE /items/:id
app.delete<{ id: string }>("/todos/:id", async (req, res) => {
  await client.connect();
  try {
    const deleteThisToDo = await client.query(
      "DELETE * FROM todolist WHERE todo_id = $1 RETURNING *",
      [req.params.id]
    );
    //const matchingToDoItem = getDbItemById(parseInt(req.params.id));
    if (deleteThisToDo.rows.length > 0) {
      res.status(200).json(deleteThisToDo.rows);
    }
  } catch (err) {
    console.error(err);
  }
  await client.end();
});

// PATCH /items/:id
app.put<{ id: string }, {}, Partial<DbItem>>("/todos/:id", async (req, res) => {
  await client.connect();
  try {
    const editedToDoBody = req.body;
    const editThisToDo = await client.query(
      "UPDATE todolist SET description = $1, creation_date = $2, due_date = $3 WHERE todo_id = $4 RETURNING *",
      [
        editedToDoBody.description,
        editedToDoBody.creationDate,
        editedToDoBody.dueDate,
        req.params.id,
      ]
    );
    if (editThisToDo.rows.length > 0) {
      res.status(200).json(editThisToDo.rows);
    }
  } catch (err) {
    console.error(err);
  }
  await client.end();
});

app.listen(PORT_NUMBER, () => {
  console.log(`Server is listening on port ${PORT_NUMBER}!`);
});
