import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import CategoryList from './CategoryList';
import TextField from '@mui/material/TextField';

import {create_category} from '../utils'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    height: 600,
    bgcolor: '#128277',
    border: '1px solid #000',
    boxShadow: 24,
    p: 4,
};

const ChooseCategoryModal = ({openModal, setOpen, categoryList, setCategory, isIncome}) => {
    const [categoryNameCreate, setCategoryNameCreate] = React.useState('');
    const [isClickedCreateCategory, setIsClickedCreateCategory] = React.useState(false);

    const handleClose = () => {
        setOpen(false);
    }

    const add_category = async (e) => {
        
        if(categoryNameCreate !== ""){
            console.log(isIncome)
            var name = categoryNameCreate;
            var body = {
                name: name,
                isIncome: isIncome
            }

            const content = await create_category(body, {is_content: true});
            if(content !== undefined && categoryList !== undefined){
                categoryList.push(content);
            }
        }
        setIsClickedCreateCategory(false);
    }

    return (
        <div>

        <Modal
            open={openModal}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <CategoryList handleClose={handleClose} categoryList={categoryList} isIncome={isIncome} setCategory={setCategory}/>
                
                {
                    isClickedCreateCategory?
                    <Box>
                        <Fab sx={{ color: 'success.dark', bgcolor: '#B9C4C9', mr: 3}} aria-label="add" onClick={add_category}>
                        <AddIcon />
                        </Fab>
                        <TextField
                            label="Create Category"
                            onChange={e => setCategoryNameCreate(e.target.value)}
                            id="formatted-numberformat-input"
                            variant="standard"
                            color="error"
                        />
                    </Box>
                    : 
                    <Fab sx={{ color: 'success.dark', bgcolor: '#B9C4C9', mr: 3}} aria-label="add" onClick={e => setIsClickedCreateCategory(!isClickedCreateCategory)}>
                        <AddIcon />
                    </Fab>
                }
                
            </Box>
        </Modal>
        </div>
    );
}

export default ChooseCategoryModal;