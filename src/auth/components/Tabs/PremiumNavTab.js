import React, {useState} from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';

import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';


import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import BaseNavTab from './BaseNavTab';


const PremiumNavTab = ({user, setUser, value, setNavValue}) => {


    const handleChange = (event, newValue) => {
        setNavValue(newValue);
    };


    return (
        <Box>
        <TabContext value={value}>
        <BaseNavTab user={user} setUser={setUser} value={value} setNavValue={setNavValue}/>
        <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab icon={<HomeIcon />} label="STATISTIC" value="8" />
        </TabList>
        
        <TabPanel value="0"><Box><h1>STAT</h1></Box></TabPanel>
        </TabContext>
        </Box>
    );
};


export default PremiumNavTab;