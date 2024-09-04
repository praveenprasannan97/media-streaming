import React, { useEffect, useState } from 'react';
import Navbar2 from './navbar2';
import bgi from '../images/bg.jpg';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Records from './records2';
import Pagination from './pagination';
import checkAuth from '../store/checkAuth';

function Watchlater(){
    var user = useSelector(store=>store.auth.user);
    var [movies, setMovies]=useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(4);
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = movies.slice(indexOfFirstRecord, indexOfLastRecord);
    const nPages = Math.ceil(movies.length / recordsPerPage)


    function fetchWatchlater() {
        if (!user) return;
        axios.post('http://127.0.0.1:8000/api/watchlater/',{email:user.email},{headers:{'Authorization':"Token "+ user.token}}).then(response=>{
            setMovies(response.data)
        })
    }

    useEffect(()=>{
        fetchWatchlater()
    },[movies])

    return(
        <div className="app" style={{ backgroundImage: `url(${bgi})` }}>
            <Navbar2/>
            <br></br>
            <div className="d-flex justify-content-center">
                <h1 className='text-white'>Watch later</h1>
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

export default checkAuth(Watchlater);