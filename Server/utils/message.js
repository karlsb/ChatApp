
/* array of messages related to each chatroom */
export const messages = {}


export function clearMessages(){
   for(const key in messages){
         delete messages[key]
    }
}

export function createMessage(user, msg){
    return {
        user: user,
        message: msg,
    }
}

export function getRoomMessages(roomName){
    if(!messages.hasOwnProperty(roomName)){
        console.log(`getRoomMessages: ${roomName} is not a member of 'messages' in back-end/messages.js`)
        return
    }
    return messages[roomName] 
}

export function addRoomInMessages(roomName){
    messages[roomName] = []
}

export function addMessages(roomName, msg){
    if(!messages.hasOwnProperty(roomName)){
        console.log(`addMessages: ${roomName} is not a member of 'messages' in back-end/messages.js`)
        return
    }
    messages[roomName].push(msg)
}