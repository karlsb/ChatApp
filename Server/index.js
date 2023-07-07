//external

import express from 'express'
import http from 'http'
import { Server } from "socket.io"
//utils
import {createMessage, getRoomMessages, addMessages} from './utils/message.js'
import {leaveChatRoom, getRoom, createChatRoom, getChatRooms, joinChatRoom} from './utils/chatRooms.js'
import { addUser, userExists, getUserRooms, findUser} from './utils/users.js';


const app = express()
export const server = http.createServer(app);
const io = new Server(server,{
    cors: {
        origin: "http://localhost:3000"
      }
});

io.on('connection', (socket) => {

    /* should connect a socket to all the users room. when a user logs in. */
    socket.on('login', (username, onComplete) => {
        if(userExists(username)){
            socket.join(username)
            for(const room in getUserRooms(username)){
                socket.join(room)
            }
            const user = findUser(username)
            console.log('user logged in: ', user)
            onComplete(user)
        }
        else{
            onComplete("user does not exist")
        }
    }) 

    socket.on('create user', (username, onComplete) => {
        if(userExists(username)){
            console.log('user already exists')
            onComplete("user already exists")
            return
        }
        let user = addUser(socket.id, username)
        for(const room in getUserRooms(username)){
            socket.join(room)
        }
        console.log('created user: ', user)
        onComplete(user)
    })

    /*------------------- 

        CALLBACK API
    
    --------------------*/

    socket.on('create user callback', (username, onComplete) => {
        if(addUser(socket.id, username)){
            onComplete(findUser(username))
        }
        else{
            onComplete("user already exists")
        }
    })

    socket.on('create room callback', ({username,roomName}, onComplete) => {
        if(createChatRoom(roomName, username)){
            socket.join(roomName)
            socket.broadcast.emit('get new room', roomName) // to all other clients.
            console.log(getRoom(roomName))
            console.log(findUser(username))
            onComplete(getRoom(roomName))
        }
        else{
            onComplete(`room: ${roomName} already exists`)
        }
    })

    socket.on('join room callback', ({username, roomName}, onComplete) => {
        const joinResponse = joinChatRoom(username, roomName)
        if(joinResponse.success){
            socket.join(roomName)
            socket.to(roomName).emit('get new user in room', username)
            onComplete(getRoom(roomName))
        }
        else{
            onComplete(joinResponse.message)
        }
    })

    socket.on('open room callback', (roomName, onComplete) => {
        const data = getRoomMessages(roomName)
        onComplete(data)
    })



    socket.on('send message callback', ({username, roomName, message}, onComplete) => {
        const msg = createMessage(username, message)
        console.log(msg)
        addMessages(roomName, msg)
        socket.to(roomName).emit('recieve message' , msg)
        onComplete(msg)
    })


    socket.on('leave room callback' , ({username, roomName}, onComplete) => {
        const leaveRoomRes = leaveChatRoom(username, roomName)
        if(leaveRoomRes.success){
            socket.leave(roomName)
            socket.to(roomName).emit('get user left room', {username, roomName})   
        }
        onComplete(leaveRoomRes.message)
    })

    socket.on('get rooms', onComplete => {
        const rooms = getChatRooms()
        const format = Object.keys(rooms).map(room => {
            return room
        })
        onComplete(format)
    })

    //listening for disconnect of a client.
    socket.on('disconnect', (reason) => {
        // users = users.filter(u => u.id !==socket.id)
        // io.emit("new user", users)
        //console.log(`socket: ${socket.id} disconnect with reason: ${reason}`)
    })
});

server.listen(4000, () => {
    console.log('listening on *:4000');
});
 
