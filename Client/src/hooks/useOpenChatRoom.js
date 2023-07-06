


/* open and close the chatroom view */

import { useState } from 'react'
import { socket } from '../utils/socket'
import { VERBOSE } from '../utils/constants'

export const useOpenChatRoom = (setMessages) => {
    const [openChatRoom, setOpenChatRoom] = useState('')

    function openRoom(roomName){
        return () => {
            if(VERBOSE){
                console.log('openRoom: ', roomName)
            }
            setOpenChatRoom(roomName)
            socket.emit('open room callback', roomName, (messages) => {
                setMessages(messages)
            })
        }
    }

    return [openChatRoom, openRoom]
}