import React from 'react'
import LoginForm from './LoginForm'

function Login(props) {
  
  return (
    <div className="bg-gray-100 flex h-screen items-center justify-center">
        <LoginForm setUser={props.setUser} LogIn={props.LogIn}></LoginForm>
    </div>
  )
}

export default Login