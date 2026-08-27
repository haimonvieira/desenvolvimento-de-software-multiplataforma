import express from "express"
import userController from "../controllers/userController.js"

const userRoutes = express.Router()

userRoutes.post("/user", userController.createUser)
userRoutes.post("/login", userController.loginUser)

export default userRoutes