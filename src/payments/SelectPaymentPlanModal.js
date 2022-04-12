import React from 'react';
import Modal from '@mui/material/Modal';

import SelectPaymentPlan from './SelectPaymentPlan'


const SelectPaymentPlanModal = ({user, setPaymentPlan, setOpen, openModal, currentPlan}) => {

    const handleClose = () => {
        setOpen(false);
    }


    return (
        <Modal
            open={openModal}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >   
            <SelectPaymentPlan user={user} setPaymentPlan={setPaymentPlan} currentPlan={currentPlan}/>
        </Modal>
    )
}

export default SelectPaymentPlanModal;