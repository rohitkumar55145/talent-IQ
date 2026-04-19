import { clerkClient, requireAuth } from "@clerk/express"
import User from "../models/User.js"

const getUserDataFromClerk = async (clerkId) => {
  const clerkUser = await clerkClient.users.getUser(clerkId)
  const primaryEmail =
    clerkUser.emailAddresses.find(
      (email) => email.id === clerkUser.primaryEmailAddressId,
    ) || clerkUser.emailAddresses[0]

  return {
    clerkId,
    email: primaryEmail?.emailAddress || `${clerkId}@clerk.local`,
    name:
      [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
      clerkUser.username ||
      "User",
    profileImage: clerkUser.imageUrl || "",
  }
}

export const protectRoute = [
  requireAuth(),
  async (req, res, next) => {
    try {
      const clerkId = req.auth().userId

      if (!clerkId)
        return res.status(401).json({ message: "Unauthorized - invalid token" })

      let user = await User.findOne({ clerkId })

      if (!user) {
        const userData = await getUserDataFromClerk(clerkId)

        user = await User.findOneAndUpdate({ clerkId }, userData, {
          new: true,
          setDefaultsOnInsert: true,
          upsert: true,
        })
      }

      // attach user to req
      req.user = user

      next()
    } catch (error) {
      console.error("Error in protecRoute middleware", error)
      res.status(500).json({ message: "Internal Server Error" })
    }
  },
]
