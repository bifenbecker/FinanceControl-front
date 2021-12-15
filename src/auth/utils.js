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
                const response = await fetch(BASE_URL + 'api/refresh-tokens', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        refresh_token: localStorage.getItem('refresh_token')
                    })
                }).then(async () => {
                    console.log("SUCCESS")
                    if(response.status === 200){
                        const content = await response.json();
                        localStorage.setItem("access_token", content['access_token']);
                        localStorage.setItem("refresh_token", content['refresh_token']);
                        const res = await func(...args);
                        return res;
                    }else{
                        logout();
                    }
                }).catch((error) => {
                    throw new Error("Failed refresh token")
                })
            }
        }
        
    }
    
}


export async function get_user_f(){
    
    const response = await (fetch(BASE_URL + 'api/user', {
        headers: {"jwt-assertion": localStorage.getItem('access_token')},
    })).then(() => {
        return response;
    }).catch((error) => {
        throw new Error("Faild fetch 'get user'")
    })
}
export const get_user = async (...args) => {
    const content = await checkToken(get_user_f);
    
    await content(...args).then((res) => {
        return res;
    }).catch((err) => {
        console.error(err);
    })
}


export async function login(body){
    const response = await fetch(BASE_URL + 'api/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: body
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




async function edit_user_f(body){
    const response = await fetch(BASE_URL + 'api/user', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    "jwt-assertion": localStorage.getItem('access_token')
                    },
                credentials: 'include',
                body: JSON.stringify(body)
            });
    return response;
}
export let edit_user = checkToken(edit_user_f);


async function delete_user_f(){
    const response = await fetch(BASE_URL + 'api/user', {
                method: 'DELETE',
                headers: {"jwt-assertion": localStorage.getItem('access_token')},
                credentials: 'include'
            });
    return response;
}
export let delete_user = checkToken(delete_user_f);


export async function get_currencies(){
    const response = await fetch(BASE_URL + 'api/сurrencies');
    return response;
}

async function update_settings_f(body){
    const response = await fetch(`${HOST}/${SERVICE_NAME}/api/user_settings`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'jwt-assertion': localStorage.getItem('access_token'),
                },
                body: JSON.stringify(body)
            });
    return response;
}
export let update_settings = checkToken(update_settings_f);


// export async function get_user_settings(){
//     const response = await fetch(`${HOST}/${SERVICE_NAME}/api/user_settings`, {
//                 headers: {
//                     'jwt-assertion': localStorage.getItem('access_token'),
//                 }
//             });
//     return response;
// }