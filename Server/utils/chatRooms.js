import { getUserById, addRoomInUsers, userExists, removeRoomInUser } from "./users.js"
import { addRoomInMessages, messages } from "./message.js"
import { VERBOSE } from "../config.js"


/* an interesting bug is that if we add a room that is
    the name of some _prototype_ then we will get weird behavior.    
*/
export const chatRooms = {
    
}

export function clearChatRooms(){
    for(const key in chatRooms){
        delete chatRooms[key]
    }
}

export function isChatRoomsEmpty(){
    const val = Object.keys(chatRooms).length === 0
    return val
}

export function getRoom(roomName){
    return chatRooms[roomName]
}

export function getChatRooms(){
    return chatRooms
}

export function chatRoomExist(roomName){
    return chatRooms.hasOwnProperty(roomName)
} 

export function createChatRoom(roomName, ownerId){
    if(!userExists(ownerId)){
        console.log(`createChatRoom: ${ownerId} is not a user in 'users' in back-end/users.js`)
        return false
    }
    if(!chatRooms.hasOwnProperty(roomName)){
        chatRooms[roomName] = {ownerId: ownerId, users: [ownerId]}
        messages[roomName] = []
        addRoomInUsers(ownerId, roomName)
        addRoomInMessages(roomName)
        return true
    }
    else{
        if(VERBOSE){
            console.log(`${getUserById(ownerId)} tried to creat a room but the room ${roomName} already exist.`)
        }
        return false
    }
}

// returns true or false
export function userIsInRoom(username, roomName){
  if(chatRooms[roomName] === undefined){
    return false
  }
  return chatRooms[roomName].users.includes(username)
}


// the user is in the room.
export function userJoinRoom(username, roomName){
    if(!userExists(username)){
        console.log(`createChatRoom: ${username} is not a user in 'users' in back-end/users.js`)
        return false
    }
    if(!userIsInRoom(username, roomName)){
        chatRooms[roomName].users.push(username)
    }
    else{
        console.log(`${getUserById(userId)} tried to join the room ${roomName}, but is already a member.`)
    }
}


export function joinChatRoom(username,roomName){
    if(!userExists(username)){
        return {success:false, code:'UNE', message:'user does not exist'}
    }
    if(!chatRoomExist(roomName)){
        return {success:false, code:'RNE', message:'room does not exist'}
    }
    if(userIsInRoom(username, roomName)){
        return {success:false, code:'UIR', message:'user is already in room'}
    }
    else{
        userJoinRoom(username, roomName)
        addRoomInUsers(username, roomName)
        return {success:true, code:'S', message:'user joined room'}
    }
}

function removeUserInRoom(username, roomName){
    const index = chatRooms[roomName].users.indexOf(username)
    if(index > -1){
        chatRooms[roomName].users.splice(index, 1)
    }
}

export function leaveChatRoom(username, roomName){
    if(!userExists(username)){
        return {success:false, code:'UNE', message:'user does not exist'}
    }
    if(!chatRoomExist(roomName)){
        return {success:false, code:'RNE', message:'room does not exist'}
    }
    if(!userIsInRoom(username, roomName)){
        return {success:false, code:'UIR', message:'user is not in room'}
    }
    else{
        removeUserInRoom(username, roomName)
        removeRoomInUser(username, roomName)
        return {success:true, code:'S', message: `${username} left the room ${roomName}`}
    }
}