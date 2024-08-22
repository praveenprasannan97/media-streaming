import React from 'react';
import Navbar1 from './navbar1';
import bgi from '../images/bg.jpg';
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react';

function Forgotpass() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    function sentmail(){
        axios.post('http://127.0.0.1:8000/api/forgotpass/',{
            email:email
        }).then(response=>{
            setErrorMessage('');
            navigate("/login");
        }).catch(error=>{
            if(error.response.data.errors){
                setErrorMessage(Object.values(error.response.data.errors).join(''))
            }else if(error.response.data.message){
                setErrorMessage(error.response.data.message)
            }else{
                setErrorMessage('Failed to reset password. Please contact admin')
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
                    <label>Email</label>
                    <input type="text" className="form-control" placeholder='Email' value={email} onInput={(event) => setEmail(event.target.value)} />
                </div>
                <div className="form-group mb-3">
                    <button className="btn btn-outline-primary float-right" onClick={sentmail}>Sent Email</button>
                </div>
                Go back to <Link to='/login'>Login</Link>
            </div>
        </div>
      </div>
    );
  }
  
  export default Forgotpass;