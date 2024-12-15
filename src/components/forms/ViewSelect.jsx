import { useState } from "react";

const ViewSelect = ({ viewType, setViewType }) => {
  return (
    <div className="view-select-wrapper">
      <button
        className={viewType === "square" ? "selected" : ""}
        onClick={() => setViewType("square")}
      >
        <img src="https://cdn4.iconfinder.com/data/icons/176-material-design-outline-core/24/apps-512.png" />
      </button>
      <button
        className={viewType === "card" ? "selected" : ""}
        onClick={() => setViewType("card")}
      >
        <img src="https://cdn.iconscout.com/icon/free/png-256/free-storyboard-icon-download-in-svg-png-gif-file-formats--list-card-detail-vlogger-and-video-platform-pack-entertainment-icons-1222283.png" />
      </button>
      <button
        className={viewType === "row" ? "selected" : ""}
        onClick={() => setViewType("row")}
      >
        <img src="https://static.thenounproject.com/png/2250454-200.png" />
      </button>
      <button
        className={viewType === "page" ? "selected" : ""}
        onClick={() => setViewType("page")}
      >
        <img src="https://static.thenounproject.com/png/2250454-200.png" />
      </button>
    </div>
  );
};

export default ViewSelect;
