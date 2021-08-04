import React from "react";
import { Router, Route, Switch } from "react-router";
import { createBrowserHistory } from "history";
// import PrivateRoute from "./PrivateRoute";
// import PublicRoute from "./PublicRoute";

import Spiral from "../components/Spiral";
import Dashboard from "../components/Dashboard";
import Search from "../components/Search";
import Portfolio from "../components/Portfolio";

export const history = createBrowserHistory();

const AppRouter = (props) => {
  return (
    <Router history={history}>
      <Switch>
        <Route
          path="/spiral/:protocol/:metric"
          exact={true}
          component={Spiral}
        />
        <Route path="/" component={Dashboard} exact={true} />
        <Route path="/search" component={Search} exact={true} />
        <Route path="/search/:address" component={Search} exact={true} />
        <Route path="/search/top-address" component={Search} exact={true} />
      </Switch>
    </Router>
  );
};

export default AppRouter;
