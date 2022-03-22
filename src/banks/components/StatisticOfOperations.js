import React, {useState, useMemo} from 'react';
import Box from '@mui/material/Box';

import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Tab from '@mui/material/Tab';


import ListOperations from './ListOperations';
import StatTable from './Table';


function process_operations(operations, isIncome) {
    var result = [];
    var data = {};
    operations.forEach((operation) => { 
        let category = operation.category;
        if(category === null || category === undefined) {
            category = "No category";
        }
        let value = Number(operation.convertedValue);
        if(operation.isIncome === isIncome) {
            if(category in data) {
                data[category] += value;
            }
            else{
                data[category] = value;
            }
        }
        
    })
    for(var key in data) {
        result.push({
            name: key,
            value: data[key].toFixed(2)
        })
    }
    return result;
}


export default function StatisticOfOperations(props) {
    const [navValue, setNavValue] = useState('1');
    const [isIncome, setIsIncome] = useState(false);
    const data = useMemo(() => process_operations(props.operations, isIncome));
    const incomeOperations = useMemo(() => props.operations.filter(operation => operation.isIncome == true));
    const paymentOperations = useMemo(() => props.operations.filter(operation => operation.isIncome == false));
    
    if(props.operations !== undefined) {
        return (
            <TabContext value={navValue}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider'}}>
                    <TabList onChange={(e, value) => setNavValue(value)} aria-label="lab API tabs example">
                        <Tab label="PAYMENT" value="1" onClick={e => {
                            setIsIncome(false);
                            }}/> 
                        <Tab label="INCOME" value="2" onClick={e => {
                            setIsIncome(true);
                        }}/>
                    </TabList>
                </Box>
                <TabPanel value="1">
                    <StatTable rows={data}/>
                    <ListOperations operations={paymentOperations} />
                </TabPanel>
                <TabPanel value="2">
                    <StatTable rows={data}/>
                    <ListOperations operations={incomeOperations} />
                </TabPanel>
            </TabContext>
            
        );
    }else{
        return null;
    }
    
}