import { useSelector } from "react-redux";
import ReelCard from "./ReelCard";
import "./ReelFeed.css";

const ReelFeed = () => {
  const { reels } = useSelector((state) => state.reels);
  console.log("Current Reels in Feed:", reels);

  return (
    <div className="reels-container">
      {reels.map((reel) => (
        <ReelCard key={reel.id} reel={reel} />
      ))}
    </div>
  );
};

export default ReelFeed;
