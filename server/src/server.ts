import express, { type Express, type Request, type Response } from 'express';
import cors from "cors";
import  pool  from "./db/pool.js";

const app: Express = express();
// middleware
app.use(express.json()); //parse incoming JSON request bodies
app.use(cors());   //allows for requests from React frontend

//GET method /todos
app.get("/todos", async (req: Request, res: Response) => { 
  try { //get all todos from the database starting from newest 
    const result = await pool.query("SELECT * FROM todos ORDER BY todo_id DESC");
    res.json(result.rows);
    //console.log(result.rows);
  } catch (error) {
    console.error("DATABASE ERROR:", error);
    res.status(500).send("Database error");
  }
});

//POST method /todos
//add a new todo item to the database
app.post("/todos", async (req: Request, res: Response) =>{
  try{ 
    const todo_item = req.body.todo_item;

    const result = await pool.query("INSERT INTO todos (todo_item) VALUES ($1)", [ todo_item]);
   
    res.status(201).json(result.rows[0]); //send new todo back to the frontend
  } catch(error){
      console.error("DATABASE ERROR:", error);
      res.status(500).send("Database error"); 
  }
});

//DELETE method /todos/:todo_id
//using todo_id, remove todo from database
app.delete("/todos/:todo_id", async (req:Request, res: Response)=>{
 try{ 
  const todo_id = req.params.todo_id;

  const result = await pool.query("DELETE FROM todos WHERE todo_id =$1", [todo_id]);

  if (result.rowCount === 0) {
    return res.status(400).send({
      result: "failure",
      message: "Todo could not be deleted", });
       }
       res.sendStatus(200);
  } catch(error){
      console.error("DATABASE ERROR:", error);
      res.status(500).send("Database error"); 
  }
});

//PATCH method /todos/:todo_id
//update the completed status of a todo
app.patch("/todos/:todo_id", async( req: Request, res: Response) =>{

  try{
    const todo_id= req.params.todo_id;
    const completed= req.body.completed;

    const result = await pool.query("UPDATE todos SET completed=$1 WHERE todo_id=$2",[completed, todo_id]);

    res.json(result.rows[0]);
  }
  catch(error){
    console.error("DATABASE ERROR:", error);
    res.status(500).send("Database error"); 
  }
});

app.listen(5000, (): void => {
  console.log("Server running on port 5000");
});