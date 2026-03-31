import Reel from "../models/Reel.js";

export const getReels = async (req, res) => {
  try {
    const reels = await Reel.find().sort({ createdAt: -1 });
    res.status(200).json(reels);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch reels", error: error.message });
  }
};

export const createReel = async (req, res) => {
  try {
    // 1. Get all 4 pieces of data from the frontend
    const { videoUrl, caption, username, userId } = req.body;

    // 2. Strict Validation: If any of these are missing, don't save!
    if (!videoUrl || !username || !userId) {
      return res.status(400).json({
        message: "Missing required fields: videoUrl, username, or userId",
      });
    }

    const newReel = new Reel({
      videoUrl,
      caption, // This can still be empty/default ""
      username, // The actual name from localStorage
      userId, // The actual MongoDB _id from localStorage
    });

    const savedReel = await newReel.save();

    // 3. Send back the saved reel so the frontend can add it to the Redux state
    res.status(201).json(savedReel);
  } catch (error) {
    res.status(400).json({
      message: "Failed to save reel",
      error: error.message,
    });
  }
};

export const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.body;
    const reel = await Reel.findById(id);
    const hasLiked = Array.isArray(reel.likes)
      ? reel.likes.includes(username)
      : false;
    const update = hasLiked
      ? { $pull: { likes: username } }
      : { $addToSet: { likes: username } };
    const updatedReel = await Reel.findByIdAndUpdate(id, update, { new: true });
    res.json(updatedReel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
