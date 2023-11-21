import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Feature from './components/Feature';
import Member from './components/Memeber';
import Reservation from './components/Reservation';
import ReservationStatus from './components/ReservationStatus';
import Fine from './components/Fine';
import Join from './components/Join';  // assuming you have a Join component
import SignIn from './components/SignIn';  // assuming you have a SignIn component
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the user is authenticated, for example by verifying a token in localStorage
    const token = localStorage.getItem('token');
    setAuthenticated(!!token);
  }, []);

  return (
    <Router>
      <div className="App">
        <Navbar authenticated={authenticated} setAuthenticated={setAuthenticated} />
        <Routes>
        <Route
                            exact
                            path="/"
                            element={<Feature/>}
                        ></Route>
          <Route
            path="/join"
            element={<Join onJoinSuccess={() => setAuthenticated(true)} />}
          ></Route>
          <Route
            path="/signin"
            element={<SignIn onSignInSuccess={() => setAuthenticated(true)} />}
          ></Route>
          <Route
            path="/Member"
            element={authenticated ? <Member /> : <Navigate to="/join" />}
          ></Route>
          <Route
            path="/Reservation"
            element={authenticated ? <Reservation /> : <Navigate to="/join" />}
          ></Route>
          <Route
            path="/ReservationStatus"
            element={authenticated ? <ReservationStatus /> : <Navigate to="/join" />}
          ></Route>
          <Route
            path="/Fine"
            element={authenticated ? <Fine /> : <Navigate to="/join" />}
          ></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
