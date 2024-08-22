import React from 'react';
import Navbar1 from './navbar1';
import bgi from '../images/bg.jpg';
import {useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import axios from "axios";

function Resetpass() {
    const navigate = useNavigate();
    const { token } = useParams();
 
    const [password, setPassword] = useState("");
    const [passwordConf, setPasswordConf] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    function goToLogin(){
        if (password !== passwordConf) {
            setErrorMessage("Passwords do not match");
            return;
        }
        else
            axios.post('http://127.0.0.1:8000/api/reset/',{
                resettoken: token,
                password: password
            }).then(response=>{
                setErrorMessage('');
                navigate("/login");
            }).catch(error=>{
                if (error.response) {
                    if (error.response.data.errors) {
                        setErrorMessage(Object.values(error.response.data.errors).join(''));
                    } else if (error.response.data.message) {
                        setErrorMessage(error.response.data.message);
                    } else {
                        setErrorMessage('Failed to reset password. Please contact admin');
                    }
                } else if (error.request) {
                    setErrorMessage('No response from the server. Please try again later.');
                } else {
                    setErrorMessage('An error occurred. Please try again.');
                }
            })
    }
    return (
        <div className="app" style={{ backgroundImage: `url(${bgi})` }}>
        <Navbar1 />
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <div className='container mt-5'>
            <div className="container bg-white col-md-6 col-12 rounded-container">
                <h1>Reset Your Password</h1>
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                <div className="form-group mb-3">
                        <label>Password</label>
                        <input type="password" className="form-control" value={password} onInput={(event) => setPassword(event.target.value)} />
                    </div>
                    <div className="form-group mb-3">
                        <label>Confirm Password</label>
                        <input type="password" className="form-control" value={passwordConf} onInput={(event) => setPasswordConf(event.target.value)} />
                    </div>
                <div className="form-group mb-3">
                    <button className="btn btn-outline-primary float-right" onClick={goToLogin}>Reset Password</button>
                </div>
            </div>
        </div>
      </div>
    );
  }
  
  export default Resetpass;