const express = require("express");
const router = express.Router();

const authRouter = require("./auth.route");
const userRouter = require("./user.route");
const restaurantRouter = require("./restaurant.route");
const menuRouter = require("./menu.route");
const orderRouter = require("./order.route");

router.use(
    "/auth",
    authRouter
);

router.use(
    "/user",
    userRouter
);

router.use(
    "/restaurant",
    restaurantRouter
);

router.use(
    "/menu",
    menuRouter
);

router.use(
    "/order",
    orderRouter
);

module.exports = router;
