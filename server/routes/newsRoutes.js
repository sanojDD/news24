import express from "express";
import { getNepalNews } from "../controllers/newsController.js";

const router = express.Router();

// GET /api/news
router.get("/", getNepalNews);

export default router;
