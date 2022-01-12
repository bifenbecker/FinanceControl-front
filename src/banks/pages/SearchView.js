import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';

import { search_request, convertValue } from '../utils';

import ListOperations from '../components/ListOperations';

export default function SearchView({searchRequest, settings}) {
    const [searchResult, setSearchResult] = useState();

    useEffect(() => {
        (
          async () => {
            const content = await search_request({text: searchRequest}, {is_content: true});
            setSearchResult(content.map((operation) => {
                var convertedValue = convertValue(operation.currency, settings.currency.name, operation.value);
                var currencyChar = settings.currency.char;
                operation['convertedValue'] = convertedValue;
                operation['char'] =  currencyChar
                return operation;
            }));
          }
        )();
    
    }, []);


    if(searchResult === undefined) {
        return <p>Loading...</p>
    }
    return (
        <Box sx={{ width: 500 }}>
            <ListOperations operations={searchResult}/>
        </Box>
    );
}