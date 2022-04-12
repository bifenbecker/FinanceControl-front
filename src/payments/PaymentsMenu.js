import React, {useState} from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import PaymentsIcon from '@mui/icons-material/Payments';
import PaymentIcon from '@mui/icons-material/Payment';
import HistoryIcon from '@mui/icons-material/History';

import SelectPaymentPlanModal from './SelectPaymentPlanModal';



const PaymentsMenu = ({ user, handleChange}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [openSelectPlansModal, setSelectPlansModal] = useState(false);
    const [paymentPlan, setPaymentPlan] = useState(user.current_sub.plan? user.current_sub.plan : {'name': 'Free', 'price': 0.0});

    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        // setPaymentsPlansModal(false);
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
        <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
            <Tooltip title="Payments menu">
                <Tab onClick={handleClick} icon={<PaymentIcon />} label="Payments" value="-" />
            </Tooltip>
        </Box>
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
            elevation: 0,
            sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
                },
                '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 45,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
                },
            },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
            <MenuItem onClick={e => setSelectPlansModal(true)}>
            <ListItemIcon>
                <PaymentsIcon fontSize="small" />
            </ListItemIcon>
            Plans
            <SelectPaymentPlanModal user={user} setPaymentPlan={setPaymentPlan} setOpen={setSelectPlansModal} openModal={openSelectPlansModal} currentPlan={paymentPlan}/>
            </MenuItem>

            {/* setNavValue */}
            <MenuItem> 
            <ListItemIcon>
                <HistoryIcon fontSize="small" />
            </ListItemIcon>
            My payments
            </MenuItem>
        </Menu>
        </>
    );
}

export default PaymentsMenu;