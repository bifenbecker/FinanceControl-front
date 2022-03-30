import React, {useState} from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';

import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';


import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import Login from "../../pages/Login";
import Register from "../../pages/Register";


const UnloggedTab = ({setUser, value, setNavValue}) => {


    const handleChange = (event, newValue) => {
        setNavValue(newValue);
    };

    return (
        <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleChange} aria-label="lab API tabs example">
                    <Tab icon={<HomeIcon />} label="HOME" value="1" />
                    <Tab icon={<LoginIcon />} label="LOGIN" value="2" />
                    <Tab icon={<AppRegistrationIcon />} label="REGISTER" value="3"/>
                </TabList>
            </Box>
            <TabPanel value="1">Home</TabPanel>
            <TabPanel value="2"><Login setNavValue={setNavValue} setUser={setUser}/></TabPanel>
            <TabPanel value="3"><Register setNavValue={setNavValue}/></TabPanel>
        </TabContext>
    );
};


export default UnloggedTab;