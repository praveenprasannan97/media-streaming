import React from 'react';
import axios from "axios";
import { useDispatch } from "react-redux";
import { useSelector } from 'react-redux';
import { removeUser } from '../store/authSlice';
import { Link, useNavigate } from 'react-router-dom';
// import { setUserFromLocalStorage } from '../store/authSlice';
function Navbar2() {
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  var user = useSelector(store=>store.auth.user);

  function authlogout() {
    if(user){
            
            axios.post('http://127.0.0.1:8000/api/logout/',{},{headers:{'Authorization':"Token "+ user.token}});
            dispatch(removeUser());
            navigate('/login');
    }
    }
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
              <Link className="nav-link text-white ms-3" to={'/movielist'}>Movies</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white ms-3" to={'/subplans'}>Subscription Plans</Link>
            </li>
            <li className="nav-item dropdown ms-3">
                <a className="nav-link dropdown-toggle text-white" role="button" data-bs-toggle="dropdown" aria-expanded="false" style={{color:'white'}}>
                    <i className="fa fa-bars"></i>
                </a>
                <ul className="dropdown-menu bg-dark">
                    <li><Link className="nav-link text-white ms-3" to={'/watchlater'}>Watch later</Link></li>
                    <li><hr className="dropdown-divider"></hr></li>
                    <li><Link className="nav-link text-white ms-3" to={'/history'}>History</Link></li>
                    <li><hr className="dropdown-divider"></hr></li>
                    <li><Link className="nav-link text-white ms-3" to={'/changepass'}>Change Password</Link></li>
                </ul>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white ms-3" to={'/myplan'}>My Plan</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white ms-3" onClick={authlogout}>Logout</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar2;