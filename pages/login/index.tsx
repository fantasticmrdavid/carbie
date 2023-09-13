import React from 'react'
import { signIn } from 'next-auth/react'

export const LoginPage = () => {
  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Carbie</h1>
      <div style={{ margin: '-1em 0 0' }}>
        <button onClick={() => signIn()}>Sign in</button>
      </div>
    </div>
  )
}

export default LoginPage
