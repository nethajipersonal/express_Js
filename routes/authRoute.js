// Import necessary modules
const express = require('express');
const { createUser, loginUserCtrl, getAllUser, getSingleUser, deleteUser, updateUser, blockUser, unblockUser, handleRefreshToken, logout } = require("../controller/userController")
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware")
// Create router
const router = express.Router()
// Define routes
router.post('/register', createUser)
router.post('/login', loginUserCtrl)
router.get('/user-refreshToken/', handleRefreshToken)
router.get('/all-users', authMiddleware, isAdmin, getAllUser)
router.get('/logout', logout)
router.post('/:id', authMiddleware, getSingleUser)
router.delete('/:id', authMiddleware, deleteUser)
router.put('/edit-user', authMiddleware, updateUser)
router.put('/user-block/:id', authMiddleware, isAdmin, blockUser)
router.put('/user-unblock/:id', authMiddleware, isAdmin, unblockUser)

module.exports = router;
/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and management
 * /api/user/register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with the provided details
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: User registered successfully
 *       '400':
 *         description: Invalid request
 */
/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Login as a user
 *     description: Log in as an existing user with username and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: User logged in successfully
 *       '401':
 *         description: Unauthorized
 */
