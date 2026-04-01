import { useState } from "react";
import { FaPlus, FaCloudUploadAlt, FaTimes } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { postNewReel } from "../features/reels/reelsSlice";
import "./AddReel.css";

const AddReel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user")) || {};

  // --- 1. REMOVED handleUploadSuccess (Logic is now in handleUpload) ---

  const closeOverlay = () => {
    setIsOpen(false);
    setVideoFile(null);
    setPreviewUrl("");
    setCaption("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.includes("video")) {
      setVideoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!user.username) {
      alert("Please login first to upload a reel!");
      return;
    }
    if (!videoFile) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", videoFile);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
    );

    try {
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await response.json();

      if (data.secure_url) {
        // --- 2. INTEGRATED DATABASE SAVE LOGIC ---
        const reelData = {
          videoUrl: data.secure_url,
          caption: caption || "Check out my new reel! #tuktuk",
          username: user.username, // <--- Add this!
          userId: user.id,
        };

        // Dispatch the Thunk to save to MongoDB
        await dispatch(postNewReel(reelData)).unwrap();

        console.log("✅ Reel saved successfully!");
        alert("Post successful!");
        closeOverlay();
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Something went wrong. Is your backend server running?");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <button className="fab-button" onClick={() => setIsOpen(true)}>
        <FaPlus size={24} />
      </button>

      {isOpen && (
        <div className="upload-overlay">
          <div className="upload-modal">
            <button className="close-btn" onClick={closeOverlay}>
              <FaTimes size={20} />
            </button>
            <h2 className="text-white text-center font-bold mb-4">
              Upload New Reel
            </h2>

            {!previewUrl ? (
              <label className="drop-zone cursor-pointer">
                <FaCloudUploadAlt size={50} className="text-white/50" />
                <span className="text-white/70">Select Video</span>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  hidden
                />
              </label>
            ) : (
              <div className="preview-container">
                <video
                  src={previewUrl}
                  controls
                  className="mini-preview rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Add a caption..."
                  className="caption-input mt-4 w-full p-2 bg-white/10 text-white rounded"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className={`upload-submit-btn mt-4 w-full py-2 rounded font-bold text-white ${
                    isUploading ? "bg-gray-600" : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {isUploading ? "Uploading..." : "Post to TukTuk"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AddReel;
