import React, { useLayoutEffect } from "react";
import LandingPage from './components/LandingPage'
import "antd/dist/antd.css";
import { Route, Switch, useLocation } from "react-router-dom";
import Video from "./components/Video";

export const config = {
  endpoint: `https://9757cb93-90e2-4371-9c0d-4e0fd13fba76.mock.pstmn.io/v1`,
};

export default function App(props) {
  const location = useLocation();
  // Scroll to top if path changes
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
