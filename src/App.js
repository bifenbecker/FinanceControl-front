import React, {useEffect, useState} from 'react';
import {BrowserRouter} from "react-router-dom";

import './App.css';
import Nav from './auth/components/Nav';

import { get_user } from './auth/utils';


function App() {
    const [user, setUser] = useState(undefined);
    document.title = 'Finance Contorol';
    useEffect(() => {
          (
            async () => {
              let request = await get_user;
              let response = await request();
              if(response !== undefined){
                if(response.status === 200 || response.status === 423){
                  const content = await response.json();
                  setUser(content);
                }
                else if(response.status === 404 || response.status === 401){
                  localStorage.removeItem('access_token');
                  localStorage.removeItem('refresh_token');
                  setUser(undefined);
  
                }
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