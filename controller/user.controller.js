import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import { createTokenAndSaveCookie } from "../JWT/generatetoken.js";

// Signup
export const signup = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;
    if (!username || !email || !password || !confirmPassword)
      return res.status(400).json({ msg: "All fields are required" });

    if (password !== confirmPassword)
      return res.status(400).json({ msg: "Passwords do not match" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ msg: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, email, password: hashedPassword });

    createTokenAndSaveCookie(newUser, res);
    res.status(201).json({ msg: "User created", user: newUser });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ msg: "All fields are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    createTokenAndSaveCookie(user, res);
    res.status(200).json({ msg: "Logged in", user });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
