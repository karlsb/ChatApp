import React, { useContext } from 'react'
import { UserContext } from '../../App'
import '../../index.css'

export default function Message({message}) {
  const user = useContext(UserContext)

  if(message.user === user.username){
    return (
      <div className="h-20 border-b flex items-center">
        <span className="ml-2">
          {message.user}: 
        </span>
        <span className="flex ml-2 bg-blue-800 h-10 items-center justify-center text-white p-3 rounded-2xl text-md font-medium">
          {message.message}
        </span>
      </div>
    )
  }
  else{
  return (
    <div className="h-20 border-b flex items-center">
      <span className="ml-2">
        {message.user}: 
      </span>
      <span className="flex ml-2 bg-gray-100 h-10 items-center justify-center p-3 rounded-2xl text-md font-medium">
        {message.message}
      </span>
    </div>
  )
  }
}
