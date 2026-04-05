import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import path from "path"

import { serve } from "inngest/express"
import { ENV } from "./lib/env.js"
import { connectDB } from "./lib/db.js"
import { inngest } from "./lib/inngest.js"
import { functions } from "./lib/inngest.js"

dotenv.config()

const app = express()

const __dirname = path.resolve()

// middleware
app.use(express.json())
// credentials: true meaning?? => server allows a browser to include cookies on request
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }))

app.use("/api/inngest", serve({ client: inngest, functions }))

app.get("/health", (req, res) => {
  res.status(200).json({ msg: "api is up and running" })
})

app.get("/books", (req, res) => {
  res.status(200).json({ msg: "this is the books endpoint" })
})

// make our app ready for deploment
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "..frontend/dist")))

  app.get("/{*}", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"))
  })
}

// start server
const startServer = async () => {
  try {
    await connectDB()
    app.listen(ENV.PORT, () =>
      console.log("Server is running on port:", ENV.PORT),
    )
  } catch (error) {
    console.log("💣 Error starting the server", error)
  }
}

startServer()
