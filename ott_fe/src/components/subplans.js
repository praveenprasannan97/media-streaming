import React from 'react';
import Navbar2 from './navbar2';
import bgi from '../images/bg.jpg';
import axios from 'axios';
import checkAuth from '../store/checkAuth';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

function Subplans(){
    var user = useSelector(store=>store.auth.user);
    var [plans, setPlans]=useState([]);
    useEffect(()=>{
        fetchPlan()
    },[])
    function fetchPlan(){
        axios.post('http://127.0.0.1:8000/api/viewplans/',{},{headers:{'Authorization':"Token "+ user.token}}).then(response=>{
            setPlans(response.data)
        })
    }
    return(
        <div className="app" style={{ backgroundImage: `url(${bgi})` }}>
            <Navbar2/>
            <br></br>
            <div className="d-flex justify-content-center">
                <h1 className='text-white'>Subscription Plans</h1>
            </div>
            <br></br>
            <br></br>
            <div className='container d-flex justify-content-center'>
                {plans.map(plan => (
                    <div className='col-4'>
                        <div key={plan.id} className="card" style={{ width: '300px', height:'300px'}}>
                            <div className='card-header'>
                                <h5 className="card-title">{plan.plan_name}</h5>
                            </div>
                            <div className="card-body">
                                <p className="card-text" height={'10%'} >{plan.plan_description}</p>
                                <p>{plan.plan_duration} Days</p>
                                <p>{plan.plan_price} </p>
                            </div>
                            <div className='card-footer'>
                            <a className='btn btn-outline-primary'>Subscribe</a>
                            </div>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
}

export default checkAuth(Subplans);