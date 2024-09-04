import Navbar2 from './navbar2';
import bgi from '../images/bg.jpg';
import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import {useSelector } from 'react-redux';
import checkAuth from '../store/checkAuth';
import axios from 'axios';

function Playmovie(){
    var user = useSelector(store => store.auth.user);
    const { moviepk } = useParams();
    const [movies, setMovies] = useState([]);
    const [hasStarted, setHasStarted] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        fetchMovies();
    }, [user.token]);   // [moviepk, user.token]);

    function fetchMovies() {
        if (!user) return;
        axios.post('http://127.0.0.1:8000/api/viewmovie/', { moviepk }, {
            headers: {
                'Authorization': `Token ${user.token}`,
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            setMovies(response.data);
        })
        .catch(error => {
            console.error('There was an error!', error);
            if (error.response && error.response.status === 401) {
                console.error('Unauthorized access - perhaps the token is invalid or expired');
                navigate('/login');
            }
        });
    }
    function handleVideoPlay() {
        if (!hasStarted) {
            setHasStarted(true);
            axios.post('http://127.0.0.1:8000/api/playmovie/', { moviepk }, {
                headers: {
                    'Authorization': `Token ${user.token}`,
                    'Content-Type': 'application/json',
                }
            })
        }
    }

    return(
        <div className="app" style={{ backgroundImage: `url(${bgi})` }}>
            <Navbar2/>
            <br></br>
            <div className='d-flex justify-content-center text-white'>
                {movies.length > 0 && <h2>{movies[0].movie_name}</h2>}
            </div>
            <br></br>
            <div className="d-flex justify-content-center">
                <video width="1280" height="720" controls onPlay={handleVideoPlay}>
                {movies.length > 0 && <source src={`http://127.0.0.1:8000/${movies[0].movie_video}`}  type="video/mp4"/>}
                    Your browser does not support the video tag.
                </video> 
            </div>
        </div>
    );
}

export default checkAuth(Playmovie);