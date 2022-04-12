import React, { useState, useRef, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import {useStripe, useElements, CardElement} from '@stripe/react-stripe-js';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';


export const CheckoutForm = ({user, client_secret, handleClose}) => {
    const stripe = useStripe();
    const elements = useElements();
  
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        const result = await stripe.confirmCardPayment(client_secret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {
                        name: user.name,
                    },
                }
        });

    
        if (result.error) {
            // Show error to your customer (for example, insufficient funds)
            console.log(result.error.message);
        } else {
            // The payment has been processed!
            if (result.paymentIntent.status === 'succeeded') {
                alert('success')  //TODO make success alert
                handleClose()
            }
        }
    };
  
    return (
        <form>
            <label>Card details</label>
            <CardElement className='mt-4 mb-4'/>
            <Button variant="contained" disabled={!stripe} onClick={handleSubmit}>Confirm order</Button>
        </form>
    );
  }


const BillingModal = ({user, setOpen, openModal, session_id, client_secret}) => {

    const handleClose = () => {
        setOpen(false);
    }
    const stripePromise = loadStripe(
        "pk_test_51KgrzbCGyC2siADwyVPp0sZRpwjkMDCrtaECpw43YQFF0O5CBZh1USuB76zQLsAzFLTkUWMjCa4FPIXgxjfCeJKe00fml4erhP"
        );

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500,
        height: 200,
        bgcolor: '#ffffff',
        boxShadow: 24,
        p: 3
    };

    return (
        <Modal
            open={openModal}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >   
            
            <Box sx={style}>
                <Elements stripe={stripePromise}>
                    <CheckoutForm user={user} session_id={session_id} client_secret={client_secret} handleClose={handleClose}/>
                </Elements>
            </Box>
        </Modal>
    )
}

export default BillingModal;