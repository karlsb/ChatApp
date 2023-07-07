import { useContext } from 'react'
import { MessageInputForm } from './MessageInputForm';
import MessageBox from './MessageBox';
import { MessageContext } from '../../App';
import '../../index.css'

function Chat({chatName, sendMessage}) {
   const messages = useContext(MessageContext) 

    return (
        <div className="bg-white flex-auto">
            <div className="flex flex-col h-full">
                <div className="h-20 border-b flex items-center"> 
                    <h1 className="pl-10 text-3xl font-bold leading-tight tracking-tight">{chatName}</h1>
                </div>
                <MessageBox messages={messages}></MessageBox> 
                <MessageInputForm sendMessage={sendMessage} chatName={chatName}/>
            </div>
        </div>
    )
}

export default Chat