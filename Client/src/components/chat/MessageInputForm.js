import React, { useState, useContext } from 'react'
import { UserContext } from '../../App'
import '../../index.css'

export function MessageInputForm({chatName, sendMessage}) {
  const [messageInput, setMessageInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const user = useContext(UserContext)

  function onSubmit(e) {
    e.preventDefault()

    const message = {username:user.username, roomName:chatName, message:messageInput}
    sendMessage(message)

    setMessageInput('')
  }

  function updateInput(e){
    setMessageInput(e.target.value)
  }

  return (
    <div className="border-t h-48 flex justify-center items-center">
    <form className="w-full h-full flex" onSubmit={ onSubmit }>
      <input value={messageInput} className="bg-gray-50 h-full border border-gray-300 mb-3 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write a message" onChange={ e => updateInput(e) } />
      <button className="bg-gray-100 w-1/6" type="submit" disabled={ isLoading }>Send</button>
    </form>
    </div>
  );
}