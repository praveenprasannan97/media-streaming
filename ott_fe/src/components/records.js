import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useSelector } from 'react-redux'

const Records = ({data}) => {
    var user = useSelector(store=>store.auth.user);
    const [errorMessage, setErrorMessage] = useState("");

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
    
  return (  
    <div className='row container'>
        {data.map(movie => (
            <div className='col-3'>
                <div key={movie.id} className="card" style={{ width: '300px', height:'450px'}}>
                    <img
                        src= {`http://127.0.0.1:8000/${movie.movie_thumbnail}`}
                        className="card-img-top"
                        alt="Placeholder" height={'50%'} width={'90%'}
                    />
                    <div className="card-body">
                        <h5 className="card-title">{movie.movie_name}</h5>
                        <p className="card-text" height={'10%'} >{movie.movie_description}</p>
                        <p>Rating: {movie.movie_rating} <i className="fa fa-star"></i></p>
                    </div>
                    <div className='card-footer'>
                    <Link className='btn btn-outline-primary' to={`/viewmovie/${movie.id}`}>View</Link>
                    <a> </a>
                    <button className='btn btn-outline-primary' onClick={() => addlater(user.email, movie.id)}>Watch later</button>
                    </div>
                </div>
            </div>
        ))}
    </div>
  ) 
}

export default Records  