import React from 'react';
import './App.css';
import Navbar from './components/Navbar'
import Feature from './components/Feature'
import Categories from './components/Categories';
// import Register from './components/Register'
// import Member from './components/Memeber';
// import Reservation from './components/Reservation';
// import ReservationStatus from './components/ReservationStatus';
import Fine from './components/Fine';
// /

function App() {
  return (
    <div className="App">
      <Navbar />
      <Feature />
      <Categories />
      {/* <Register /> */}
       {/* <Member/> */}
       {/* <Reservation /> */}
       {/* <ReservationStatus /> */}
       {/* <Loan /> */}
       <Fine />
    </div>
  );
}

export default App;
