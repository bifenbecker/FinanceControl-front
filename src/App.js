import React, {useEffect, useState} from 'react';
import {BrowserRouter} from "react-router-dom";

import './App.css';
import Nav from './auth/components/Nav';

import { get_user } from './auth/utils';


function App() {
    const [user, setUser] = useState();

    document.title = 'Finance Contorol';

    useEffect(() => {
        (
          async () => {
            const content = await get_user({is_content: true});
            setUser(content);
          }
        )();
    
    }, []);

    return (
        <div className="App">
            <Nav user={user} setUser={setUser} />
        </div>
    );
}

export default App;