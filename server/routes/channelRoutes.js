const express = require("express");

const { createChannel } = require("../controllers/channelController");
const { addMessageToChannel } = require("../controllers/channelController");
const { getChannels } = require("../controllers/channelController");
const { deleteChannel } = require("../controllers/channelController");

const router = express.Router();

router.post("/createChannel", createChannel);
router.post("/addMessageToChannel", addMessageToChannel);
router.get("/getChannels", getChannels);
router.delete("/deleteChannel", deleteChannel);

module.exports = router;
