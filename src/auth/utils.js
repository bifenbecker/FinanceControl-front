import jwt_decode from "jwt-decode";


export const HOST = 'http://localhost:10000';

const SERVICE_NAME = 'auth';

const BASE_URL = 'http://localhost:10000/auth/'

function clear_tokens(){
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
}

function logout(){
    clear_tokens();
    window.location.reload();
}


export async function checkToken(func) {
    return async function(...args){
        let access_token = localStorage.getItem('access_token');
        let decoded_jwt;
        try {
            decoded_jwt = jwt_decode(access_token);
        } catch (error) {
            clear_tokens();
            access_token = localStorage.getItem('access_token');
        }
        if(access_token !== null){
            let now = Math.floor(new Date().getTime()/1000);
            if(decoded_jwt.exp < now){
                const response = await (fetch(BASE_URL + 'api/refresh-tokens', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        refresh_token: localStorage.getItem('refresh_token')
                    })
                })).then((response) => response)
                .catch((error) => {
                    throw new Error("Failed refresh token")
                })
                if(response.status === 200){
                    const content = await response.json();
                    clear_tokens();
                    localStorage.setItem("access_token", content.access_token);
                    localStorage.setItem("refresh_token", content.refresh_token);
                    
                }else{
                    logout();
                }
            }
            const resp = await func(...args);
            return resp;
        }
        
    }
    
}

export async function get_response(func, is_content=false, ...args) {

    return await func(...args).then(async (response) => {
        return is_content === true && response !== undefined ? await response.json() : response;
    })
    .catch((err) => {
        throw new Error("DEBUG - [ERROR]: " + err)
    })
}

export async function get_user(is_content=false, ...args){
    
    const request = async () => {
        return await (fetch(BASE_URL + 'api/user', {
            headers: {"jwt-assertion": localStorage.getItem('access_token')},
        })).then(response => response)
        .catch((error) => {
            throw new Error("Faild fetch 'get user'")
        })
    }
    const response = await get_response(await checkToken(request), is_content.is_content, ...args).then(response => response).catch((error) => console.log(error))
    return response;
}


export async function edit_user(body, is_content=false, ...args){
    const request = async () => {
        return await (fetch(BASE_URL + 'api/user', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                "jwt-assertion": localStorage.getItem('access_token')
                },
            credentials: 'include',
            body: JSON.stringify(body)
        })).then(response => response)
        .catch((error) => {
            throw new Error("Faild fetch 'edit user'")
        })
    }
    const response = await get_response(await checkToken(request), is_content.is_content, ...args).then(response => response).catch((error) => console.log(error))
    return response;
}



export async function delete_user(is_content=false, ...args){
    const request = async () => {
        return await (fetch(BASE_URL + 'api/user', {
            method: 'DELETE',
            headers: {"jwt-assertion": localStorage.getItem('access_token')},
            credentials: 'include'
        })).then(response => response)
        .catch((error) => {
            throw new Error("Faild fetch 'delete user'")
        })
    }
    const response = await get_response(await checkToken(request), is_content.is_content, ...args).then(response => response).catch((error) => console.log(error))
    return response;
}


export async function get_currencies(){
    const response = await fetch(BASE_URL + 'api/сurrencies');
    return response;
}

export async function update_settings(body, is_content=false, ...args){
    const request = async () => {
        return await (fetch(`${HOST}/${SERVICE_NAME}/api/user_settings`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'jwt-assertion': localStorage.getItem('access_token'),
            },
            body: JSON.stringify(body)
        })).then(response => response)
        .catch((error) => {
            throw new Error("Faild fetch 'update settings'")
        })
    }
    const response = await get_response(await checkToken(request), is_content.is_content, ...args).then(response => response).catch((error) => console.log(error))
    return response;
}



export async function login(body){
    const response = await fetch(BASE_URL + 'api/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify(body)
            });
    return response;
}

export async function register(body){
    const response = await fetch(BASE_URL + 'api/register', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: body
            });
    return response;
}


export async function set_payment_plan(body, is_content=false, ...args){
    
    const request = async () => {
        return await (fetch(BASE_URL + 'stripe/set-subscription', {
            method: 'POST',
            headers: {
                "jwt-assertion": localStorage.getItem('access_token'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body),
        })).then(response => response)
        .catch((error) => {
            console.log(error)
            throw new Error("Faild fetch 'set_payment_plan'")
        })
    }
    const response = await get_response(await checkToken(request), is_content.is_content, ...args).then(response => response).catch((error) => console.log(error))
    return response;
}
