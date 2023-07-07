import { socket } from '../../utils/socket'
import { useState } from 'react';


/* Custom hook */

const useLoginView = (setUser, LogIn) => {
  const [headingText, setHeadingText] = useState('Login')
  const [buttonText, setButtonText] = useState('Login')
  const [changeViewText, setChangeViewText] = useState('Create Account')
  const [errorMessage, setErrorMessage] = useState('');

  function toggleLoginView(){
    if(headingText === 'Login'){
      changeToCreateAccountView()
    }
    else{
      changeToLoginView()
    }
  }

  function changeToCreateAccountView(){
    setHeadingText('Create Account')
    setButtonText('Create Account')
    setChangeViewText('Login')
    setErrorMessage('')
  }

  function changeToLoginView(){
    setHeadingText('Login')
    setButtonText('Login')
    setChangeViewText('Create Account')
    setErrorMessage('')
  }

  function onFormSubmit(event){
    if(headingText === 'Login'){
      loginSubmit(event)
    }
    else{
      createAccountSubmit(event)
    }
  }

  function loginSubmit(event){
    setErrorMessage('')
    event.preventDefault()
    const username = event.target.username.value
    socket.emit('login', username, (user) => {
      if(user === "user does not exist"){
        console.log('Login Error caught')
        setErrorMessage(`The user ${username} does not exists.`)
        return
      }
      console.log(user)
      //setUser(user)
      LogIn(user)
    })
  }

  function createAccountSubmit(event){
    setErrorMessage('')
    event.preventDefault()
    const username = event.target.username.value
    socket.emit('create user', username, (user) => {
      if(user === "user already exists"){
        console.log('Create User Error caught')
        setErrorMessage(`The user ${username} already exists.`)
        return
      }
      console.log("Login: ", user)
      //setUser(user)
      LogIn(user)
    })
  }

  return [headingText, buttonText, changeViewText, toggleLoginView, onFormSubmit, errorMessage]
}


function LoginForm(props) {
  const {setUser, LogIn} = props
  const [headingText, buttonText, changeViewText, toggleLoginView, onFormSubmit, errorMessage] = useLoginView(setUser, LogIn)


  return (
    <div className="bg-white shadow rounded-lg h-1/2 flex flex-col justify-center items-center w-full sm:w-1/2 md:1/3">
      <div className="flex flex-col justify-center items-center">
      <h1 className="text-3xl pb-5 font-bold leading-tight tracking-tight">{headingText}</h1>
      <form onSubmit={(event) => onFormSubmit(event)}>
        <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
        <input type="text" name="username" id="username" className="bg-gray-50 border border-gray-300 mb-3 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Type your name"/>
        <button type="submit" className="w-full rounded-lg font-medium text-sm py-2.5 bg-blue-800 text-white">{buttonText}</button>
      </form>
        <div className="flex w-full mt-2 h-6 justify-start items-start">
          <span className="text-blue-500 text-sm underline" onClick={toggleLoginView}>{changeViewText}</span>
        </div>
      <span className="pt-2 h-6 text-gray-400">{errorMessage}</span>
      </div>
    </div>
  )
}

export default LoginForm