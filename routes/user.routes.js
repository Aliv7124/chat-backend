import express from "express";
import { signup, login,logout,allUsers } from "../controller/user.controller.js";
import secureRoute from "../middleware/secureRoute.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/allusers", secureRoute, allUsers);

router.get("/me", secureRoute, (req, res) => {
  res.status(200).json({ user: req.user });
});
export default router;
