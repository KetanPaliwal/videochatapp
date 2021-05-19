
const { ExpressPeerServer } = require('peer');

const express = require("express");
const peerapp = express();

const peerserver = require("http").createServer(peerapp);

const peerServer = ExpressPeerServer(peerserver,{ debug:true, path: '/',secure: true });
app.use("/",peerServer);

peerserver.listen(9000,()=>{
	console.log(`Peer Server Running on port 9000...`);
})

const app = express();

const server = require("http").createServer(app);

const io = require("socket.io")(server,{cors: {origin: "*"}});

app.get("/",(req,res)=>{
	res.sendFile(__dirname+"/mainpage.html");
})

var online=0;

io.on("connection",(socket)=>{
	console.log(`Connected to client with socketId: ${socket.id}.`);
	online++;

	socket.emit("connected",{online,message: "Connected successfully to server."});

	socket.on("connected",(peerid)=>{
		socket.broadcast.emit("peerconnected",{online,peerid});

		socket.on("disconnect",()=>{
			console.log(`Disconnected socketId: ${socket.id}.`);
			online--;
			socket.broadcast.emit("peerdisconnected",{online,peerid});
		})
	})

	socket.on("message",({peerid,message})=>{
		let today = new Date();
		io.emit("message",{peerid,message,time: `${today.getHours()}:${today.getMinutes()}`})
	})

})

port = process.env.PORT || 3000;

server.listen(port,()=>{
	console.log(`Listening on port ${port}.`);
})
