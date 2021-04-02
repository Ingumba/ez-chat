const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");
const bodyparser = require("body-parser");
const { ESRCH } = require("constants");

const users = [{ name: "user1", status: "offline", id: "" }, { name: "user2", status: "offline", id: "" }, { name: "user3", status: "offline", id: "" }];

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + '/public/html/index.html'));
})

app.post("/login", (req, res) => {
    console.log(req.body)
    const { username, socketID } = req.body;
    for (let item of users) {
        if (item.name == username) {
            if (item.status == "online") {
                res.json({ status: "failed" });
                break;
            }
            else {
                item.id = `${socketID}`
                item.status = "online";
                // socket.broadcast.to(user.socketID).emit(())
                res.json({ status: "success" });
            }

        }
    }
    //take in the body data, join room with socket id , update users array and return something to redirect
    // chat page


})

app.post("/send", (req, res) => {
    console.log("params", req.params);
    console.log("body", req.body);
    const { text } = req.body;

})

server.listen(3000, () => {
    console.log("Server started on port 3000");
})

io.on('connection', (socket) => {
    console.log(socket.id);

    // socket.join(`${socket.id}`);

    socket.on('text', (data) => {
        let recieverID = "";
        for (let i of users) {
            if (i.name == data.reciever && i.id != "") {
                recieverID = i.id;
            }
        }
        console.log(`${data.msg} TO ${data.reciever} FROM ${data.sender}`);
        if (recieverID != "") {
            socket.broadcast.to(`${recieverID}`).emit(
                'incoming_text',
                { 'sender': `${data.sender}`, 'msg': `${data.msg}` }
            )
        }
    })
})

