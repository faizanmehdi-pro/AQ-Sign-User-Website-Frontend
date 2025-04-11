import React from 'react'
import LoginForm from '../components/LoginForm'

const Login = ({setToken, setPDFFile}) => {
  return (
    <LoginForm setToken={setToken} setPDFFile={setPDFFile}/>
  )
}

export default Login
