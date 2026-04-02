import { useState } from "react"
import "./App.css"

import {
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/clerk-react"

function App() {
  return (
    <>
      <h1>Welcome to the app</h1>

      <SignedOut>
        <SignInButton mode="modal">
          <button className="flex bg-red-500">Login</button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <SignOutButton />
      </SignedIn>

      <SignedIn>
        <UserButton />
      </SignedIn>
    </>
  )
}

export default App
