import React from 'react'

const Login = (props) => {
  return (
    <div className="login">
        <div className="welcome"><h1>Welcome to the Voting Dapp</h1></div>
        <button className='btn'onClick={props.connectWallet}>Connect</button>
    </div>
  )
}

export default Login