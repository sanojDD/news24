import express from "express";
import {
  getReels,
  createReel,
  toggleLike,
} from "../controllers/reelController.js";

const router = express.Router();

router.get("/", getReels);
router.post("/", createReel);
router.put("/:id/like", toggleLike);

export default router;
