import axios from 'axios'
import config from '../config/config.js'

const client = axios.create({
    baseURL: config.baseURL,
    validateStatus: false
})

/**
 * Создание нового ползователя
 *
 * @param {string} userName
 * @param {string} password
 */
// async function createUser(userName, password) {
//     const response = await fetch(`${config.baseURL}/Account/v1/User`, {
//         method: 'post',
//         body: JSON.stringify({
//             'userName': userName,
//             'password': password
//         }),
//         headers: { 'Content-Type': 'application/json' }
//     })
//     return response
// }

export const createUser = async (userName, password) => {
    const response = await client.post('/Account/v1/User',
        {
            'userName': userName,
            'password': password
        })
    return {
        response: response,
        userID: response.data.userID
    }
}

/**
 * Генерация токена
 *
 * @param {string} userName
 * @param {string} password
 */
// async function generateToken(userName, password) {
//     const response = await fetch(`${config.baseURL}/Account/v1/GenerateToken`, {
//         method: 'post',
//         body: JSON.stringify({
//             'userName': userName,
//             'password': password
//         }),
//         headers: { 'Content-Type': 'application/json' }
//     })
//     return response
// }

export const generateToken = async (userName, password) => {
    const response = await client.post('/Account/v1/GenerateToken',
        {
            'userName': userName,
            'password': password
        })
    return {
        response: response,
        token: response.data.token
    }
}

/**
 * Авторизация
 *
 * @param {string} userName
 * @param {string} password
 */
export const authorization = async (userName, password) => {
    const token = (await generateToken(userName, password)).token
    const response = await client.post('/Account/v1/Authorized',
        {
            'userName': userName,
            'password': password
        },
        {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        })
    return {
        response: response,
        token: token
    }
}

/**
 * Удаление пользователя
 *
 * @param {string} userID
 * @param {string} token
 */
export const userDelete = async (userID, token) => {
    const response = await client.delete('/Account/v1/User/' + userID,
        {
            headers:
            {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
    return response
}


/**
 * Получение информации о пользователе
 * @param {string} userID
 * @param {string} token
 */
export const userInfo = async (userID, token) => {
    const response = await client.get('/Account/v1/User/' + userID,
        {
            headers:
            {
                'Authorization': 'Bearer ' + token
            }
        })
    return response
}
