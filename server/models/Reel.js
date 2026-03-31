import mongoose from "mongoose";

const reelSchema = new mongoose.Schema(
  {
    videoUrl: { type: String, required: true },
    // 1. Remove the default "Sanoj_Dev" and make it required
    username: { type: String, required: true },
    // 2. (Optional but Recommended) Store the User ID for profile features later
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    caption: { type: String, default: "" },
    likes: { type: [String], default: [] },
  },
  { timestamps: true },
); // 3. Use timestamps instead of manual createdAt

export default mongoose.model("Reel", reelSchema);
