import React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';

import NumberFormatCustom from './NumberFormatInput'

import {delete_bill} from '../utils';


export default function EditBill(props) {

    const deleteBill = async () => {
        let isDelete = window.confirm('Do you want to delete this bill?');
            if(isDelete === true){
                await delete_bill(props.bill.uuid);
                window.location.reload();
            }
    }

    return (
        <form ref={props.formRef}>
            <Box sx={{ '& button': { m: 1 } }}>
                <div className="m-5">
                    <TextField
                        id="standard-required"
                        label="Name"
                        defaultValue={props.bill.name}
                        variant="standard"
                        onChange={e => props.setNewName(e.target.value)}
                    />
                </div>

                <div className="m-5">
                    <TextField
                        label="Balance"
                        defaultValue={props.convertedBalance}
                        onChange={e => props.setNewBalance(e.target.value)}
                        name={props.settings.currency.char}
                        id="formatted-numberformat-input"
                        InputProps={{
                        inputComponent: NumberFormatCustom,
                        }}
                        variant="standard"
                    />
                </div>
                <Button variant="outlined" startIcon={<DeleteIcon />} color="error" onClick={deleteBill}>
                    Delete
                </Button>
            </Box>
        </form>
    );
}