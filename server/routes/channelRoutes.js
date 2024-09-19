const express = require("express");

const { createChannel } = require("../controllers/channelController");
const { addMessageToChannel } = require("../controllers/channelController");
const { deleteChannel } = require("../controllers/channelController");
const { getRooms } = require("../controllers/channelController");
const { addRoomToChannel } = require("../controllers/channelController");
const { deleteRoomFromChanel } = require("../controllers/channelController");
const { addUserstoRoom } = require("../controllers/channelController");
const { addUserToChannel } = require("../controllers/channelController");

const router = express.Router();

router.post("/createChannel", createChannel);
router.post("/addMessageToChannel", addMessageToChannel);
router.delete("/deleteChannel", deleteChannel);
router.get("/getRooms/:channelName", getRooms);
router.post("/addRoomToChannel", addRoomToChannel);
router.delete("/deleteRoomFromChanel", deleteRoomFromChanel);
router.post("/addUserstoRoom", addUserstoRoom);
router.post("/addUserToChannel", addUserToChannel);

module.exports = router;
