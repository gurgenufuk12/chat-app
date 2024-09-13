const firebase = require("../db");
const Post = require("../models/user");
const admin = require("firebase-admin");
const auth = admin.auth();
const db = firebase.collection("users");

const createUser = async (req, res) => {
  try {
    const data = req.body;

    await db.doc().set(data);
    res.send("User created successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};
const getUserByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    const snapshot = await db.where("email", "==", email).get();
    if (snapshot.empty) {
      res.status(404).send("User not found");
      return;
    } else {
      res.status(200).send("User found");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};
module.exports = {
  createUser,
  getUserByEmail,
};
