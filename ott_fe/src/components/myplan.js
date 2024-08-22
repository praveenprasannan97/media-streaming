import React, { useEffect, useState } from 'react';
import Navbar2 from './navbar2';
import bgi from '../images/bg.jpg';
import { useSelector } from 'react-redux';
import axios from 'axios';
import checkAuth from '../store/checkAuth';

function Myplan() {
    var user = useSelector(store => store.auth.user);
    var [plans, setPlans] = useState([]);

    useEffect(() => {
        fetchPlans();
    }, []);

    function fetchPlans() {
        axios.post('http://127.0.0.1:8000/api/myplans/', {}, { headers: { 'Authorization': "Token " + user.token } })
            .then(response => {
                setPlans(response.data);
            });
    }

    const latestPlan = plans.length > 0 ? plans[0] : null;

    return (
        <div className="app" style={{ backgroundImage: `url(${bgi})` }}>
            <Navbar2 />
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
                            {latestPlan && (
                                <tr>
                                    <td>{latestPlan.plan_name}</td>
                                    <td>{latestPlan.plan_duration} Days</td>
                                    <td>{latestPlan.plan_price} Rs</td>
                                    <td>{new Date(latestPlan.date).toLocaleDateString()}</td>
                                    <td>{new Date(latestPlan.expiry).toLocaleDateString()}</td>
                                </tr>
                            )}
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
                            {plans.map((plan, index) => (
                                <tr key={index}>
                                    <td>{plan.plan_name}</td>
                                    <td>{plan.plan_price}</td>
                                    <td>{new Date(plan.date).toLocaleDateString()}</td>
                                    <td><button className='btn btn-sm btn-outline-primary'>Download</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default checkAuth(Myplan);
