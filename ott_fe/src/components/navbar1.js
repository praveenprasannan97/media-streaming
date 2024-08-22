import React from 'react';
import { Link } from 'react-router-dom';
function Navbar1() {
  return (
    <nav className="navbar navbar-expand-lg bg-dark">
      <div className="container-fluid">
        <h1 className="navbar-brand fs-2 text-white">Movie Time</h1>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <i className="fa fa-bars" style={{color:'white'}}></i>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link text-white ms-3" to={'/'}>Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white ms-3" to={'/login'}>Login</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white ms-3" to={'/signup'}>Signup</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar1;