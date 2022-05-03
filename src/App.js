//

import React from "react";

import { RecoilRoot } from "recoil";

import Nodes from "./Components/Nodes";

const App = (props) => {
  return (
    <RecoilRoot>
      <Nodes />
    </RecoilRoot>
  );
};

export default App;
