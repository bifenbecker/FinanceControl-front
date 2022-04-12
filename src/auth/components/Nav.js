import React, {useState} from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';

import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';


import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';


import BaseNavTab from './Tabs/BaseNavTab';
import UnloggedTab from './Tabs/UnloggedTab';





const Nav = ({user, setUser}) => {
    const [value, setNavValue] = useState('1');

    let nav_tab;
    if(user === undefined){
        nav_tab = <UnloggedTab setUser={setUser} value={value} setNavValue={setNavValue}/>
    }
    else{
        nav_tab = <BaseNavTab user={user} setUser={setUser} value={value} setNavValue={setNavValue}/>
    }
    return (
        <Box>{nav_tab}</Box>
    );
};


export default Nav;