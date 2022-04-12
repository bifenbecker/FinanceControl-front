import React, { useState, useRef } from 'react';
import Box from '@mui/material/Box';


const style = {
    width: 175,
    height: 250,
    bgcolor: '#ffffff',
    border: '2px solid #52c9ff',
    // borderColor: '#52c9ff',
    boxShadow: 24,
    p: 5,
    m: 3,
    '&:hover':{
        borderColor: '#1dfab6',
    }
    
};

const choosedStyle = {
    width: 175,
    height: 250,
    bgcolor: '#bffde5',
    border: '2px solid #52c9ff',
    boxShadow: 24,
    p: 5,
    m: 3,
    '&:hover':{
        borderColor: '#1dfab6',
    }
    
};


const PaymentPlanCard = ({plan, setPaymentPlan, isChoosed}) => {

    const click = () => {
        setPaymentPlan(plan)
        isChoosed = true
    }

    return (
        <Box sx={isChoosed? choosedStyle : style} onClick={click}>
            <div>
                {plan.name}
            </div>
            <div className='mt-5'>
                {plan.price / 100}$
            </div>
        </Box>
    )
}

export default PaymentPlanCard;