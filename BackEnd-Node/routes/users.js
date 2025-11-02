import express from "express";
const router = express.Router();
import { authenticate } from "../middleware/auth";
import uc from "../controllers/userController";

router.get("/:username", authenticate, uc.getUserByUsername);
router.put("/:username", authenticate, uc.updateUser);
router.get("/me", authenticate, uc.getMe);
router.get("/search", authenticate, uc.searchUsers);
router.get("/all-users", authenticate, uc.getAllUsers)

module.exports = router;