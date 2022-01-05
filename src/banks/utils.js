import fx from 'money'
import { checkToken, get_response } from '../auth/utils';
import {HOST} from '../auth/utils';


const SERVICE_NAME = 'bankAccounts';


export function convertValue(from_, to_, value){

    // const response = await fetch('http://api.exchangeratesapi.io/v1/latest?access_key=d8299a9b5c4316d93b8ebd864ac72ae4')
    // const content = await response.json();

    fx.base = "EUR";
    // fx.base = content.base;
    
    // fx.settings = {from: "USD", to: "EUR"}
    fx.settings = {from: from_, to: to_}
    // fx.rates = content.rates;
    fx.rates = {
        BTC: 0.000019240079,
        BYN: 2.8171,
        EUR: 1,
        RUB: 83.754387,
        USD: 1.122359
    }
    return to_ === 'BTC' ? fx.convert(Number(value)).toFixed(8) : fx.convert(Number(value)).toFixed(2);
}


export async function create_bill(body, is_content=false, ...args){
    const request = async () => {
        return await (fetch(`${HOST}/${SERVICE_NAME}/bills/api/create-bill`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'jwt-assertion': localStorage.getItem('access_token')
            },
            credentials: 'include',
            body: JSON.stringify(body)
        })).then(response => response)
        .catch((error) => {
            throw new Error("Faild fetch 'create bill'")
        })
    }
    const response = await get_response(await checkToken(request), is_content.is_content, ...args).then(response => response).catch((error) => console.log(error))
    return response;
}


export async function edit_bill(body, is_content=false, ...args){
    const request = async () => {
        return await (fetch(`${HOST}/${SERVICE_NAME}/bills/api/bill`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'jwt-assertion': localStorage.getItem('access_token')
            },
            body: JSON.stringify(body)
            })).then(response => response)
            .catch((error) => {
                throw new Error("Faild fetch 'edit bill'")
            })
    }
    const response = await get_response(await checkToken(request), is_content.is_content, ...args).then(response => response).catch((error) => console.log(error))
    return response;
}


export async function bill_list(is_content=false, ...args){

    const request = async () => {
        return await (fetch(`${HOST}/${SERVICE_NAME}/bills/api/list`, {
            headers: {"jwt-assertion": localStorage.getItem('access_token')},
        })).then(response => response)
        .catch((error) => {
            throw new Error("Faild fetch 'bill list'")
        })
    }
    const response = await get_response(await checkToken(request), is_content.is_content, ...args).then(response => response).catch((error) => console.log(error))
    return response;
}


export async function category_list(is_content=false, ...args){
    const request = async () => {
        return await (fetch(`${HOST}/${SERVICE_NAME}/operations/api/categories`, {
            headers: {
                "jwt-assertion": localStorage.getItem('access_token'),
            }
        })).then(response => response)
        .catch((error) => {
            throw new Error("Faild fetch 'category list'")
        })
    }
    const response = await get_response(await checkToken(request), is_content.is_content, ...args).then(response => response).catch((error) => console.log(error))
    return response;   
}


export async function create_category(body, is_content=false, ...args){
    const request = async () => {
        return await (fetch(`${HOST}/${SERVICE_NAME}/operations/api/category`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'jwt-assertion': localStorage.getItem('access_token')
            },
            body: JSON.stringify(body)
        })).then(response => response)
        .catch((error) => {
            throw new Error("Faild fetch 'create category'")
        })
    }
    const response = await get_response(await checkToken(request), is_content.is_content, ...args).then(response => response).catch((error) => console.log(error))
    return response; 
}


export async function add_operation(body, uuid, is_content=false){

    const request = async () => {
        return await (fetch(`${HOST}/${SERVICE_NAME}/operations/api/operation`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'jwt-assertion': localStorage.getItem('access_token'),
                'uuid': uuid
            },
            body: JSON.stringify(body)
        })).then(response => response)
        .catch((error) => {
            throw new Error("Faild fetch 'add operation'")
        })
    }
    const response = await get_response(await checkToken(request), is_content.is_content, body, uuid).then(response => response).catch((error) => console.log(error))
    return response;
}


export async function edit_operation(body, uuid, is_content=false){
    const request = async () => {
        return await (fetch(`${HOST}/${SERVICE_NAME}/operations/api/operation`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'jwt-assertion': localStorage.getItem('access_token'),
            },
            body: JSON.stringify(body)
        })).then(response => response)
        .catch((error) => {
            throw new Error("Faild fetch 'edit operation'")
        })
    }
    const response = await get_response(await checkToken(request), is_content.is_content, body, uuid).then(response => response).catch((error) => console.log(error))
    return response;
}


export async function operations_of_bill(uuid, is_content=false) {
    const request = async () => {
        return await (fetch(`${HOST}/${SERVICE_NAME}/operations/api/operations-of-bill`, {
            headers: {
                'Content-Type': 'application/json',
                'jwt-assertion': localStorage.getItem('access_token'),
                'uuid': uuid
            }
        })).then(response => response)
        .catch((error) => {
            throw new Error("Faild fetch 'operations of bill'")
        })
    }
    const response = await get_response(await checkToken(request), is_content.is_content, uuid).then(response => response).catch((error) => console.log(error))
    return response;
}


export async function my_operations(uuid, is_content=false) {
    const request = async () => {
        return await (fetch(`${HOST}/${SERVICE_NAME}/operations/api/operations`, {
            headers: {
                'jwt-assertion': localStorage.getItem('access_token'),
            }
        })).then(response => response)
        .catch((error) => {
            throw new Error("Faild fetch 'my operations'")
        })
    }
    const response = await get_response(await checkToken(request), is_content.is_content, uuid).then(response => response).catch((error) => console.log(error))
    return response;
}


export async function delete_bill(uuid, is_content=false) {
    const request = async () => {
        return await (fetch(`${HOST}/${SERVICE_NAME}/bills/api/bill`, {
            method: 'DELETE',
            headers: {
                'jwt-assertion': localStorage.getItem('access_token'),
                'uuid': uuid,
            }
        })).then(response => response)
        .catch((error) => {
            throw new Error("Faild fetch 'delete_bill'")
        })
    }
    const response = await get_response(await checkToken(request), is_content.is_content, uuid).then(response => response).catch((error) => console.log(error))
    return response;
}

