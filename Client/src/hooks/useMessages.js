import { useEffect, useState } from "react";
import { socket } from "../utils/socket";
import { VERBOSE } from "../utils/constants";

export const useMessages = () => {
    const [messages, setMessages] = useState(['Welcome!'])

    const sendMessage = (message) => {
        if(VERBOSE){
            console.log('sendMessage: ', message)
        }
        if(socket) {
            socket.emit('send message callback', message, 
            (message) => {
                setMessages(prevMessages => [...prevMessages, message ])
            })
        }
    }

    useEffect(() => {
        if(socket){
            socket.on('recieve message', (message) => {
                if(VERBOSE){
                    console.log('recieveMessages: ', message)
                }
                setMessages(prevMessages => [...prevMessages, message])
            })
        }//TODO BUG HERE?
        return(() => {
            socket.off('recieve message')
        })
    } , [messages])

    return [messages, sendMessage, setMessages]
}