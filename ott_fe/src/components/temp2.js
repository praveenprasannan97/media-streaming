import React, { useState } from 'react';
import Navbar2 from './navbar2';
import bgi from '../images/bg.jpg';
import { useSelector } from 'react-redux';
import axios from 'axios';


function Myplan(){
    var user = useSelector(store=>store.auth.user);
    var [plans, setPlans]=useState([]);

    function fetchPlans(){
        axios.post('http://127.0.0.1:8000/api/myplans/',{},{headers:{'Authorization':"Token "+ user.token}}).then(response=>{
            setPlans(response.data)
        })
    }

    return(
        <div className="app" style={{ backgroundImage: `url(${bgi})` }}>
            <Navbar2/>
            <br></br>
            <div className="d-flex justify-content-center">
                <h1 className='text-white'>My Subscription Plan</h1>                
            </div>
            <div className="d-flex justify-content-center">
                <h3 className='text-white'>Current Plan</h3>
            </div>
            <div className='d-flex justify-content-center'>
                <div className='col-8 apph1'>
                    <table className='table table-light table-bordered'>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Duration</th>
                                <th>Price</th>
                                <th>Date</th>
                                <th>Expiry Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1 Month</td>
                                <td>30 Days</td>
                                <td>250 Rs</td>
                                <td>05-07-2024</td>
                                <td>04-08-2024</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="d-flex justify-content-center">
                <h3 className='text-white'>Subscription Plan History</h3>
            </div>
            <div className='d-flex justify-content-center'>
                <div className='col-8 apph1'>
                    <table className='table table-light table-bordered'>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Date</th>
                                <th>Invoice</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1 Month</td>
                                <td>250</td>
                                <td>05-07-2024</td>
                                <td><button className='btn btn-sm btn-outline-primary'>Download</button></td>
                            </tr>
                            <tr>
                                <td>6 Month</td>
                                <td>1500</td>
                                <td>11-01-2024</td>
                                <td><button className='btn btn-sm btn-outline-primary'>Download</button></td>
                            </tr>
                            <tr>
                                <td>3 Month</td>
                                <td>750</td>
                                <td>14-10-2023</td>
                                <td><button className='btn btn-sm btn-outline-primary'>Download</button></td>
                            </tr>
                            <tr>
                                <td>1 Month</td>
                                <td>250</td>
                                <td>15-09-2023</td>
                                <td><button className='btn btn-sm btn-outline-primary'>Download</button></td>
                            </tr>
                            <tr>
                                <td>1 Month</td>
                                <td>250</td>
                                <td>16-08-2023</td>
                                <td><button className='btn btn-sm btn-outline-primary'>Download</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Myplan;