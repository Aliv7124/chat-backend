/*
import jwt from "jsonwebtoken";

export const createTokenAndSaveCookie = (user, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: true,       // required for HTTPS (Render + Vercel)
    sameSite: "none",   // allow cross-site cookies
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};
*/
import jwt from "jsonwebtoken";

export const createTokenAndSaveCookie = (user, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
res.cookie("jwt", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // only true in prod
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});
};
