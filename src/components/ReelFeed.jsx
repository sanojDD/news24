import { useSelector } from "react-redux";
import ReelCard from "./ReelCard";
import "./ReelFeed.css";

const ReelFeed = () => {
  const { reels } = useSelector((state) => state.reels);

  return (
    <div className="reels-container">
      {reels && reels.length > 0 ? (
        reels.map((reel) => <ReelCard key={reel._id || reel.id} reel={reel} />)
      ) : (
        <div className="no-reels">
          <p>No reels found. Be the first to post!</p>
        </div>
      )}
    </div>
  );
};

export default ReelFeed;
