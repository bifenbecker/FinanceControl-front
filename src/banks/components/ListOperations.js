import React, {useState} from 'react';
import Box from '@mui/material/Box';

import OperationModalView from '../pages/OperationModalView';
import OperationPrev from './OperationPrev';


const ListOperations = (props) => {
    const [openOperationModal, setOperationModal] = useState(false);
    const [selectedOperation, setSelectedOperation] = useState();
    
    const handleClose = () => {
        setOperationModal(false);
    }
    return (
        <Box sx={{ width: '100%', height: '100%', bgcolor: '#e0e0e0', fontWeight: 800, m: 3 }} >
            {selectedOperation !== undefined && <OperationModalView user={props.user} openModal={openOperationModal} setOpen={setOperationModal} handleClose={handleClose} operation={selectedOperation} setOperation={setSelectedOperation}/>
            }
            {props.operations && props.operations.map((operation) => <OperationPrev operation={operation} setSelectedOperation={setSelectedOperation} setOperationModal={setOperationModal}/>)
            }
        </Box>
    );
}

export default ListOperations;