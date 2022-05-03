import React from "react";

import Post from "./Post";

const PostList = (props) => {
  return (
    <table style={{ width: "100%" }}>
      {Object.keys(props.nodes).map((sId) => {
        const node = props.nodes[sId];
        return (
          <Post
            key={sId}
            text={node.text}
            author={node.author}
            upvote={node.upvote}
            upvotesNum={node.upvotesNum}
            vote={() => props.vote(sId)}
          />
        );
      })}
    </table>
  );
};

export default PostList;
