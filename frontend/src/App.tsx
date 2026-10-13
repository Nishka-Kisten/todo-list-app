import React,{useState, useEffect} from "react";
import axios from 'axios';
import './App.css'
import AddTodo from "./AddTodo.tsx";
import trashIcon from "./assets/trashIcon.png";
import checklist from "./assets/checklist.png";

interface Todo { //structure of todo called from API
   "todo_id": number; 
   "todo_item": string;
   "completed": boolean } 

function App() {
  const [todoData, setTodoData] = useState<Todo[]>([]);  //stores all todos shown on screen

  useEffect(()=> { //when first rendered, fetches data from backend
    axios.get('http://localhost:5000/todos').then(res => {
        setTodoData(res.data)
      })
  }, []);

  //handles the completion status of todo
  const handleComplete = async (todo_id: number, completed:boolean) => {
    await axios.patch(   //updates database with current status of completion
      `http://localhost:5000/todos/${todo_id}`, { completed });

    setTodoData((prev)=>  //updates state so the user sees change on click
    //new array is created and only the todo with the same id is updated
      prev.map(todo => todo.todo_id === todo_id ? { ...todo, completed }  
      : todo)
    );
  }

  const handleAddTodo = (todo: Todo) => {
    setTodoData((prev) =>  [todo, ...prev]); //adds new todo to the top of the list
  };

  const handleDelete = async (todo_id: number)=>{ //deletes todo from the database and screen
    await axios.delete(
    `http://localhost:5000/todos/${todo_id}`);

    setTodoData((prev) =>  //removes deleted todo from state
    prev.filter(todo => todo.todo_id !== todo_id)); //a new array without the deleted todo
  }

  return (
    <>
      <section id="center">
        <div>
           <h1><img src={checklist}></img> To-Do List</h1>
           <AddTodo  onAddTodo={handleAddTodo}></AddTodo>
        </div>

         {/* display all current todo items */}
        <div className="list">
          <ul>
          {todoData.map((item: Todo) => ( 
    
            <li key={item.todo_id}>
              <label>
               <input type = "checkbox" value={item.todo_id}  checked = {item.completed} onChange={(e)=>handleComplete(item.todo_id, e.target.checked)}>
               </input> {item.todo_item} </label> 
              <button className="deleteBtn" onClick={() =>handleDelete(item.todo_id)}>
                <img src={trashIcon}></img>
              </button>
           </li>
          
          ))}
          </ul>
        </div>
      </section>
    </>
  )
}

export default App
