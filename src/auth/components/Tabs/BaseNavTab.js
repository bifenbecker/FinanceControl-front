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
import ListBills from '../../../banks/pages/ListBills';

import ProfileMenu from '../ProfileMenu';
import BillsMenu from '../../../banks/components/BillsMenu';
import OperationsMenu from '../../../banks/components/OperationsMenu';
import BillView from '../../../banks/pages/BillView';
import MyOperations from '../../../banks/pages/MyOperations';
import SearchInput from '../SearchInput';
import SearchView from '../../../banks/pages/SearchView';


const BaseNavTab = ({user, setUser, value, setNavValue}) => {
    const [activeBill, setActiveBill] = useState();
    const [searchRequest, setSearchRequest] = useState();

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setNavValue('2');
        setUser(undefined);
    }


    const handleChange = (event, newValue) => {
        setNavValue(newValue);
    };

    let tablist;

    if(user !== undefined && user.is_active === true){
        tablist = <TabList onChange={handleChange}>
        <ProfileMenu logout={logout} user={user} setUser={setUser} />
        <Tab icon={<HomeIcon />} label="HOME" value="1" />
        <BillsMenu settings={user?.settings} setNavValue={setNavValue}/>
        <OperationsMenu settings={user?.settings} setNavValue={setNavValue}/>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end'}}><SearchInput setNavValue={setNavValue} setSearchRequest={setSearchRequest}/></Box>
    </TabList>
    }
    else{
        tablist = <TabList onChange={handleChange} aria-label="lab API tabs example">
        <Tab icon={<HomeIcon />} label="HOME" value="1" />
        <Tab icon={<LoginIcon />} label="LOGIN" value="2" />
        <Tab icon={<AppRegistrationIcon />} label="REGISTER" value="3"/>
    </TabList>
    }
    return (
        <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            {tablist}
            </Box>
            <TabPanel value="1">Home</TabPanel>
            <TabPanel value="2"><Login setNavValue={setNavValue} setUser={setUser}/></TabPanel>
            <TabPanel value="3"><Register setNavValue={setNavValue}/></TabPanel>
            <TabPanel value="4"><ListBills settings={user?.settings} setValue={setNavValue} setActiveBill={setActiveBill}/></TabPanel>
            <TabPanel value="5"><BillView settings={user?.settings} bill={activeBill} setNavValue={setNavValue} setActiveBill={setActiveBill}/></TabPanel>
            <TabPanel value="6"><MyOperations settings={user?.settings}/></TabPanel>
            <TabPanel value="7"><SearchView settings={user?.settings} searchRequest={searchRequest}/></TabPanel>
        </TabContext>
    );
};


export default BaseNavTab;