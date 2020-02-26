const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io').listen(server)

const port = 3000
const MongoClient = require("mongodb").MongoClient

const uri = "mongodb://localhost:27017/myDB"

const client = new MongoClient(uri, { useUnifiedTopology: true })

io.on("connection", socket => {
    console.log("This message means that you connected to the server!")
    socket.on("any message", messageReceived => {
        console.log(messageReceived)
        io.emit("any message", messageReceived)
    })
})

io.on('connection', (socket) => {
    client.connect().then(db => {
        const changeStream = client.db("myDB").collection("myCollection").watch()
        changeStream.on("change", next => {
            socket.emit('message', { message: "Data inserted in collection", data: next.fullDocument })
            console.log("Data inserted in collection")
        })
    })
})

server.listen(port, () => console.log('Server listening on *:3000'))
