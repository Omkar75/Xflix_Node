import React, { useLayoutEffect } from "react";
import LandingPage from './components/LandingPage'
import "antd/dist/antd.css";
import { Route, Switch, useLocation } from "react-router-dom";
import Video from "./components/Video";

export const config = {
  endpoint: `http://3.7.199.238:8082/v1`,
};

export default function App(props) {
  const location = useLocation();
  useLayoutEffect(() => {
    window && window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="App">
      <Switch>
        <Route path="/:videoId">
          <Video />
        </Route>
        <Route path="/">
          <LandingPage />
        </Route>  
      </Switch>
    </div>
  );
}
