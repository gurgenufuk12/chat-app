const firebase = require("../db");
const Post = require("../models/channel");
const admin = require("firebase-admin");
const auth = admin.auth();
const db = firebase.collection("channels");

const createChannel = async (req, res) => {
  try {
    const { channelName, ...otherData } = req.body;
    console.log("channelName", channelName);

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
      ...otherData,
      messages: [],
      users: [],
    });

    res.send("Channel created successfully");
  } catch (error) {
    console.error("Error creating channel:", error);
    res.status(400).send(error.message);
  }
};
const addMessageToChannel = async (req, res) => {
  try {
    const { channelId, sender, content, createdAt } = req.body;

    const message = {
      sender: sender,
      content: content,
      createdAt: createdAt,
    };

    const channelRef = db.doc(channelId);
    await channelRef.update({
      messages: admin.firestore.FieldValue.arrayUnion(message), // Add message to 'messages' array
    });

    res.send("Message added to the channel successfully");
  } catch (error) {
    console.error("Error adding message to channel:", error);
    res.status(400).send(error.message);
  }
};

const getMessagesFromChannel = async (req, res) => {
  try {
    const { channelName } = req.params;

    const querySnapshot = await db
      .where("channelName", "==", channelName)
      .get();

    if (querySnapshot.empty) {
      return res.status(404).send("Channel not found");
    }

    const channelDoc = querySnapshot.docs[0];
    const channelData = channelDoc.data();

    res.status(200).send(channelData.messages || []);
  } catch (error) {
    console.error("Error getting messages from channel:", error);
    res.status(400).send(error.message);
  }
};

const getChannels = async (req, res) => {
  const channelNames = [];
  const querySnapshot = await db.get();
  querySnapshot.forEach((doc) => {
    channelNames.push(doc.id);
  });
  res.status(200).send(channelNames);
};
module.exports = {
  createChannel,
  addMessageToChannel,
  getMessagesFromChannel,
  getChannels,
};
