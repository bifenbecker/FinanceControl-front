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
              const content = await get_user();
              
              if(content !== undefined){
                  setUser(content);
              }
            }
          )();
    }, [setUser]);

    return (
        <div className="App">
            <BrowserRouter>
                <Nav user={user} setUser={setUser} />
            </BrowserRouter>
        </div>
    );
}

export default App;