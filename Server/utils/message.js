import moment from 'moment'

/* array of messages related to each chatroom */
export const messages = {}
    /* roomName: [...{sender: message}] */


export function clearMessages(){
   for(const key in messages){
         delete messages[key]
    }
}


export function createMessage(user, msg){
    return {
        user: user,
        message: msg,
        /* time: moment().format('h:mm a') */
    }
}

export function getRoomMessages(roomName){
    if(!messages.hasOwnProperty(roomName)){
        console.log(`getRoomMessages: ${roomName} is not a member of 'messages' in back-end/messages.js`)
        return
    }
    return messages[roomName] // should be an array
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