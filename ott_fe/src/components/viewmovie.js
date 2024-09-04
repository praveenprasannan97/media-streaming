import React, { useEffect, useState } from 'react';
import Navbar2 from './navbar2';
import bgi from '../images/bg.jpg';
import checkAuth from '../store/checkAuth';
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from 'react-redux';
import axios from 'axios';

function Viewmovie(){
    var user = useSelector(store => store.auth.user);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const { moviepk } = useParams();
    const [movies, setMovies] = useState([]);


    useEffect(() => {
        fetchMovies();
    }, []);  //[moviepk, user.token]);

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
                console.error('Unauthorized access');
                navigate('/login');
            }
        });
    }

    function addlater(email, movie_id){
        axios.post('http://127.0.0.1:8000/api/addwatchlater/',{email, movie_id},{headers:{'Authorization':"Token "+ user.token}
        }).then(response=>{
            setErrorMessage('');
        }).catch(error=>{
            if (error.response) {
                if (error.response.data.errors) {
                    setErrorMessage(Object.values(error.response.data.errors).join(''));
                } else if (error.response.data.message) {
                    setErrorMessage(error.response.data.message);
                } else {
                    setErrorMessage('Failed add movie to watch later');
                }
            } else if (error.request) {
                setErrorMessage('No response from the server. Please try again later.');
            } else {
                setErrorMessage('An error occurred. Please try again.');
            }
        })
    }


    function playMovie(){
        if (movies.length > 0) {
            navigate(`/playmovie/${movies[0].id}`);
        }
    }

    return (
        <div className="app" style={{ backgroundImage: `url(${bgi})` }}>
            <Navbar2/>
            <br/>
            <div className="d-flex justify-content-center">
                <div className='row'>
                    <div className='col-1'></div>
                    <div className='col-6 text-white'>
                        <br/><br/><br/><br/><br/><br/>
                        <p>Name</p>
                        {movies.length > 0 && <h2>{movies[0].movie_name}</h2>}
                        <p>Description</p>
                        {movies.length > 0 && <h4>{movies[0].movie_description}</h4>}
                        {movies.length > 0 && (
                            <img 
                                src={`http://127.0.0.1:8000/${movies[0].movie_thumbnail}`} 
                                alt="Movie Thumbnail" 
                                style={{ width: '18rem', height:'21rem', marginTop:'10px' }} 
                            />
                        )}
                    </div>
                    <div className='col-2'></div>
                    <div className='col-2 text-white'>
                        <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
                        <button className='btn btn-primary' onClick={playMovie}>Play Movie</button>
                        <br/><br/>
                        {movies.length > 0 && <button className='btn btn-primary' onClick={() => addlater(user.email, movies[0].id)}>Watch Later</button>}
                        <br/><br/>
                        <div className="input-group flex-nowrap">
                            <span className="input-group-text" id="addon-wrapping">Rating</span>
                            <input 
                                type="number" 
                                className="form-control" 
                                aria-describedby="addon-wrapping" 
                                min="0" max="5" 
                            />
                            <span className="input-group-text" id="addon-wrapping"><i className="fa fa-star"></i></span>
                            <button className="btn btn-primary" type="button" id="button-addon2">Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default checkAuth(Viewmovie);
