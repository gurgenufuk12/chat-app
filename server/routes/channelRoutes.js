const express = require("express");

const { createChannel } = require("../controllers/channelController");
const { addMessageToChannel } = require("../controllers/channelController");
const { getMessagesFromChannel } = require("../controllers/channelController");
const { getChannels } = require("../controllers/channelController");

const router = express.Router();

router.post("/createChannel", createChannel);
router.post("/addMessageToChannel", addMessageToChannel);
router.get("/getMessagesFromChannel/:channelName", getMessagesFromChannel);
router.get("/getChannels", getChannels);


module.exports = router;
