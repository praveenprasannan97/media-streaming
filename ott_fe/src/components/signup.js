import React, { useState } from 'react';
import Navbar1 from './navbar1';
import bgi from '../images/bg.jpg';
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConf, setPasswordConf] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const registerUser = async () => {
        if (password !== passwordConf) {
            setErrorMessage("Passwords do not match");
            return;
        }

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/signup/', {
                user_name: username,
                email: email,
                password: password,
            });
            navigate('/login');
        } catch (error) {
            setErrorMessage("Signup failed. Try again.");
        }
    };

    return (
        <div className="app" style={{ backgroundImage: `url(${bgi})` }}>
            <Navbar1 />
            <div className='container mt-5'>
                <div className="container bg-white col-md-6 col-12 rounded-container">
                    <h1>Signup</h1>
                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                    <div className="form-group mb-3">
                        <label>User Name</label>
                        <input type="text" className="form-control" value={username} onInput={(event) => setUsername(event.target.value)} />
                    </div>
                    <div className="form-group mb-3">
                        <label>Email</label>
                        <input type="email" className="form-control" value={email} onInput={(event) => setEmail(event.target.value)} />
                    </div>
                    <div className="form-group mb-3">
                        <label>Password</label>
                        <input type="password" className="form-control" value={password} onInput={(event) => setPassword(event.target.value)} />
                    </div>
                    <div className="form-group mb-3">
                        <label>Confirm Password</label>
                        <input type="password" className="form-control" value={passwordConf} onInput={(event) => setPasswordConf(event.target.value)} />
                    </div>
                    <div className="form-group mb-3">
                        <button className="btn btn-outline-primary float-right" onClick={registerUser}>Signup</button>
                    </div>
                    <span>Already have an account? </span><Link to='/login'>Login Here</Link>
                </div>
            </div>
        </div>
    );
}

export default Signup;
