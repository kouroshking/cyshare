const express = require("express");

// importing controllers
const { login, register } = require("../controllers/auth");
// importing middleware
const { loginMiddleware, registerMiddleware } = require("../middleware/auth");

// creating the router
const router = express.Router();
// router routes
router.post("/login", loginMiddleware(), login);

router.post("/register", registerMiddleware(), register);

module.exports = router;
