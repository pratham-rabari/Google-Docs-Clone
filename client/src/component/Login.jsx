/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useState } from 'react'
import '../style/Login.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Login = () => {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")

	const navigate = useNavigate()

	const login = async () => {
		try {
			const res = await axios.post("http://localhost:3000/login", {
				email, password, Credential: 'include'
			})
			localStorage.setItem("user", JSON.stringify(res.data))
			alert("Login Successfully")
			navigate("/")
		} catch (error) {
			console.log(error)
			return alert("Invalid details")
		}
	}

	const MoveToSignin = ()=>{
        navigate("/Signin")
	}

	return (
		<div className="login-page">
			<div className="form">
				<form className="register-form">
					<input type="text" placeholder="name" />
					<input type="password" placeholder="password" />
					<input type="text" placeholder="email address" />
					<button>create</button>
					<p className="message">Already registered? <a href="#">	Log In</a></p>
				</form>
				<div className="login-form">
					<input type="emial" placeholder="Email" onChange={(e) => { setEmail(e.target.value) }} />
					<input type="password" placeholder="password" onChange={(e) => { setPassword(e.target.value) }} />
					<button onClick={login}>login</button>
					<p className="message">Not registered? <a href="#" onClick={MoveToSignin}>Create an account</a></p>
				</div>
			</div>
		</div>
	)
}

export default Login
