const express = require("express")
const cors = require("cors")
const { createServer } = require('node:http');
const { Socket } = require('node:dgram');
const { Server } = require("socket.io");
const { connect } = require("./db");
const DocumentModel = require("./schema/Document-Schema")
const { getDocument, updateDocument, DocumentForUser, DocumentName, GetName, deleteDocument } = require("./controllers/document-controller")
const bodyParser = require("body-parser")
const expressSession = require("express-session")
const { login, register } = require("./controllers/user-controller")

const app = express()
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    }
});

app.use(cors())
app.use(express.json())
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
    res.send("hello")
})

connect()

io.on("connection", (socket) => {
    try {
        socket.on("get-document", async ({ id, userId }) => {
            console.log("id", id)
            console.log("uid", userId)
            const documentId = id;
            const document = await getDocument(documentId, userId)

            socket.join(documentId)
            if (document) {
                socket.emit("load-document", document.data)
            }

            socket.on("send-change", delta => {
                socket.broadcast.to(documentId).emit("recieve-change", delta)
            })

            socket.on("save-change", data => {
                updateDocument(documentId, data)
            })
        })
    } catch (error) {
        console.log(error)
    }
})

app.post("/register", register)
app.post("/login", login)
app.get("/getdocument/:id", DocumentForUser)
app.post("/updatename/:id", DocumentName)
app.get("/getname/:id", GetName)
app.put("/deletedocument/:id", deleteDocument)

server.listen("3000", () => {
    console.log("server running on 3000")
})
