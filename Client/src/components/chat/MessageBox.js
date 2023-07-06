import React, { useEffect } from 'react'
import Message from './Message'
import '../../index.css'

export default function MessageBox({messages}) {
  
    return (
      <div className="flex-grow">
        <ul>
         {messages ? messages.map((message, index) => 
                <li key={index}>
                    <Message message={message}></Message> 
                </li>
          ) : null}
        </ul>
      </div>
  )
}
