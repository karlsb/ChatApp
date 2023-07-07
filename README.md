# Chat App
A small web based chat application built with javascript


# About

This project consists of two parts: One client written in React and one server written in nodejs using the frameworks expressjs and socket.io

# Built with

- [React](https://react.dev/)
- [Node.js](https://nodejs.org/en)
- [Express.js](https://expressjs.com/)
- [Socket.io](https://socket.io/)
- [Tailwind.css](https://tailwindcss.com/)
- [chai.js](https://www.chaijs.com/)

# Getting Started

Use a linux computer
Install Node.js v18.16.0+ installed.
Clone the repo with your prefered method.

```bash
npm install 
```
after npm install you might get warnings from npm audit
run:
```bash
npm audit fix
```
You may still see warnings, but it should be possible to run the app in on localhost.
if you ran npm audit fix --force you might have broken some dependencies, so the app might not run.

to see if the weaknesses are only in devDependencies run:
```bash
npm audit -production
```
configure the file run.sh to contain the correct path to the project (see instructions in run.sh)

Start the app by executing run.sh (you may have to use chmod +x on the run.sh file):
```bash
./run.sh
```

# Description Of The Application

## API

The API is build with Node.js and uses the tools express.js and socket.io

Express is used as a web server and socket.io to provide socket communication through the express server.
all communication betweem client and server in the application is done through a socket connection.

Behind the API is a simple custom in memory data storage written in javascript.

### Socket Events

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

*The naming convention "___ callback" was developed due to two different styles of methods where one used a callback from the caller, and one did not. 
later most of the non-callback methods where depricated and removed.*

### Data storage

A simple in memory data on the server. 

*data models*

although the data is not technically typed, i have written it with the
following typing in mind.

chatRooms - ```{ roomName: { owner, members }} : { string: { string, []string }}```
 
users - ```[{ id, username, rooms }] : []{ string, string, []string }```

messages - ```{ roomName: [] } : { string: []string }```

- Methods to insert, get, delete exists for each data model. 

## Client

The client is built with React.js and create-react-app. Below is a description for eact component and all hooks used for client server communication.

I primarily uses custom hooks to handle socket communication with a few exceptions.

### Components
- **[App](#App)**

- **[chat](#Chat)**
    - MessageBox
        - Message
    - MessageInputForm
    
- **[login](#Login)**
    - Login
    - LoginForm

- **[roomList](#RoomList)**
    - Room
    - RoomList

- **[modal](#Modal)**
    - Modal

- **[onlineList](#OnlineList)** (Not yet implemented)

#### App

This is the top layer of the application (appart from index.js that wraps my app in a reactDom renderer).

*View*

The app layout covers the whole browser view which is depend on if a user is logged in or not.
if a user is logged in the view is devided into 3 sections: RoomList, Chat, OnlineList
if a user is not logged in the view is: Login

*functionality*

App contain UserContext and MessageContext, so that components throughout the application can access the context data.
App also holds a set of hooks that handles the server commnication. It sends the hook functions down to child components based on needs.

Hooks used in Compenent
- useMessages
- useChatRooms
- useOpenChatRoom
- useState - [loggedIn, setLoggedIn]
- useState - [user, setUser]

useState - [user, setUser] provides user data the UserContext so that other components can know what user is logged in.

useState - [loggedIn, setLoggedIn] handles what view App should render.

For information about custom hooks see the [hooks section](# Hooks and server communication)

#### Chat

*View*

The chat covers the biggest part of the application view and provides a view of messages for a chat room and the ability to type your own message.

The Chat component has two child components:
- MessageBox, MessageInputForm. 

MessageBox displays all the messages in a related to a chatroom on the server.

MessageInputForm is a form where the user can type and submit their chat message.

*Functionality*

The Chat component uses MessageContext provided by the App component. MessageContext gives access to all the messages for a specific room, which are dispalyed in MessageBox.

MessageInputForm has an onSubmit function that creates and sends a message. It uses UserContext to access the current username and the prop chatName to access the current room name.

MessageBox only maps props.messages to \<\li> tags.

#### Login


*View*

The login view covers the whole browser view and is the first view the user sees. The user is prompted to login or create a user.

The login view is has an input field and a login button.

*Functionality*

The LoginFrom component handles user Login and a user Creation through its login/create button. The input-field data is grabbed and sent to the server for a login or create user attempt. If login is called and the user doesn't exists an error message is displayed in the UI. same for if an existing user tries to be created.

**Socket Events**
- login
- create user

Both user login and user creation emits events on the client socket which are recived by the server socket. The events are "login" and "create user"

#### RoomList

*View*
- A Create Room button that can open a Modal component
- A list of all the chat rooms.

*Functionality*

The room lists handles Opening and cosing the Modal component and provides a function onCreateChatRoom to the Modal. onCreateChatRoom calls the createChatRoom hook with the current users username and an room name input from modal.

#### OnlineList

Not yet implemented

Just contains some basic html to cover up an area of the browser 

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

