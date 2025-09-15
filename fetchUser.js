// Backend/middleware/fetchuser.js
import jwt from "jsonwebtoken";

const JWT_SECRET = "yourSecretKey"; // in real apps use process.env.JWT_SECRET

const fetchuser = (req, res, next) => {
  // get token from header
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).json({ error: "Please authenticate using a valid token" });
  }

  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

export default fetchuser;
