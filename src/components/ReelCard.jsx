import { useRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { FaHeart, FaComment, FaShare, FaMusic } from "react-icons/fa";
import { likeReel } from "../features/reels/reelsSlice";
import "./ReelCard.css";

const ReelCard = ({ reel }) => {
  const dispatch = useDispatch();
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  // --- 1. DYNAMIC AUTH LOGIC ---
  // Grab the actual logged-in user from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const currentUsername = storedUser?.username || "Guest";

  // --- 2. DYNAMIC LIKE CHECK ---
  // Check if the current user's username exists in the reel's likes array
  const isLikedByMe = reel.likes?.includes(currentUsername);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoRef.current.play().catch(() => {}); // Catch play errors (browser policy)
            videoRef.current.muted = false;
            setPlaying(true);
          } else {
            videoRef.current.pause();
            videoRef.current.muted = true;
            setPlaying(false);
          }
        });
      },
      { threshold: 0.7 },
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  const handleVideoPress = () => {
    if (playing) {
      videoRef.current.pause();
      setPlaying(false);
    } else {
      videoRef.current.play();
      setPlaying(true);
    }
  };

  const handleLike = () => {
    // --- 3. DYNAMIC DISPATCH ---
    if (!storedUser) {
      alert("Please login to like reels!");
      return;
    }
    // Dispatch with the REAL username from localStorage
    dispatch(likeReel({ id: reel._id, username: currentUsername }));
  };

  return (
    <div className="reel-card">
      <video
        ref={videoRef}
        onClick={handleVideoPress}
        className="video-player"
        src={reel.videoUrl}
        loop
        playsInline
        muted
      />

      <div className="sidebar">
        <div className="action-item">
          <button
            onClick={handleLike}
            className={`icon-button ${isLikedByMe ? "liked" : ""}`}
          >
            <FaHeart size={28} />
          </button>
          <span>{reel.likes?.length || 0}</span>
        </div>

        <div className="action-item">
          <button className="icon-button">
            <FaComment size={28} />
          </button>
          <span>Chat</span>
        </div>

        <div className="action-item">
          <button className="icon-button">
            <FaShare size={28} />
          </button>
          <span>Share</span>
        </div>
      </div>

      <div className="bottom-overlay">
        {/* Shows the actual uploader's name from MongoDB */}
        <p className="username">@{reel.username}</p>
        <p className="caption">{reel.caption}</p>
        <div className="music-info">
          <FaMusic className="spinning-disk" />
          <span>{reel.username} • Original Audio</span>
        </div>
      </div>
    </div>
  );
};

export default ReelCard;
