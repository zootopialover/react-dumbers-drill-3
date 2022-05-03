import React from "react";

const PostText = (props) => {
  let style = {
    width: props.width,
    marginRight: "10px"
  };
  return <div style={style}>{props.text}</div>;
};

export default PostText;
