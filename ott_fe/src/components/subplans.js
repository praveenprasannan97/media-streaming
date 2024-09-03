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
    var [order, setOrder]=useState([]);
    var [plans, setPlans]=useState([]);
    useEffect(()=>{
        fetchPlan()
        console.log(order)
    },[order])
    function fetchPlan(){
        axios.post('http://127.0.0.1:8000/api/viewplans/',{},{headers:{'Authorization':"Token "+ user.token}}).then(response=>{
            setPlans(response.data)
        })
    }

    function plan_order(email,plan_id){
        axios.post('http://127.0.0.1:8000/api/planorder/',{email,plan_id},{headers:{'Authorization':"Token "+ user.token}}).then(response=>{
            setOrder(response.data);
            initiateRazorpayPayment(response.data);
        })
    } 
    function initiateRazorpayPayment(orderDetails){
        var options = {
            "key": "", // Enter the Key ID generated from the Dashboard
            "amount": orderDetails.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            "currency": "INR",
            "name": "Acme Corp",
            "description": "Test Transaction",
            "image": "https://example.com/your_logo",
            "order_id": orderDetails.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            "handler": function (response){
                // alert(response.razorpay_payment_id);
                // alert(response.razorpay_order_id);
                // alert(response.razorpay_signature);
                axios.post('http://127.0.0.1:8000/api/purchase/',{razorpay_payment_id:response.razorpay_payment_id,razorpay_order_id:response.razorpay_order_id,razorpay_signature:response.razorpay_signature}
                    ,{headers:{'Authorization':"Token "+ user.token}}).then(response=>{
                    console.log('axios purchase verify')
                })
            },
            "prefill": {
                "name": "Gaurav Kumar",
                "email": "gaurav.kumar@example.com",
                "contact": "9000090000"
            },
            "notes": {
                "address": "Razorpay Corporate Office"
            },
            "theme": {
                "color": "#3399cc"
            }
        };
        var rzp1 = new window.Razorpay(options);
        rzp1.open('payment.failed', function (response){
            alert(response.error.code);
            alert(response.error.description);
            alert(response.error.source);
            alert(response.error.step);
            alert(response.error.reason);
            alert(response.error.metadata.order_id);
            alert(response.error.metadata.payment_id);
        });
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
                                <p>{plan.plan_price} ₹</p>
                            </div>
                            <div className='card-footer'>
                            <a className='btn btn-outline-primary' onClick={() => plan_order(user.email, plan.id)}>Subscribe</a>
                            </div>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
}

export default checkAuth(Subplans);