/* Server communication to handle a client joining and leaving a chatroom */

import {socket} from '../utils/socket'

export const useJoinChatRoom = (userName) => {
    const username = userName

    function joinRoom(roomName){
        return () => {
            console.log('join room: ',roomName,' ',username)
            socket.emit('join room callback', {username:username, roomName:roomName},(res) => {
                console.log('joined room', res)
            })
    
        }
    }
    
    function leaveRoom(roomName){
        return () => {
        socket.emit('leave room callback', 
                {username:username, roomName:roomName}, 
                (res) => {console.log(res)})
        }
    }
    return [joinRoom, leaveRoom]
}