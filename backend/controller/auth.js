import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";

// register api function
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile,
      impressions,
    } = req.body;
    const salt = await bcrypt.genSalt();                    // generate salt
    const passwordHash = await bcrypt.hash(password, salt); // encrypting the user password
    const newUser = new User({
      // creating new user in DB
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000), // dummy value
      impressions: Math.floor(Math.random() * 10000), // dummy value
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ result: error });
  }
};
