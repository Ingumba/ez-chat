const loginPage = document.querySelector(".login");
const textPage = document.querySelector(".text_send");
const loginUsername = document.querySelector(".login_username");
const loginButton = document.querySelector(".login_button");
const textButton = document.querySelector(".send_button");
const msg = document.querySelector(".msg");
const textUsername = document.querySelector(".text_username");
let userDetails;

const socket = io();
console.log(`socket id : ${socket.id}`);

socket.on('connect', () => {
    console.log(`connected with id: ${socket.id}`);
})

socket.on('disconnect', () => {
    console.log(`disconnected`);
})

socket.on('wlcm', (msg) => {
    console.log(msg);
})

async function login() {
    const res = await fetch("http://localhost:3000/login", {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'get': 'watchlist'
        },
        body: JSON.stringify({
            'username': `${loginUsername.value}`,
            'socketID': `${socket.id}`
        })
    })
    const result = await res.json();
    userDetails = await result;
    console.log(await result);
    if (await result.status == "success") {
        userDetails = { 'name': `${loginUsername.value}` }
        loginPage.style.display = "none";
        textPage.style.display = "block";
    }
}

async function send() {
    console.log(await userDetails);
    socket.emit("text", { reciever: `${textUsername.value}`, sender: `${await userDetails.name}`, msg: `${msg.value}` });
}

socket.on('incoming_text', (data) => {
    console.log(data);
})