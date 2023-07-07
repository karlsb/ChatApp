

/* Server communication for creating new and recieve existing chatrooms */

import { useEffect, useState } from "react";
import { socket } from "../utils/socket";

export const useChatRooms = () => {
    const [chatRooms, setChatRooms] = useState([])

    function createChatRoom(chatRoom){
        if(socket){
            if(chatRoom.roomName === ''){
                chatRoom.roomName = 'default'
            }
            socket.emit('create room callback', chatRoom, (res) => {
                console.log('createChatRooms: ', res)
                if(res === `room: ${chatRoom.roomName} already exists`){
                    return
                }
                setChatRooms(prevChatRooms => [...prevChatRooms, chatRoom.roomName])
            })
        }
    }
    
    function getAllChatRooms(){
        if(socket){
            socket.emit('get rooms', (rooms) => {
                console.log('getAllChatRooms: ',rooms)
                setChatRooms(rooms)
            })
        }
    }

    useEffect(() => {
        socket.on('recieve room callback', (room) => {
            console.log('recieveRoom: ', room)
            setChatRooms(prevChatRooms => [...prevChatRooms, room])
        })
        return(() => {
            socket.off('recieve room callback')
        })
    },[chatRooms])//TODO im worried about this dependency

    return [chatRooms, createChatRoom, getAllChatRooms]
}