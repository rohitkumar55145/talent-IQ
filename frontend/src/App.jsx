import { useState } from "react"
import "./App.css"
import {
  SignInButton,
  SignedOut,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react"

function App() {
  return (
    <>
      <header>
        <SignInButton>
          <SignedOut />
        </SignInButton>
      </header>
    </>
  )
}

export default App
