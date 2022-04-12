import React, { useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import PaymentPlanCard from './PaymentPlanCard';
import BillingModal from './BillingModal';

import {set_payment_plan} from '../auth/utils';



const SelectPaymentPlan = ({user, setPaymentPlan, currentPlan}) => {

    const [billingModal, setOpenBillingModal] = useState(false);
    const [clientSecret, setClientSecret] = useState();
    const [isClicked, setIsClicked] = useState(false)

    const select_plan = async () => {
        setIsClicked(true)
        const response = await set_payment_plan(currentPlan, true)
        setIsClicked(false)
        if(response.status === 200){
            const content = await response.json();
            console.log(content)
            setClientSecret(content['clientSecret'])
            setOpenBillingModal(true)
        }
        
    }

    const availablePlans = {
        0: {
            'name': 'Free',
            'price': 0
        },
        1: {
            'name': 'Per Day',
            'price': 50
        },
        2: {
            'name': 'Per Week',
            'price': 300
        },
        3: {
            'name': 'Per Month',
            'price': 1000
        }
    }

    const style = {
        position: 'absolute',
        display: 'flex',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: availablePlans.lenght * 300,
        height: 500,
        bgcolor: '#ffffff',
        border: '1px solid #000',
        boxShadow: 24,
        p: 6,
        flexGrow: 1
    };

    const cards = []
    for (let [index, plan] of Object.entries(availablePlans)) {
        cards.push(<PaymentPlanCard plan={plan} setPaymentPlan={setPaymentPlan} isChoosed={plan.name === currentPlan.name && plan.price === currentPlan.price}/>)
        }

    return (
        <Box sx={style}>
            <BillingModal user={user} openModal={billingModal} setOpen={setOpenBillingModal} client_secret={clientSecret}/>
            <Grid container spacing={2}>
                <Grid item xs={8}>
                    <h2>Available plans!</h2>
                </Grid>
                <Grid item xs={4}>
                </Grid>
                <Grid item xs={12} sx={{display: 'flex'}}>
                    {cards}
                </Grid>
                <Grid item xs={6}>
                    <Button variant="contained" onClick={select_plan}>OK!</Button>
                </Grid>
                <Grid item xs={6}>
                    {
                        isClicked && ! billingModal?
                        'loading...'
                        : null
                    }
                </Grid>
            </Grid>         
        </Box>
    )
}

export default SelectPaymentPlan;