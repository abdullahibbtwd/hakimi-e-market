import React from 'react'
import { signOut } from '@/auth'
import { doLogout } from '@/app/actions'
const Logout = () => {
  return (
    <form action={doLogout}>
        <button type='submit' >
        Logout
        </button>
    </form>
  )
}

export default Logout