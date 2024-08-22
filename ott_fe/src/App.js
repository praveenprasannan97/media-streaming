import React from 'react';
import './App.css';
import Navbar1 from './components/navbar1';
import bgi from './images/bg.jpg' ;

function App() {
  return (
    <div className="app" style={{ backgroundImage: `url(${bgi})` }}>
      <Navbar1 />
      <div className='container-fluid row justify-content-center mt-5'>
        <div className='col-8'>
          <div className="content apph1">
            <br></br>
            <h1>Welcome to Movie Time</h1>
            <br></br>
            <br></br>
            <p>
              Movie Time is a top OTT streaming platform that offers a wide range of movies in various genres and languages. With a user-friendly interface, 
              subscribers can easily stream high-definition content on any device, anytime and anywhere. Making it the perfect destination for anyone looking 
              for the latest blockbusters.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
