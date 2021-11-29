import React, { useState, useRef, useEffect, Fragment } from "react";
import store from "./app/store";
import { Provider } from "react-redux";
import FeedingSchedule from './app/main/Feeding-Schedule/Feeding-Schedule'
import FarmManagement from './app/main/Farm-Management/Farm-Management'
import FoodManagement from './app/main/Food-Management/Food-Management'
import ScheduledManagement from './app/main/Scheduled-Management/Scheduled-Management'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { createBrowserHistory } from 'history'
const history = createBrowserHistory();

function App() {
  return (
    <Provider store={store}>
      <Router history={history}>
        <Routes>
          <Route exact path="/" element={<FeedingSchedule />} />
          <Route exact path="/farms" element={<FarmManagement />} />
          <Route exact path="/foods" element={<FoodManagement />} />
          <Route exact path="/schedules" element={<ScheduledManagement />} />
          <Route path="/*" component={() => 'NOT FOUND'} />
        </Routes>
      </Router>
    </Provider>
  );
}


export default App;
