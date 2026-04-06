import { Inngest } from "inngest"
import { connectDB } from "./db.js"
import User from "../models/User.js"

export const inngest = new Inngest({ id: "talent-iq" })

const syncUser = inngest.createFunction(
  { id: "sync-user" },
  { event: "clerk/user.created" },
  async ({ step, input }) => {
    await connectDB()

    const { id, email_addresses, first_name, last_name, image_url } = input.data

    const newUser = {
      clerkId: id,
      email: email_addresses?.[0]?.email_addresses,
      name: `${first_name || ""} ${last_name || ""}`,
      profileImage: image_url,
    }

    await User.create(newUser)

    // todo: do sth
  },
)

// Pahale se likha code mila
// const deleteUserFromDB = inngest.createFunction(
//   { id: "delete-user-from-db" },
//   { event: "clerk/user.deleted" },
//   async ({ step, input }) => {
//     await connectDB()

//     const { id } = input.data

//     await User.deleteOne({ clerkId: id })

//     // todo: do sth else
//   },
// )

const deleteUserFromDB = inngest.createFunction(
  { id: "delete-user-from-db" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    await connectDB()

    const { id } = event.data
    await User.deleteOne({ clerkId: id })

    await deleteStreamUser(id.toString())
  },
)

export const functions = [syncUser, deleteUserFromDB]
