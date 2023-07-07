# Chat App



## About

This project consists of two parts: One client written in React and one server written in nodejs using the frameworks expressjs and socket.io


## Built with
- React.js
- Node.js
- Socket.io
- Tailwind.css
- chai.js (testing framework)


## Getting Started
```bash
npm install 
```
```bash
./run.sh
```

## Description 
### API

The API is build with Node.js and uses the tools express.js and socket.io

express is used to run a web server while i use socket io to define socket communication methods.

behind the API is a simple data storage written in javascript.
#### Methods

The naming convention "___ callback" was developed due to two different styles of methods where one used a callback from the caller, and one did not. 
later most of the non-callback methods where depricated and removed.

- login
- create user
- create user callback
- create room callback
- join room callback
- open room callback
- send message callback
- leave room callback
- get rooms
- disconnect
### Data storage
- I use simple in memory data on the server. 
-   chatRooms and messages are stored in Key-value data-structures, e.i objects.
-   Users are stored in an array.
-   I made a few custom methods to insert, get, delete for each data storage. 

- Next time i build something similar i would want to use a typed language, because a lot of time was spend on debugging for correct types.
### Client
The client is built with React.js and create-react-app. 

#### Components
- App
- chat
    - Chat
    - Message
    - MessageBox
    - MessageInputForm
- login
    - Login
    - LoginForm
- roomList
    - Room
    - RoomList
- modal
    - Modal
- onlineList (Not yet implemented)

**App**

*Data from hooks*
- chatRooms
- user
- messages
- loggedIn
- openChatRoom 

This is the top layer of the application (appart from index.js that wraps my app in a reactDom renderer).

*functionality*
App contain UserContext and MessageContext, so that components throughout the application can access the context data.
App also holds a set of hooks that handles the server commnication. It sends the hook functions down to child components based on needs.

*View*
The app layout covers the whole browser view which is depend on if a user is logged in or not.
if a user is logged in the view is devided into 3 sections: RoomList, Chat, OnlineList
if a user is not logged in the view is: Login

**Chat**
The chat consists of the 4 components Chat, Message, MessageBox, MessageInputForm. 

the Chat component wraps the MessageBox and MessageInputForm. It provides message data from the MessageContext to the MessageBox and a sendMessage function to the MessageInputForm.

**RoomList**

*View*
- A Create Room button that can open a Modal component
- A list of all the chat rooms.

*Functionality*
The room lists handles Opening and cosing the Modal component and provides a function onCreateChatRoom to the Modal. onCreateChatRoom calls the createChatRoom hook with the current users username and an room name input from modal.

**OnlineList**

Not yet implemented

Just contains some basic html to cover up an area of the browser 

**Login**

Socket Events
- login
- create user

The login view is has an input field and a login button. The button fires the LogIn function provided by the parent component App.

The LoginFrom component handles 2 things: A user Login and a user Creation.

Both user login and user creation emits events on the client socket which are recived by the server socket. The events are "login" and "create user"

#### Hooks and server communication
I use socket.io client socket to communicate with my API.

- useChatRooms
- useJoinChatRoom
- useMessages
- useOpenChatRoom


**useChatRooms**
Handles creating new rooms and fetching existing rooms from the server.

*socket emits*
- create room callback
- get rooms

*client socket events*
- recieve room callback

**useJoinChatRoom**
Handles a user leaving and joining a room

*socket emits*
- join room callback
- leave room callback

**useMessages**
handles sending messages to the server and recieving broadcasted messages from the server.

*socket emits*
- send message callback

*client socket events*
- recieve message

**useOpenChatRoom**
handles fetching messages froma certain for a user. --- hook name misleading, should consider changing it to something like "useFetchRoomMessages".

*socket emits*
- open room callback 

