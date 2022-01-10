import React, {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ButtonGroup from '@mui/material/ButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import TextField from '@mui/material/TextField';
import { ThemeProvider } from '@mui/system';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import Zoom from '@mui/material/Zoom';
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import { green, deepOrange } from '@mui/material/colors';


import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import EditBill from '../components/EditBill';
import AddOperationModal from '../components/AddOperationModal';

import { operations_of_bill, edit_bill, convertValue, filter_operations } from '../utils';
import { get_currencies } from '../../auth/utils';
import ListOperations from '../components/ListOperations';
import StatisticOfOperations from '../components/StatisticOfOperations';
import NumberFormatCustom from '../components/NumberFormatInput';




function TabPanel(props) {
    const { children, value, index, ...other } = props;
    

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`action-tabpanel-${index}`}
            aria-labelledby={`action-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </Typography>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };
  
function a11yProps(index) {
    return {
        id: `action-tab-${index}`,
        'aria-controls': `action-tabpanel-${index}`,
    };
}

const fabStyle = {
    position: 'absolute',
    bottom: 16,
    right: 16,
};


const BillView = (props) => {
    
    const theme = useTheme();
    const [value, setValue] = useState(0);
    const [openAddOperationModal, setAddOperationModal] = useState(false);

    const [newName, setNewName] = useState();
    const [newBalance, setNewBalance] = useState();

    const handleClose = (e) => {
        setAddOperationModal(false);
    }
    const addOperationModal = () => {
        setAddOperationModal(true);
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };

    const transitionDuration = {
        enter: theme.transitions.duration.enteringScreen,
        exit: theme.transitions.duration.leavingScreen,
    };

    const [operations, setOperations] = useState();
    const [incomeValue, setIncomeValue] = useState();
    const [paymentValue, setPaymentValue] = useState();
    const [currencyList, setCurrencyList] = useState();

    const process_operations = (operations) => {
        setOperations(operations.map((operation) => {
            var convertedValue = convertValue(operation.currency, props.settings.currency.name, operation.value);
            var currencyChar = props.settings.currency.char;
            operation.convertedValue = convertedValue;
            operation.char =  currencyChar
            return operation;
        }))
        let income_operations = operations.filter((value) => value.isIncome === true);
        let payment_operations = operations.filter((value) => value.isIncome === false);
        if(income_operations.length > 0){
            setIncomeValue(income_operations.map((operation) => Number(operation.convertedValue)).reduce((acc, value) => acc + value));
        }
        if(payment_operations.length > 0){
            setPaymentValue(payment_operations.map((operation) => Number(operation.convertedValue)).reduce((acc, value) => acc + value));
        }
    }

    

    useEffect(() => {
        (
            async () => {
                
                
                const [response, response_curr] = await Promise.all([operations_of_bill(props.bill.uuid), await get_currencies()])
                const content_curr = await response_curr.json();
                setCurrencyList(content_curr.map((cur) => ({name: cur.name, char: cur.char})))
                if(response !== undefined){
                    const content = await response.json();
                    process_operations(content);
                }
            }
        )();
    }, []);
    

    const editBill = async () => {
        if(newName !== undefined && newBalance !== undefined) {
            const content = await edit_bill({
                name: newName,
                balance: newBalance
            }, {is_content: true})
            if(content !== undefined){
                props.setActiveBill(content);
            }
            
        }
    }
    const downloadStatistic = () => {
        const rows = [
            ['Category', 'Income/Payment', `Value(${props.settings.currency.char})`, 'Description', 'Date(mm/dd/yyyy)']
        ];
        operations.map((operation) => {
            let row = [operation.category !== null? operation.category: "No category", operation.isIncome? "Yes": "No", operation.convertedValue, operation.description, operation.date];
            rows.push(row);
        })
        
        let csvContent = "data:text/csv;charset=utf-8," 
            + rows.map(e => e.join(",")).join("\n");

        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const fabs = [
        {
            color: 'primary',
            sx: fabStyle,
            icon: <AddIcon />,
            label: 'Add operation',
            onClick: addOperationModal,
        },
        {
            color: 'primary',
            sx: fabStyle,
            icon: <DownloadIcon />,
            label: 'Download statistic',
            onClick: downloadStatistic,
        },
        {
            color: 'secondary',
            sx: fabStyle,
            icon: <EditIcon />,
            label: 'Edit bank',
            onClick: editBill
        }
    ];

    

    var convertedCurrentBalance = convertValue(props.bill.currency, props.settings.currency.name, props.bill.balance);
    var convertedStartBalance = convertValue(props.bill.currency, props.settings.currency.name, props.bill.start_balance);
    var stat = ((convertedCurrentBalance - convertedStartBalance)/100).toFixed(2);
    var currencyChar = props.settings.currency.char;

    const[isIncomeFilter, setIsIncomeFilter] = useState(undefined);
    const[currenciesListFilter, setCurrenciesListFilter] = useState([]);
    const[valueFilter, setValueFilter] = useState({value: 0.0, icc: true});
    const[isClickValueFilter, setIsClickValueFilter] = useState(false);

    const showValueFilter = () => {
        setIsClickValueFilter(!isClickValueFilter);
    }

    const handleFormat = (event, newFormats) => {
        setCurrenciesListFilter(newFormats);
    };

    useEffect(() => {
        (
            async () => {
                if(isIncomeFilter !== undefined){
                    const send_data = {
                        isIncome: isIncomeFilter,
                        currencies: currenciesListFilter
                    };
                    if(isClickValueFilter === true){
                        send_data.value = valueFilter
                    }
                    const response = await filter_operations(send_data, {is_content: true})
                    process_operations(response);
                }
                
            }
        )();
    }, [isIncomeFilter, currenciesListFilter, valueFilter]);


    const clear_filters = async () => {
        setIsIncomeFilter(undefined);
        setCurrenciesListFilter([]);
        setValueFilter({value: 0.0, icc: true});
        setIsClickValueFilter(false);
        const response = await operations_of_bill(props.bill.uuid, {is_content: true});
        process_operations(response);
    }

    return (
        <div>
            <AddOperationModal settings={props.settings} openModal={openAddOperationModal} setOpen={setAddOperationModal} handleClose={handleClose} bill={props.bill} setNavValue={props.setNavValue}/>
            <ThemeProvider theme={theme}>
                <Box
                    sx={{
                        boxShadow: 3,
                        bgcolor: 'background.paper',
                        m: 1,
                        p: 1
                    }}
                >
                    <Box sx={{ color: 'text.secondary', fontSize: 25, fontWeight: 650 }}>
                        {props.bill.name}
                    </Box>
                    <Box sx={{ color: 'text.primary', fontSize: 22 }}>
                    Balance: {convertedCurrentBalance + currencyChar}
                    </Box>
                    <Box sx={{ color: 'text.primary', fontSize: 13 }}>
                    Start balance: {convertedStartBalance + currencyChar + " - " + props.bill.start_balance + ` (${props.bill.currency})`}
                    </Box>
                    <Box sx={{ color: stat > 0? green[300]: deepOrange[400], fontSize: 15, fontWeight: 600 }}>
                    {stat > 0? "+" + stat: stat}%
                    </Box>
                    <TableContainer>
                        <Table sx={{ width: '100%' }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                            <TableCell>INCOME</TableCell>
                            <TableCell>PAYMENT</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell>{incomeValue? incomeValue.toFixed(2): null}</TableCell>
                                <TableCell>{paymentValue? paymentValue.toFixed(2): null}</TableCell>
                            </TableRow>
                        </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
                
            </ThemeProvider>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    '& > *': {
                    m: 1,
                    },
                }}
                >
                <Box
                    sx={{
                        bgcolor: 'background.paper',
                        width: '40%',
                        position: 'relative',
                        minHeight: 200,
                    }}
                    >
                    <AppBar position="static" color="default">
                        <Tabs
                        value={value}
                        onChange={handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                        aria-label="action tabs example"
                        >
                        
                        <Tab label="Operations" {...a11yProps(0)} />
                        <Tab label="Statistic" {...a11yProps(1)} />
                        <Tab label="Edit bill" {...a11yProps(2)} />
                        </Tabs>
                    </AppBar>
                    <SwipeableViews
                        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                        index={value}
                        onChangeIndex={handleChangeIndex}
                    >
                        
                        <TabPanel
                            value={value} index={0} dir={theme.direction}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column', //column
                                    alignItems: 'center',
                                    '& > *': {
                                    m: 1,
                                    },
                                }}
                                >
                                <ButtonGroup size="small" aria-label="small button group">
                                    <Button color={isIncomeFilter !== undefined? isIncomeFilter === true?"success": "primary": "primary"} onClick={e => {
                                        setIsIncomeFilter(true)
                                    }}>Income</Button>
                                    <Button color={isIncomeFilter !== undefined? isIncomeFilter === true?"primary": "success": "primary"} onClick={e => {
                                        setIsIncomeFilter(false)
                                    }}>Payment</Button>
                                </ButtonGroup>
                                {
                                    currencyList?
                                    <ToggleButtonGroup
                                        value={currenciesListFilter}
                                        onChange={handleFormat}
                                        aria-label="text formatting"
                                    >
                                        {currencyList.map((currency, index) => {
                                            return <ToggleButton value={currency.name}>{currency.name}</ToggleButton >
                                        })}
                                    </ToggleButtonGroup>
                                    : null
                                }
                                {
                                    isClickValueFilter?
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column', //column
                                            alignItems: 'center',
                                            '& > *': {
                                            m: 1,
                                            },
                                        }}
                                    >
                                            <Button color="success" variant="outlined" onClick={showValueFilter}>Value</Button>
                                            <TextField
                                                label={isIncomeFilter? `+${valueFilter?valueFilter.value:null}`: `-${valueFilter?valueFilter.value:null}`}
                                                onChange={e => {
                                                    setValueFilter({value: e.target.value, icc: valueFilter.icc})
                                                }}
                                                id="formatted-numberformat-input"
                                                InputProps={{
                                                    inputComponent: NumberFormatCustom
                                                }}
                                                variant="standard"
                                            />
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'row', //column
                                                    alignItems: 'center',
                                                    '& > *': {
                                                    m: 1,
                                                    },
                                                }}
                                            >
                                                <IconButton color={valueFilter.icc? "primary" : "success"} size="large" onClick={e => {
                                                    setValueFilter({value: valueFilter.value, icc: false})
                                                }}>
                                                    <ArrowCircleDownIcon fontSize="inherit" />
                                                </IconButton>
                                                <IconButton color={valueFilter.icc? "success" : "primary"} size="large" onClick={e => {
                                                    setValueFilter({value: valueFilter.value, icc: true})
                                                }}>
                                                    <ArrowCircleUpIcon fontSize="inherit" />
                                                </IconButton>
                                            </Box>
                                    </Box>
                                    : 
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'row', //column
                                            alignItems: 'center',
                                            '& > *': {
                                            m: 1,
                                            },
                                        }}
                                        >
                                            <Button color="primary" variant="outlined" onClick={showValueFilter}>Value</Button>
                                    </Box>
                                }
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row', //column
                                        alignItems: 'center',
                                        '& > *': {
                                        m: 1,
                                        },
                                    }}
                                    >
                                            <Button color="primary" variant="outlined" onClick={clear_filters}>Clear</Button>
                                    </Box>
                                
                            </Box>
                            <ListOperations user={props.user} operations={operations} />
                        </TabPanel>
                        <TabPanel
                            value={value} index={1} dir={theme.direction}
                        >
                            <StatisticOfOperations operations={operations} />
                        </TabPanel>
                        <TabPanel value={value} index={2} dir={theme.direction}>
                            <EditBill convertedBalance={convertedCurrentBalance} settings={props.settings} bill={props.bill} setNewName={setNewName} setNewBalance={setNewBalance}/>
                        </TabPanel>
                    </SwipeableViews>
                    {fabs.map((fab, index) => (
                        <Zoom
                            key={fab.color}
                            in={value === index}
                            timeout={transitionDuration}
                            style={{
                                transitionDelay: `${value === index ? transitionDuration.exit : 0}ms`,
                            }}
                            unmountOnExit
                        >
                            <Fab variant={fab.label}  aria-label={fab.label} color={fab.color} onClick={fab.onClick}>
                                {fab.icon}
                            </Fab>
                        </Zoom>
                    ))}
                </Box>
            </Box>
        </div>
    );
}

export default BillView;