import express from "express"
import { getStreamToken } from "../controllers/chatController"
import { protectRoute } from "../middleware/protectRoute.js"
const router = express.Router()

router.get("/token", protectRoute, getStreamToken)

export default router
