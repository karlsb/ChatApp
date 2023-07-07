import React, {useState} from 'react'




/*  
    Modal to create a new chatroom.
*/

export default function Modal({show, setShow, onCreateChatRoom}) {
    const [userInput, setUserInput] = useState('')
    
    function updateUserInput(e){
        setUserInput(e.target.value)
    }

    function buttonEvent(){
        onCreateChatRoom(userInput)
        setUserInput('')
        setShow(false)
    }

    return (
        <>
        {show ?  
            <div className="bg-white border flex flex-col rounded-md shadow-xl z-10 h-56 w-100 start-60 fixed">
                <div className="flex ">
                    <h1 className="flex-grow m-2 text-lg font-bold">Create A Room</h1>
                    <button className="bg-blue-800 text-white p-1 rounded-lg m-2 font-medium text-sm" onClick={() => setShow(false)}>Close</button>
                </div>
                <div className="h-12 flex justify-center items-center space-x-4 flex-grow">
                    <span className="pr-2 text-sm font-medium">Room Name:</span>
                    <input  value={userInput} onChange={updateUserInput} className="shadow w-1/3 h-8 rounded-md border"></input>
                    <button className="bg-blue-800 text-white p-2 rounded-lg font-medium text-sm" onClick={buttonEvent}>Create Room</button>   
                </div>
                <div className="flex h-12 justify-center items-center">
                </div>
            </div> 
        : null}
        </>
    )
}
