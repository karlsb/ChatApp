
import io from "socket.io-client"
import { assert } from "chai"
import {createMessage, messages,clearMessages, getRoomMessages, addRoomInMessages, addMessages} from './utils/message.js'
import {chatRooms,  createChatRoom, userIsInRoom, userJoinRoom, getChatRooms, chatRoomExist, isChatRoomsEmpty, clearChatRooms, joinChatRoom} from './utils/chatRooms.js'
import {clearUsers, findUser,addUser, getUserById ,userExists, users, addRoomInUsers, getUserRooms} from './utils/users.js';

import  {VERBOSETEST} from './config.js'


describe('database', () => {

  it('adduser test', () => {
    const user = {id: 1, username: 'John', rooms: []}
    addUser(user.id, user.username)
    assert.equal(userExists(user.username), true)
    assert.deepEqual(user, getUserById(user.id))
  } )

  it('clearUser test', () => {
    clearUsers()
    assert.deepEqual([], users)
  })


  it('createChatRoom test', () => {
    const roomName = 'TestRoom'
    const ownerId = 'John'
    addUser(1, 'John')
    const expectedRoom = {'TestRoom': {ownerId: ownerId, users: [ownerId]}}
    createChatRoom(roomName, ownerId)
    assert.deepEqual(expectedRoom, chatRooms)
  })

  it('addMessage test', () => {
    clearMessages()
    clearChatRooms()
    clearUsers()
    const message = {user: 'John', message: 'Hello World'}
    const roomName = 'TestRoom'
    const expectedMessage = {user: 'John', message: 'Hello World'}

    addUser(1, 'John')
    createChatRoom(roomName, message.user)

    addMessages(roomName, message)
    assert.deepEqual(expectedMessage, getRoomMessages(roomName)[0])
  })
  
  it('clearMessages test', () => {
    clearMessages()
    assert.deepEqual({}, messages)
  })

  it('clearChatRooms test', () => {
    clearChatRooms()
    assert.deepEqual({}, chatRooms)
  })


  it('getUserRooms test', () => {
    clearUsers()
    clearChatRooms()
    clearMessages()

    const user = {id: 1, username: 'John', rooms: ['TestRoom']}
    addUser(user.id, user.username)
    
    addRoomInUsers(user.username, user.rooms[0])

    assert.deepEqual(user.rooms, getUserById(user.id).rooms)
  })

  it('userJoinRoom test', () => {
    clearChatRooms()
    clearUsers()
    clearMessages()
  
    //must exist a user named John, must exists a room named TestRoom.
    addUser(1, 'John')
    addUser(2, 'Jane')
    createChatRoom('TestRoom', 'John')
    joinChatRoom('Jane', 'TestRoom')
    if(VERBOSETEST){
      console.log('chatrooms: ', chatRooms)
      console.log('users: ',users) 
    }
    assert.deepEqual(['John', 'Jane'], chatRooms['TestRoom'].users)
    
  })

  it('chatRoomExist test', () => {
    clearChatRooms()
    clearUsers()
    clearMessages()
    const roomName = 'TestRoom'
    const ownerId = 'John'
    addUser(1, 'John')
    createChatRoom(roomName, ownerId)
    assert.equal(chatRoomExist(roomName), true)
    assert.equal(chatRoomExist('NotExistingRoom'), false)
  })

  it('userIsInRoom test', () => {
    clearChatRooms()
    clearUsers()
    clearMessages()
    const roomName = 'TestRoom'
    const ownerId = 'John'
    const user = 'Jane'
    //should make sure that i cant do stuff without users
    addUser(1, 'John')
    addUser(2, 'Jane')
    createChatRoom(roomName, ownerId)
    joinChatRoom(user, roomName)
    if(VERBOSETEST){
      console.log('chatrooms: ', chatRooms)
      console.log('users: ',users) 
    }
    assert.equal(userIsInRoom(user, roomName), true)
    assert.equal(userIsInRoom(user, 'NotExistingRoom'), false) 
  })

})


/* ----------------------------- 

      CALLBACK API TESTS

 ---------------------------- */

describe.only('callback api', function () {

  let clientSocket;
  
  before(function(done) {
    // Start the server
    clearUsers()
    clearChatRooms()
    clearMessages()
    done()
  });

  beforeEach(function(done) {
    // Connect a new client before each test
    clientSocket = io.connect('http://localhost:4000');
    clientSocket.on('connect', done);
  });

  afterEach(function() {
    // Disconnect the client after each test
    clientSocket.disconnect();
    clearUsers()
    clearChatRooms()
    clearMessages()
  });
  
  it('create user callback', function(done){
      const expected = {id:clientSocket.id, username:'John', rooms:[]}

      clientSocket.emit('create user callback', 'John', (response) => {
        assert.deepEqual(response, expected)
        done()
      })
  })

  it('create room callback', function(done){

    const expected = { ownerId:'John', users:['John']}

    clientSocket.emit('create user callback', 'John', (res)=>{
      clientSocket.emit('create room callback', {username:'John', roomName:'TestRoom'}, (response) => {
        assert.deepEqual(response, expected)
        done()
      })
    })
  })

  it('join room callback', function(done){
      // "world" setup
      addUser(1, 'John')
      addUser(2, 'Frank')

      createChatRoom('TestRoom', 'John')

      assert.deepEqual(chatRooms, {'TestRoom':{ownerId: 'John', users:['John']}})
      assert.deepEqual(users, [{id:1, username:'John', rooms:['TestRoom']}, {id:2, username:'Frank', rooms:[]}])   
      // join room test 
      //TODO we dont want a username to be providable cus then a user can make other users join rooms     
      clientSocket.emit('join room callback', {username:'Frank', roomName:'TestRoom'}, (response) => {
        assert.deepEqual(response, {ownerId: 'John', users:['John', 'Frank']})
        assert.deepEqual(chatRooms, {'TestRoom':{ownerId: 'John', users:['John', 'Frank']}})
        assert.deepEqual(users, [{id:1, username:'John', rooms:['TestRoom']}, {id:2, username:'Frank', rooms:['TestRoom']}])
        done()
      })

  })

  it('open room callback', function(done){
    // "world" setup

    const expected = {'TestRoom':[{user:'John', message:'Hello World'}]}

    addUser(1, 'John')
    addUser(2, 'Frank')

    createChatRoom('TestRoom', 'John')

    
    addMessages('TestRoom', createMessage('John', 'Hello World'))

    assert.deepEqual(chatRooms, {'TestRoom':{ownerId: 'John', users:['John']}})
    assert.deepEqual(users, [{id:1, username:'John', rooms:['TestRoom']}, {id:2, username:'Frank', rooms:[]}])   
    assert.deepEqual(messages, expected)

    clientSocket.emit('open room callback', 'TestRoom', (response) => {
      assert.deepEqual(response, expected.TestRoom) 
      done()
    })

  })

  it('chat message callback', function(done){
     // "world" setup
    const expected = {'TestRoom':[{user:'John', message:'Hello World'}]}

    addUser(1, 'John')

    createChatRoom('TestRoom', 'John')

    assert.deepEqual(chatRooms, {'TestRoom': {ownerId: 'John', users:['John']}})
    assert.deepEqual(users, [{id:1, username:'John', rooms:['TestRoom']}])   


    clientSocket.emit('send message callback', {roomName:'TestRoom', username:'John', message:'Hello World'}, (response) => {
      assert.deepEqual(response, expected.TestRoom[0]) 
      assert.deepEqual(messages, expected)
      done()
    })
  })

  it('leave room callback', function(done){
    // "world" setup
    const expected = {'TestRoom':[{user:'John', message:'Hello World'}]}

    addUser(1, 'John')
    addUser(2, 'Frank')

    createChatRoom('TestRoom', 'John')

    assert.deepEqual(chatRooms, {'TestRoom': {ownerId: 'John', users:['John']}})
    assert.deepEqual(users, [{id:1, username:'John', rooms:['TestRoom']}, {id:2, username:'Frank', rooms:[]}])   

    clientSocket.emit('join room callback', {username:'Frank', roomName:'TestRoom'}, (response) => {
      assert.deepEqual(chatRooms, {'TestRoom': {ownerId: 'John', users:['John','Frank']}})
      assert.deepEqual(users, [{id:1, username:'John', rooms:['TestRoom']}, {id:2, username:'Frank', rooms:['TestRoom']}])   
      clientSocket.emit('leave room callback', {username:'Frank', roomName:'TestRoom'}, (response) => {
        assert.deepEqual(response, 'Frank left the room TestRoom')
        assert.deepEqual(chatRooms, {'TestRoom': {ownerId: 'John', users:['John']}})
        assert.deepEqual(users, [{id:1, username:'John', rooms:['TestRoom']}, {id:2, username:'Frank', rooms:[]}])   
        done()
      })
    })
  })

  it('get rooms', function(done){
    // "world" setup
    const expected = ['TestRoom']
    
    addUser(1, 'John')
    addUser(2, 'Frank')
    createChatRoom('TestRoom', 'John')

    assert.deepEqual(chatRooms, {'TestRoom': {ownerId: 'John', users:['John']}})

    clientSocket.emit('get rooms', (response) => { 
      assert.deepEqual(response, expected)
      done()
    })

  })



  it('create user test', function(done){
    const expected = {id:clientSocket.id, username:'John', rooms:[]}

    clientSocket.emit('create user', 'John', (response) => {
      assert.deepEqual(response, expected)
      assert.deepEqual(users, [expected])
      assert.deepEqual(findUser('John'), expected)
      done()
    }) 
  }) 

  it('login test', function(done){

    addUser(clientSocket.id, 'John')
    const expected = {id:clientSocket.id, username:'John', rooms:[]}

    clientSocket.disconnect()
    clientSocket = io.connect('http://localhost:4000');

    clientSocket.on('connect', () => {
      clientSocket.emit('login', 'John', (response) => {
        assert.deepEqual(response, expected)
        done()
      })
    }) 
  })

/*   it('login rooms test', function(done){
      addUser(clientSocket.id, 'John')    
      const expected = {id:clientSocket.id, username:'John', rooms:['TestRoom']}
  
      clientSocket.emit('create room', {username:'John',roomName:'TestRoom'}, (response) => {
        clientSocket.disconnect()
        clientSocket = io.connect('http://localhost:4000');
          
        clientSocket.on('connect', () => {
          clientSocket.emit('login', 'John', (response) => {
            assert.deepEqual(response, expected)
            done()
          })
        }) 
      })
  })
 */
})



/*---------------------

    Multiple Clients

  ----------------------*/
describe('multiple clients', function () {

    let clientOne
    let clientTwo

    beforeEach(function(done) {
      // Connect a new client before each test
        clientOne = io.connect('http://localhost:4000');
        clientTwo = io.connect('http://localhost:4000');
        
        let counter = 0
        const handleConnect = () => {
            counter++  
            if (counter === 2) {
                done()
            }
        }
        clientOne.on('connect', handleConnect);
        clientTwo.on('connect', handleConnect);

          
    })

    afterEach(function() {
      // Disconnect the client after each test
      clientOne.disconnect();
      clientTwo.disconnect();
    });
    
    it('clients connected', function(done){
      assert.equal(clientOne.connected, true)
      assert.equal(clientTwo.connected, true)
      done()
    })
    
    it('clients setup', function(done){
      const john = 'John'
      const frank = 'Frank'
      const expected = [{id:clientOne.id, username:john, rooms:['TestRoom']}, 
                       {id:clientTwo.id, username:frank, rooms:['TestRoom']}]

      const expectedRooms = {'TestRoom':{ownerId: john, users:[john, frank]}}
      
      addUser(clientOne.id, john)
      addUser(clientTwo.id, frank)
      //we need to make sure that the created rooms are showed on the front end for both clients
      clientOne.emit('create room callback', {roomName:'TestRoom', username:john}, (response) => {
        clientTwo.emit('join room callback', {roomName:'TestRoom', username:frank}, (response) => {
          assert.deepEqual(users, expected)
          assert.deepEqual(chatRooms, expectedRooms)
          done()
        })
      })


    }) 

})  