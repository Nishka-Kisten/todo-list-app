import React,{useState } from "react";
import axios from 'axios';

interface Todo {
  "todo_id": number; "todo_item": string; "completed": boolean } //structure of todo called from API
   
interface AddTodoProps { //props needed in AddTodo component interface
  //function thats passed from parent component
  //used to add the new todo to the list
  onAddTodo: (todo: Todo) => void;
}

const AddTodo = ({ onAddTodo }: AddTodoProps) => {
const [addNew, setAddNew] = useState(""); //stores the value entered by the user

const handleSubmit = async () => {
  const todo_item = {  //create request body to send to backend
    todo_item : addNew
 }
  const result = await axios.post(  //send POST request to create a new todo
    'http://localhost:5000/todos', todo_item);

  onAddTodo(result.data); //updates the parent component with the new todo
};

return (
  <form onSubmit={handleSubmit} className="addForm">
      <input className="addTodo"  onChange= {(e) => {setAddNew(e.target.value)}} placeholder = "Enter a new task"></input>
      <button className="addButton" type="submit" disabled={!addNew.trim()}>Add</button>
  </form>


)}

export default AddTodo;

