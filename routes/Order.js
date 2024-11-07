const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const checkAuth = require("../middlewares/checkAuth");
const checkAdmin = require("../middlewares/checkAdmin");

router.post("/", checkAuth, orderController.createOrder);
router.get("/:orderId", checkAuth, orderController.getOrder);
router.get("/", checkAuth, orderController.getUserOrders);
router.delete("/:orderId", checkAuth, checkAdmin, orderController.deleteOrder);

module.exports = router;