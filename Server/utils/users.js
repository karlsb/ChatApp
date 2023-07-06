

/* 
    this acts as a simplified database
    should implement with a real db at some point.

    if we want to use SQL we could have the data fields:
    uid, username, roomId

    which we could then normalize to:
   
    key =  uid
    uid username
   
    key = id // since a user can belong to many rooms.
    id, uid, roomId

    we let roomId be a string for now so that we cannot have duplicate room names.
    
*/


/*  id:socket.id, username:kalle ,roomId:chat-room-id */
export const users = [

]


export function clearUsers(){
  users.length = 0

}

// here we link a socket id to a username and maybe rooms array 
//TODO: change code that breaks because of change in return value
export function addUser(id, username){
  if(!userExists(username)){
    const user = {id, username, rooms: []}
    users.push(user)
    return user
  }
  else{
    return null
  }
}

export function addRoomInUsers(username, roomName){
  const user = users.find(user => user.username === username)
  if(user){
    user.rooms.push(roomName)
  }
}

export function findUser(username){
  return users.find(user => user.username === username)
}

export function getUserById(id){
    return users.find(user => user.id === id) 
}

export function removeUser(id) {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

export function userExists(username){
  const user = users.filter(user => user.username === username)
  if(user.length === 0){
    return false
  }
  return true
}

export function getRoomUsers(room) {
  return users.filter(user => user.room === room);
}


export function getUserRooms(username){
  const user = users.find(user => user.username === username)
  if(user){
    return user.rooms
  }
  else{
    return []
  }
}
export function removeRoomInUser(username, roomName){
  const user = users.find(user => user.username === username)
  if(user){
    const index = user.rooms.indexOf(roomName)
    if(index > -1){
      user.rooms.splice(index, 1)
    }
  }
}