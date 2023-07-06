import "../../index.css"
import {useJoinChatRoom} from "../../hooks/useJoinChatRoom"
/* 
    - chatroom name
    - button to join
    - button to leave
    - butotn to display this chatroom in the message area.
*/
export function ChatRoom(props) {
    const {roomName, openRoom, username} = props
    const [joinRoom, leaveRoom] = useJoinChatRoom(username)

    return (
        <div className="flex space-x-2 h-20 pt-1 border-b hover:bg-gray-200 hover:cursor-pointer" onClick={openRoom(roomName)}>
            <div className="flex-grow">
                <h2 className="text-blue-500 text-lg font-medium ml-2">{roomName}</h2>
            </div>
            <div className="pr-2 flex flex-col">
                <button className="bg-blue-800 p-1 rounded-lg font-medium text-sm text-white mb-2" onClick={joinRoom(roomName)}>Join</button>
                <button className="bg-blue-800 p-1 rounded-lg font-medium text-sm text-white" onClick={leaveRoom(roomName)}>Leave</button>
            </div>
        </div>
    )
}
