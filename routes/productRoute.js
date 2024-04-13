const express = require("express");
const router = express.Router();
const {
    createProduct,
    getAllProduct,
    getSingleProduct,
    deleteProduct,
    updateProduct,
} = require("../controller/productController");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
router.post("/", authMiddleware, isAdmin, createProduct);
router.get("/all-products", getAllProduct);
router.get("/:id", getSingleProduct);
router.put("/:id", authMiddleware, updateProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);
module.exports = router;
/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Endpoints for managing products
 * 
 * /api/product:
 *   post:
 *     summary: Create a New Product
 *     description: Create a new product in the system.
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: string
 *               brand:
 *                 type: string
 *               quantity:
 *                 type: number
 *               images:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '200':
 *         description: New Product added successfully
 */