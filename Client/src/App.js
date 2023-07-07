import Chat from "./components/chat/Chat.js"
import RoomList from "./components/roomList/RoomList.js";
import OnlineList from "./components/onlineList/OnlineList.js";
import Login from "./components/login/Login.js"; 
import './index.css'
import { useState, createContext, useEffect} from 'react'
import { useMessages } from "./hooks/useMessages.js";
import { useChatRooms } from "./hooks/useChatRooms.js";
import { useOpenChatRoom } from "./hooks/useOpenChatRoom.js";


//store information about the logged in user.

// TODO: maybe move this to some other file.
export const UserContext = createContext()
export const MessageContext = createContext()

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [user, setUser] = useState({})
  const [messages, sendMessage, setMessages] = useMessages()
  const [chatRooms, createChatRoom, getAllChatRooms] = useChatRooms()
  const [openChatRoom, openRoom] = useOpenChatRoom(setMessages)

  /* maybe this can be done cleaner? */
  /* TODO: set some flags for logging, i dont want it in production. */
  function LogIn(newUser){
    setLoggedIn(true)
    setUser(newUser)
    console.log("chatRooms: ", chatRooms)
    console.log("newUser: ",newUser)
    console.log("User: ",user)
  }

  useEffect(() => {
    if(!loggedIn){
      return
    }
    
    createChatRoom({username:user.username, roomName:user.username})
    getAllChatRooms()

  }, [user])


  return (
    <UserContext.Provider value={user}>
      {loggedIn ? 
        <div className="flex w-full">
          <RoomList openRoom={openRoom} user={user} chatRooms={chatRooms} createChatRoom={createChatRoom}></RoomList>
            {openChatRoom !== '' ?
              <MessageContext.Provider value={messages}>
                <Chat chatName={openChatRoom} sendMessage={sendMessage}>                              
                </Chat> 
              </MessageContext.Provider>
                : 
              <div className="bg-white flex-auto"></div>
            }
          {/* TODO: OnlineList doesn't do anything yet. */}
          <OnlineList></OnlineList>
        </div>
        : 
        <Login LogIn={LogIn} setUser={setUser}></Login>
      }
    </UserContext.Provider>
  );
}

export default App;
