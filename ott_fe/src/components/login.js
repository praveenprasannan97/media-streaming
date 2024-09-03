import React, { useState } from 'react';
import Navbar1 from './navbar1';
import bgi from '../images/bg.jpg';
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { setUser } from '../store/authSlice';
import { useDispatch } from "react-redux";
import checkGuest from '../store/checkGuest';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    function attemptLogin() {
        axios.post('http://127.0.0.1:8000/api/login/',{
            email:email,
            password:password
        }).then(response=>{
            setErrorMessage('')
            var user = {
                email:email,
                token:response.data.token
            }
            dispatch(setUser(user));
            navigate("/movielist");
        }).catch(error=>{
            if(error.response.data.errors){
                setErrorMessage(Object.values(error.response.data.errors).join(''))
            }else if(error.response.data.message){
                setErrorMessage(error.response.data.message)
            }else{
                setErrorMessage('Failed to login user. Please contact admin')
            }
        })
    }

    return (
        <div className="app" style={{ backgroundImage: `url(${bgi})` }}>
            <Navbar1 />
            <div className='container mt-5'>
                <div className="container bg-white col-md-6 col-12 rounded-container">
                    <h1>Login</h1>
                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                    <div className="form-group mb-3">
                        <label>Email</label>
                        <input type="text" className="form-control" placeholder='Email' value={email} onInput={(event) => setEmail(event.target.value)} />
                    </div>
                    <div className="form-group mb-3">
                        <label>Password</label>
                        <input type="password" className="form-control" placeholder='Password' value={password} onInput={(event) => setPassword(event.target.value)} />
                    </div>
                    <div className="form-group mb-3">
                        <button className="btn btn-outline-primary float-right" onClick={attemptLogin}>Login</button>
                    </div>
                    <Link to='/forgotpass'>Forgot Password</Link>
                </div>
            </div>
        </div>
    );
}

export default checkGuest(Login);
