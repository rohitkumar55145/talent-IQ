import {
  SignInButton,
  SignedIn,
  SignOutButton,
  UserButton,
  SignedOut,
} from "@clerk/clerk-react"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"

import toast from "react-hot-toast"

const HomePage = () => {
  return (
    <div>
      <button
        className="btn btn-secondary"
        onClick={() => toast.error("This is a success toast")}
      >
        click me
      </button>

      <SignedOut>
        <SignInButton mode="modal">
          <button>Login</button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <SignOutButton />
      </SignedIn>

      <UserButton />
    </div>
  )
}

export default HomePage
