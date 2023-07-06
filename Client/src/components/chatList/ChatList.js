import { useState } from "react";

import Modal from '../modal/Modal'
import { ChatRoom }  from './ChatRoom'
import '../../index.css'
/*  where do we store all the chatrooms?  
    - every chatroom displayed must be chatrooms that the user has joined. so we need a list of chatrooms that belongs to a user.
    - where in the app do we need this data? 
*/

export default function ChatList({openRoom, user, chatRooms, createChatRoom}) {
  const [show, setShow] = useState(false)

  function openCreateRoomModal(){
    console.log('open create room modal')
    setShow(true)
  }

  function onCreateChatRoom(userInput){
    if(userInput === ''){
      return
    }
    createChatRoom({username:user.username, roomName:userInput})
  }

  return (
    <div className="bg-gray-50 h-screen w-80">
      <h1 className="pt-5 pl-5 text-3xl pb-5 font-bold leading-tight tracking-tight">Chat Rooms</h1>  
          <div className="flex space-x-3 bg-gray-50 h-20 justify-start">
              <button className="h-10 ml-5 p-2 rounded-lg font-medium text-sm bg-blue-800 text-white">Search room</button>{/* TODO:: add a openSearchRoomModal */}
              <button className="h-10 p-2 rounded-lg font-medium text-sm bg-blue-800 text-white" onClick={openCreateRoomModal}>Create Room</button>
              <Modal show={show} setShow={setShow} onCreateChatRoom={onCreateChatRoom}></Modal>
          </div>
      <div>
        <h2 className="font-bold text-lg pb-2 border-b-2 ml-2">My Rooms</h2>
        {chatRooms.map((roomName, index) => <ChatRoom key={index} roomName={roomName} openRoom ={openRoom} username={user.username}></ChatRoom>)}
      </div>
    </div>
  )
}
