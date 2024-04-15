import Editor from "./component/Editor"
import {BrowserRouter,Routes,Route,Navigate} from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import Home from "./component/Home";
import { useState } from "react";
import Login from "./component/Login";
import Signin from "./component/Signin";

function App() {
const[show,setShow]=useState(false)
  return (
    <>
    <BrowserRouter>
    <Routes>
     <Route path="/docs" element={<Navigate replace to={`/docs/${uuidv4()}`}/>}/>
      <Route path="/docs/:id" element={<Editor/>}/>
      <Route path="/" element={<Home/>}/>
      <Route path="/Signin" element={<Signin/>}/>
      <Route path="/Login" element={<Login/>}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
