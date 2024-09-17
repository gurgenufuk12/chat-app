const firebase = require("../db");
const Post = require("../models/channel");
const admin = require("firebase-admin");
const auth = admin.auth();
const db = firebase.collection("channels");

const createChannel = async (req, res) => {
  try {
    const { channelName, owner, ...otherData } = req.body;

    if (
      !channelName ||
      typeof channelName !== "string" ||
      channelName.trim() === ""
    ) {
      return res.status(400).send("Invalid channel name");
    }

    const channelRef = db.doc(channelName.trim());

    await channelRef.set({
      channelName: channelName.trim(),
      owner: owner,
      ...otherData,
      rooms: [],
      messages: [],
      users: [],
    });

    res.send("Channel created successfully");
  } catch (error) {
    console.error("Error creating channel:", error);
    res.status(400).send(error.message);
  }
};
const deleteChannel = async (req, res) => {
  try {
    const { channelName } = req.body;

    if (!channelName || typeof channelName !== "string") {
      return res.status(400).send("Invalid channel name");
    }

    const channelRef = db.doc(channelName);
    await channelRef.delete();

    res.send("Channel deleted successfully");
  } catch (error) {
    console.error("Error deleting channel:", error);
    res.status(400).send(error.message);
  }
};
const addMessageToChannel = async (req, res) => {
  try {
    const { channelId, roomId, sender, content, createdAt } = req.body;

    const message = {
      sender: sender,
      content: content,
      createdAt: createdAt,
    };

    const channelRef = db.doc(channelId);
    const channel = await channelRef.get();

    if (!channel.exists) {
      return res.status(400).send("Channel not found");
    }

    const rooms = channel.data().rooms;

    const roomIndex = rooms.findIndex((room) => room.roomName === roomId);
    if (roomIndex === -1) {
      return res.status(400).send("Room not found");
    }

    const updatedRooms = rooms.map((room, index) => {
      if (index === roomIndex) {
        return {
          ...room,
          messages: [...room.messages, message],
        };
      }
      return room;
    });

    await channelRef.update({
      rooms: updatedRooms,
    });

    res.send("Message added to the channel successfully");
  } catch (error) {
    console.error("Error adding message to channel:", error);
    res.status(400).send(error.message);
  }
};

const addRoomToChannel = async (req, res) => {
  try {
    const { channelName, roomName } = req.body;

    if (!channelName || !roomName) {
      return res.status(400).send("Invalid channel or room name");
    }

    if (typeof roomName !== "string" || roomName.trim() === "") {
      return res.status(400).send("Invalid room name");
    }
    const room = {
      roomName: roomName,
      messages: [],
    };
    const channelRef = db.doc(channelName);
    await channelRef.update({
      rooms: admin.firestore.FieldValue.arrayUnion(room), // Add room to 'rooms' array
    });

    res.send("Room added to the channel successfully");
  } catch (error) {
    console.error("Error adding room to channel:", error);
    res.status(400).send(error.message);
  }
};
const getRooms = async (req, res) => {
  try {
    const { channelName } = req.params;

    const rooms = [];
    const channelRef = db.doc(channelName);
    const channel = await channelRef.get();

    if (!channel.exists) {
      return res.status(400).send("Channel not found");
    }

    const channelData = channel.data();
    const channelRooms = channelData.rooms;

    channelRooms.forEach((room) => {
      rooms.push(room);
    });

    res.status(200).send(rooms);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).send(error.message);
  }
};

module.exports = {
  createChannel,
  addMessageToChannel,
  deleteChannel,
  getRooms,
  addRoomToChannel,
};
