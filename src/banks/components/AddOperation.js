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

import {category_list, bill_list, add_operation} from '../utils'


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

    const [openChooseCategoryModal, setChooseCategoryModal] = React.useState(false);
    const [openChooseBillModal, setChooseBillModal] = React.useState(false);

    const [isSendRequest, setIsSendRequest] = useState(false);
    
    const submit = async () => {
        if(bill !== undefined) {
            const request = await add_operation;
            const response = await request({
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
    const handleChange = (event, newValue) => {
        setNavValue(newValue);
    };

    useEffect(() => {
        (
            async () => {
                if(localStorage.getItem('access_token') !== null){
                    if(categoryList === undefined && billList === undefined && isSendRequest === false){
                        const request_category_list = await category_list;
                        const request_bill_list = await bill_list;
                        const [response_category_list, response_bill_list] = await Promise.all([request_category_list, request_bill_list])
                        if(response_category_list !== undefined){
                            if(response_category_list.status === 200){
                                const content = await response_category_list.json();
                                setCategoryList(content.map((category) => category));
                            }
                        }
                        if(response_bill_list !== undefined){
                            if(response_bill_list.status === 200){
                                const content = await response_bill_list.json();
                                setBillList(content.map((bill) => bill));
                            }
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
                                    // onChange={e => setCategory(e.target.value)}
                                    onClick={e => {setChooseCategoryModal(true)}}
                                />
                                <ChooseCategoryModal openModal={openChooseCategoryModal} setOpen={setChooseCategoryModal} categoryList={categoryList} setCategory={setCategory} isIncome={isIncome}/>
                            </div>
                            {/* //TODO: Change on select */}
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
                            {/* //TODO: Change on date */}
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

    return (
        <TabContext value={navValue}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleChange} aria-label="lab API tabs example">
                {/* icon={} */}
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
            <TabPanel value="3">TRANSFER</TabPanel>
        </TabContext>
        
    );
}