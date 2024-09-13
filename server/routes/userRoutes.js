const express = require("express");

const { createUser } = require("../controllers/userController");
const { getUserByEmail } = require("../controllers/userController");

const router = express.Router();

router.post("/createUser", createUser);
router.get("/getUserByEmail/:email", getUserByEmail);
module.exports = router;
