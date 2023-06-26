import axios from 'axios'
import config from '../config/config.js'
import { faker } from '@faker-js/faker'
import * as AccountService from '../services/AccountService.js'

const client = axios.create({
    baseURL: config.baseURL,
    validateStatus: false
})

/**
 * Создание книги
 *
 * @param {string} userID
 * @param {string} token
 * @param {[{isbn: string}]} isbn
 */
export const createBook = async (userID, token, isbn) => {
    const response = await client.post('/BookStore/v1/Books',
        {
            'userId': userID,
            'collectionOfIsbns': isbn
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
    return response
}

/**
 * Обновление книги
 *
 * @param {string} userID
 * @param {string} token
 * @param {string} oldIsbn
 * @param {string} newIsbn
 */
export const updateBook = async (userID, token, oldIsbn, newIsbn) => {
    const response = await client.put('/BookStore/v1/Books/' + oldIsbn,
        {
            "userId": userID,
            "isbn": newIsbn
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
    return response
}
/**
 * Получении информации о книге
 *
 * @param {string} isbn
 */
export const getBookInfo = async (isbn) => {
    const response = await client.get(`/BookStore/v1/Book?ISBN=${isbn}`)
    return response
}

/**
 * Удаление книги
 *
 * @param {string} userID
 * @param {string} token
 * @param {string} isbn
 */
export const deleteBook = async (userID, token, isbn) => {
    const response = await client.delete('/BookStore/v1/Book',
        {
            data: {
                "isbn": isbn,
                "userId": userID
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
    return response
}

/**
 * Удаление всех книг
 *
 * @param {string} userID
 */
export const deleteAllBooks = async (userID, token) => {
    const response = await client.delete(`/BookStore/v1/Books?UserId=${userID}`,
        {
            headers:
            {
                'Authorization': 'Bearer ' + token
            }
        })
    return response
}