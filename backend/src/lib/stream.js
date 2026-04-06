import { StreamChat } from "stream-chat"
import { ENV } from "./env.js"

const apiKey = ENV.STREAM_API_KEY
const apiSecret = ENV.STREAM_API_SECRET

if (!apiKey || !apiSecret) {
  console.log("STREAM_API_KEY or STREAM_API_SECRET is missing")
}

export const chatClient = StreamChat.getInstance(apiKey, apiSecret)

export const upsertStreamUser = async (userData) => {
  try {
    await chatClient.upsertUsers([userData])
    console.log("Stream usr deleted successfully:", userData)
  } catch (error) {
    console.log("Error upserting Stream user:", error)
  }
}

export const deleteStreamUser = async (userId) => {
  try {
    await chatClient.deleteUsers([userId])
    console.log("Stream usr deleted successfully:", userId)
  } catch (error) {
    console.log("Error deleting the Stream user:", error)
  }
}

// todo: add another method to generateToken
