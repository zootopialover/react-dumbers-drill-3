import React from "react";

const PostButton = (props) => {
  let style = {
    width: 70,
    height: 20,
    color: "green"
  };
  return (
    <button style={style} onClick={() => props.handleClick()}>
      {props.label}
    </button>
  );
};

export default PostButton;
