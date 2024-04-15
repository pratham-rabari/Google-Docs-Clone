/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useState } from 'react'
import '../style/Login.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


const Sign = () => {

	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [username, setUsername] = useState("")

	const navigate = useNavigate()

	const Sign = async () => {
		  try {
			const res = await axios.post("http://localhost:3000/register", {
				username,email, password
			})
			navigate("/Login")
		} catch (error) {
			console.log(error)
		}
	}

	const MoveToLogin = ()=>{
        navigate("/Login")
	}

	return (
		<div className="login-page">
			<div className="form">
				<form className="register-form">
					<input type="text" placeholder="name" />
					<input type="password" placeholder="password" />
					<input type="text" placeholder="email address" />
					<button>create</button>
					<p className="message">Already registered? <a href="#">Sign In</a></p>
				</form>
				<div className="login-form">
					<input type="text" placeholder="username" onChange={(e) => { setUsername(e.target.value) }} />
					<input type="Email" placeholder="Email" onChange={(e) => { setEmail(e.target.value) }} />
					<input type="password" placeholder="password" onChange={(e) => { setPassword(e.target.value) }} />
					<button onClick={Sign}>Sign In</button>
					<p className="message">Alredy registered? <a href="#" onClick={MoveToLogin}>Login</a></p>
				</div>
			</div>
		</div>
	)
}

export default Sign
