import React, {useState, useEffect} from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Tab from '@mui/material/Tab';

import ChooseCategoryModal from './ChooseCategoryModal';
import ChooseBillModal from './ChooseBillModal';
import NumberFormatCustom from './NumberFormatInput';

import {category_list, bill_list, add_operation, transfer_bill, convertValue} from '../utils'


export default function AddOperation(props) {
    const [navValue, setNavValue] = useState('1');
    const [isIncome, setIsIncome] = useState(false);
    const [value, setValue] = useState(0.0);
    const [category, setCategory] = useState();
    const [categoryList, setCategoryList] = useState();
    const [billList, setBillList] = useState();
    const [bill, setBill] = useState(props.bill);
    const [date, setDate] = useState(new Date());
    const [description, setDescription] = useState('');
    const [error, setError] = useState();

    const [transferValue, setTransferValue] = useState(0.0);
    const [transferBillFrom, setTransferBillFrom] = useState();
    const [transferBillTo, setTransferBillTo] = useState();

    const [openChooseCategoryModal, setChooseCategoryModal] = React.useState(false);
    const [openChooseBillModal, setChooseBillModal] = React.useState(false);
    const [openChooseBillFromModal, setChooseBillFromModal] = React.useState(false);
    const [openChooseBillToModal, setChooseBillToModal] = React.useState(false);

    const [isSendRequest, setIsSendRequest] = useState(false);
    
    const submit = async () => {
        if(bill !== undefined) {
            
            const response = await add_operation({
                category: category.id,
                description,
                value,
                isIncome,
            }, bill.uuid);
            if(response !== undefined){
                props.handleClose();
                setError(undefined);
            }
            else{
                setError('No success of adding operation');
            }
            
        }
        else{
            setError('Choose bill');
        }
        
    }

    const transfer = async () => {
        if(transferBillFrom !== undefined && transferBillTo !== undefined) {
            
            const response = await transfer_bill({
                from_bill: transferBillFrom.uuid,
                to_bill: transferBillTo.uuid,
                value: parseFloat(transferValue)
            });
            if(response !== undefined){
                props.handleClose();
                setError(undefined);
            }
            else{
                setError('No success of adding operation');
            }
            
        }
        else{
            setError('Choose bill');
        }
        
    }

    const handleChange = (event, newValue) => {
        setNavValue(newValue);
    };

    useEffect(() => {
        (
            async () => {
                if(localStorage.getItem('access_token') !== null){
                    if(categoryList === undefined && billList === undefined && isSendRequest === false){

                        const [content_category_list, content_bill_list] = await Promise.all([category_list({is_content: true}), bill_list({is_content: true})])
                        
                        if(content_category_list !== undefined){
                            setCategoryList(content_category_list.map((category) => category));
                        }
                        if(content_bill_list !== undefined){
                            setBillList(content_bill_list.map((bill) => bill));
                        }
                        setIsSendRequest(true);
                    }
                }
            }
        )();
    });

    const AddForm = <form>
                        <Box sx={{ '& button': { m: 1 } }}>
                            <h1 className="h3 m-5 mt-0 fw-normal">Add operation</h1>
                            <div className="m-5">
                                <TextField
                                    label={isIncome? `+${value}`: `-${value}`}
                                    defaultValue={value}
                                    onChange={e => setValue(e.target.value)}
                                    name={props.settings? props.settings.currency.char : null}
                                    id="formatted-numberformat-input"
                                    InputProps={{
                                        inputComponent: NumberFormatCustom
                                    }}
                                    variant="standard"
                                    color={isIncome? "success":"warning"}
                                />
                            </div>
                            <div className="m-5">
                                <TextField
                                    id="standard-required"
                                    label={category !== undefined? null : "Category"}
                                    value={category !== undefined && category.isIncome === isIncome? category.name + " - Category" : null}
                                    defaultValue="Category"
                                    variant="standard"
                                    onClick={e => {setChooseCategoryModal(true)}}
                                />
                                <ChooseCategoryModal openModal={openChooseCategoryModal} setOpen={setChooseCategoryModal} categoryList={categoryList} setCategory={setCategory} isIncome={isIncome}/>
                            </div>
                            <div className="m-5">
                                <TextField
                                    id="standard-required"
                                    label={bill !== undefined ? null : "Bill"}
                                    value={bill !== undefined ? bill.name + " - Bill" : null}
                                    defaultValue="Bill"
                                    variant="standard"
                                    onClick={e => {setChooseBillModal(true)}}
                                />
                                <ChooseBillModal settings={props.settings} openModal={openChooseBillModal} setOpen={setChooseBillModal} billList={billList} setBill={setBill}/>
                            </div>
                            <div className="m-5">
                            <TextField
                                id="date"
                                label="Date"
                                type="date"
                                defaultValue={date}
                                sx={{ width: '100%' }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onChange={e => setDate(e.target.value)}
                            />
                            </div>
                            <div className="m-5">
                                <TextField
                                    id="standard-required"
                                    label="Description"
                                    defaultValue={description}
                                    variant="standard"
                                    onChange={e => setDescription(e.target.value)}
                                />
                            </div>

                            <div className="row">
                                <div className="col text-center">
                                <Button variant="outlined" onClick={submit}>CREATE</Button>
                                <p className="mt-5">
                                    {error !== undefined? error: null}
                                </p>
                                </div>
                            </div>

                        </Box>
                    </form>

    const transferForm = <form>
                        <Box sx={{ '& button': { m: 1 } }}>
                            <h1 className="h3 m-5 mt-0 fw-normal">Transfer</h1>
                            <div className="m-5">
                                <TextField
                                    label='Value'
                                    defaultValue={value}
                                    onChange={e => setTransferValue(e.target.value)}
                                    name={props.settings? props.settings.currency.char : null}
                                    id="formatted-numberformat-input"
                                    InputProps={{
                                        inputComponent: NumberFormatCustom
                                    }}
                                    variant="standard"
                                    color={isIncome? "success":"warning"}
                                />
                            </div>
                            
                            <div className="m-5">
                                <TextField
                                    id="standard-required"
                                    label={transferBillFrom !== undefined ? null : "Bill from"}
                                    value={transferBillFrom !== undefined ? transferBillFrom.name + " - Bill from" : null}
                                    defaultValue="Bill"
                                    variant="standard"
                                    onClick={e => {setChooseBillFromModal(true)}}
                                />
                                <ChooseBillModal settings={props.settings} openModal={openChooseBillFromModal} setOpen={setChooseBillFromModal} billList={billList} setBill={setTransferBillFrom}/>
                            </div>
                            
                            <div className="m-5">
                                <TextField
                                    id="standard-required1"
                                    label={transferBillTo !== undefined ? null : "Bill to"}
                                    value={transferBillTo !== undefined ? transferBillTo.name + " - Bill to" : null}
                                    defaultValue="Bill"
                                    variant="standard"
                                    onClick={e => {setChooseBillToModal(true)}}
                                />
                                <ChooseBillModal settings={props.settings} openModal={openChooseBillToModal} setOpen={setChooseBillToModal} billList={billList} setBill={setTransferBillTo}/>
                            </div>

                            <div className="row">
                                <div className="col text-center">
                                <Button variant="outlined" onClick={transfer}>TRANSFER</Button>
                                <p className="mt-5">
                                    {error !== undefined? error: null}
                                </p>
                                </div>
                            </div>

                        </Box>
                    </form>
    

    return (
        <TabContext value={navValue}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleChange} aria-label="lab API tabs example">
                    <Tab label="PAYMENT" value="1" onClick={e => {
                        setIsIncome(false);
                        }}/> 
                    <Tab label="INCOME" value="2" onClick={e => {
                        setIsIncome(true);
                    }}/>
                    <Tab label="TRANSFER" value="3"/>
                </TabList>
            </Box>
            <TabPanel value="1">{AddForm}</TabPanel>
            <TabPanel value="2">{AddForm}</TabPanel>
            <TabPanel value="3">{transferForm}</TabPanel>
        </TabContext>
        
    );
}