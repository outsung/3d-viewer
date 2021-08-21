import React from "react";
import { Router, Switch, Route } from "react-router-dom";

import UploadScreen from "../Screen/Upload";
import history from "../utils/browserHistory";

export default function Routes() {
  return (
    <Router history={history}>
      <Switch>
        <Route exact path="/upload" component={UploadScreen} />
      </Switch>
    </Router>
  );
}
