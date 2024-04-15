import React, { useEffect, useState } from 'react'
import '../style/Home.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import pdfToText from 'react-pdftotext'

const Home = () => {
	const [docs, setDocs] = useState([])
	const navigate = useNavigate()
	const [show, setShow] = useState(false)
	const [docName, setDocName] = useState('')
	const [id, setId] = useState("")
	const [text, setText] = useState("")


	const open = () => {
		navigate("/docs")
	}

	const logout = () => {
		localStorage.removeItem("user")
		alert("You are Logged Out")
		location.reload()
	}

	const docuser = JSON.parse(localStorage.getItem("user"))

	useEffect(() => {
		if (!docuser) {
			navigate("/Login")
		}
	}, [])

	useEffect(() => {
		const fetch = async () => {
			const id = docuser._id
			const res = await axios.get(`http://localhost:3000/getdocument/${docuser._id}`)
			console.log(res.data,"doc")
			setDocs(res.data)
		}
		fetch()
	}, [])

	const OpenDoc = (id) => {
		navigate(`/docs/${id}`)
	}

	const deleteDoc = async (id) => {
		const res = await axios.put(`http://localhost:3000/deletedocument/${id}`, { userId: docuser._id })
		console.log("res", res)
		if (res.status == 200) {
			alert("Deleted Succesfully")
			location.reload();
		}
	}

	const showdoc = (id, name) => {
		setId(id)
		setDocName(name)
		setShow(true)
	}

	const updatename = async () => {
		const res = await axios.post(`http://localhost:3000/updatename/${id}`, { docName })
		setShow(false)
		location.reload()
	}

	return (
		<div>
			<nav className="navbar bg-body-tertiary">
				<div className="">
					<a className="navbar-brand mx-4 d-flex" href="#">
						<img src="https://www.gstatic.com/images/branding/product/1x/docs_2020q4_48dp.png" alt="Bootstrap" width="42" height="44" />
						<h3 className='mx-2'><u>Docs</u></h3>
					</a>
				</div>
				<div className='mx-3'>
					<button className='btn btn-info mx-2' onClick={logout}>LogOut</button>
				</div>
			</nav>
			<div className='doc-div'>
				<div className='img-div container my-5'>
					<img src="https://ssl.gstatic.com/docs/templates/thumbnails/docs-blank-googlecolors.png" width="160" height="200" className='img mx-2' onClick={open} />
					<h6 className='mx-4 my-1'>Blank Document</h6>
				</div>
			</div>
			<h3 className='mx-2 my-1'>Recent Documents</h3>
			{show ? <div className='inputbox'>
				<div className='child-div my-5'>
					<input onChange={(e) => { setDocName(e.target.value) }} value={docName} className='inputx' />
					<button onClick={updatename} className='btn btn-info my-4'>Edit</button>
					<button className='btn btn-danger my-4 mx-2' onClick={() => { setShow(false) }}>Cancle</button>
				</div>
			</div> : ""}
			<div className='recent-doc container my-4 d-flex md-3'>
				<div className='row'>
				{
					docs?.map((doc) => {
						return <div className="card mx-3 col-md-3 col-sm-6 my-3" style={{ width: "13rem", height: "18rem", border: "2px solid black", cursor: "pointer" }} key={doc._id}>
							<img src="https://tse3.mm.bing.net/th?id=OIP.EomlzFBQM61jPsIY5xJZsQHaHa&pid=Api&P=0&h=190" className="card-img-top" alt="..." height="230px" onClick={() => OpenDoc(doc._id)} /><hr />
							<div className='d-flex justify-content-between'>
								<p className="mx-2">{doc.name ? doc.name : "Untitled"}</p>
								<span className='spanimg'><img src="https://cdn-icons-png.flaticon.com/128/1828/1828911.png" className='btnx mx-2' onClick={() => showdoc(doc._id, doc.name)} />
									<img src='https://cdn-icons-png.flaticon.com/128/1214/1214428.png' className='imgb' onClick={() => deleteDoc(doc._id)} /></span>
							</div>
						</div>
					})
				}
				</div>
			</div>
		</div>
	)
}

export default Home
