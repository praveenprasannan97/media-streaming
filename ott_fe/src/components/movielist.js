import React, { useEffect } from 'react';
import Navbar2 from './navbar2';
import bgi from '../images/bg.jpg';
import checkAuth from '../store/checkAuth';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import axios from 'axios';
import Records from './records';
import Pagination from './pagination';

function MovieList(){
    var user = useSelector(store=>store.auth.user);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(4);
    var [movies, setMovies]=useState([]);
    const [searchquery, setSearchquery] = useState("");


    function fetchMovies(){
        if (!user) return;
        axios.post('http://127.0.0.1:8000/api/movielist/',{},{headers:{'Authorization':"Token "+ user.token}}).then(response=>{
            setMovies(response.data)
            setLoading(false);
        })
    }
    function listfilter() {
        axios.post('http://127.0.0.1:8000/api/movielist/',{searchquery:searchquery},{headers:{'Authorization':"Token "+ user.token}}).then(response=>{
            setMovies(response.data)
            setLoading(false);
        })
    }
    useEffect(()=>{
        fetchMovies()
    })

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = movies.slice(indexOfFirstRecord, indexOfLastRecord);
    const nPages = Math.ceil(movies.length / recordsPerPage)

    return(
        <div className="app" style={{ backgroundImage: `url(${bgi})` }}>
            <Navbar2/>
            <br></br>
            <div className="d-flex justify-content-center">
                <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4">
                    <div className="input-group">
                        <input type="text" className="form-control" placeholder='Search' value={searchquery} 
                        onKeyDown={(event) => { if (event.key === 'Enter') { listfilter();}}}
                        onInput={(event) => setSearchquery(event.target.value)} ></input>
                        <button className="btn btn-dark" type="button" id="button-addon2" onClick={listfilter}>Search</button>
                    </div>
                </div>
            </div>
            <br></br>
            <br></br>
            <div className='d-flex justify-content-center'>
                <Records data={currentRecords}/>
            </div>
            <div className='d-flex justify-content-center mt-5'>
                <Pagination
                    nPages={nPages}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
            </div>

        </div>
    );
}

export default checkAuth(MovieList);