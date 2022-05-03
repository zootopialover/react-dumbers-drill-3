import React from "react";

import PostText from "./PostText";
import PostButton from "./PostButton";

const Post = (props) => {
  let style = {
    margin: "10px",
    overflow: "hidden",
    textOverflow: "ellipsis"
  };
  return (
    <tbody>
      <tr style={style}>
        <td>
          <PostText text={props.text} width="400" />
        </td>
        <td>
          <PostText text={props.upvotesNum} width="100" color="blue" />
        </td>
        <td>{props.upvote ? "+" : "-"}</td>
        <td>
          <PostText text={props.author} width="20" color="blue" />
        </td>
        <td>
          <PostButton label="Upvote" handleClick={props.vote} />
        </td>
      </tr>
    </tbody>
  );
};

export default Post;
