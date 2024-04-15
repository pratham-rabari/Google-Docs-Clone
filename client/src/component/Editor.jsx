import React, { useEffect, useState } from 'react'
import Quill from 'quill';
import "quill/dist/quill.snow.css";
import '../style/Edit.css'
import { io } from 'socket.io-client'
import { useParams } from 'react-router-dom';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import ImageResize from 'quill-image-resize-module-react';

Quill.register('modules/imageResize', ImageResize);


const Editor = () => {
  const [quill, setQuill] = useState()
  const [socket, setSocket] = useState(null)
  const [userId, setUserId] = useState("")
  const [show, setShow] = useState(false)
  const navigate = useNavigate()
  const[showBtn,setShowBtn]=useState(false)

  const { id } = useParams();

  const docuser = JSON.parse(localStorage.getItem("user"))
  const [docName, setDocName] = useState('')

  const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    ['link', 'image', 'video', 'formula'],

    [{ 'header': 1 }, { 'header': 2 }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],
    [{ 'indent': '-1' }, { 'indent': '+1' }],
    [{ 'direction': 'rtl' }],

    [{ 'size': ['small', false, 'large', 'huge'] }],
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],
    [{ 'font': [] }],
    [{ 'align': [] }],

    ['clean']
  ];

  useEffect(() => {
    const quillserver = new Quill('#editor', {
      modules: {
        toolbar: toolbarOptions,
        imageResize: {
          parchment: Quill.import('parchment')
        }
      },
      theme: 'snow'
    });
    quillserver.disable()
    setQuill(quillserver)
    setUserId(docuser?._id)
  }, [])

  useEffect(() => {
    const nsocket = io("http://localhost:3000/")
    setSocket(nsocket)
  }, [])

  useEffect(() => {
    if (socket === null || quill === null) return;

    const handlechange = (delta, oldDelta, source) => {
      if (source !== 'user') return;

      socket?.emit("send-change", delta)
    };

    quill.on('text-change', handlechange)

    return () => {
      quill.off('text-change', handlechange)
    }
  }, [quill, socket])

  useEffect(() => {
    if (socket === null || quill === null) return;

    const handlechange = (delta) => {
      quill.updateContents(delta)
    };

    socket?.on('recieve-change', handlechange)

    return () => {
      socket?.off('recieve-change', handlechange)
    }
  }, [quill, socket])

  useEffect(() => {
    if (socket === null || quill === null) return;

    socket?.once("load-document", (data) => {
      quill?.setContents(data)
      quill?.enable()
    })
    setUserId(docuser.id)
    console.log("2", userId)
    socket?.emit("get-document", { id, userId })
  }, [quill, socket, id])

  useEffect(() => {
    if (socket === null || quill === null) return;

    const interval = setInterval(() => {
      socket?.emit("save-change", quill.getContents())
    }, 2000)

    return () => {
      clearInterval(interval)
    }
  }, [socket, quill])

  useEffect(() => {
    if (!docuser) {
      navigate("/Login")
    }
  }, [id])

  const handleImageClick = () => {
    const fileInput = document.getElementById('file-input');
    if (fileInput) {
      fileInput.click();
    }
  };

  useEffect(() => {
    if (quill) {
      quill?.on('selection-change', (range, oldRange, source) => {
        setShowBtn(true)
      });
    }
  }, [quill]);


  const handleImageInsertion = (event) => {
    if (quill) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const range = quill.getSelection();
        const value = e.target.result;
        if (range) { 
          quill.insertEmbed(range.index || 0, 'image', value);
        } else {
          quill.insertEmbed(0, 'image', value);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const getImageIndex = () => {
    if (quill) {
      const range = quill.getSelection(); 
      if (range) {
        return range;
      }
    }
    return -1; 
  };
  
  
  const removeImageByIndex = () => {
    if (quill) {
      const index = getImageIndex()
      if(index === -1)
      {
        alert("please select the image")
      }
      quill.deleteText(index, 1);
    }
  };
  
  return (
    <div>
      <input
        id="file-input"
        type="file"
        onChange={handleImageInsertion}
      style={{ display: 'none' }}
      />
      {/* <button onClick={removeImageByIndex} className='btn btn-danger ql-formats'>delete Image</button> */}
      <div id='editor'>
      </div>
    </div>
  )
}

export default Editor
