import React from "react";

const HighlightedText = ({ text, color }) => {
  return <div className={`highlighted-text ${color}`}>{text}</div>;
};

export default HighlightedText;
