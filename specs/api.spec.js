import config from '../framework/config/config'
import * as AccountService from '../framework/services/AccountService'
import * as BookStoreService from '../framework/services/BookStoreService'
import { faker } from '@faker-js/faker'

// Вариант 1:
// Напишите 5 апи-тестов на сервис bookstore
// https://bookstore.demoqa.com/swagger/
// Напишите АПИ-тесты:

//     Создание пользователя c ошибкой, логин уже используется
//     Создание пользователя c ошибкой, пароль не подходит
//     Создание пользователя успешно
//     Генерация токена c ошибкой
//     Генерация токена успешно

describe('5 апи-тестов на сервис bookstore', () => {
    test('Создание пользователя c ошибкой, логин уже используется', async () => {
        await AccountService.createUser('test', 'Test!0test')
        const request = (await AccountService.createUser('test', 'Test!0test')).response
        expect(request.status).toBe(406)
        expect(request.data.code).toBe('1204')
        expect(request.data.message).toBe('User exists!')
    }),

        test('Создание пользователя c ошибкой, пароль не подходит', async () => {
            const request = (await AccountService.createUser('test', 'Test')).response
            expect(request.status).toBe(400)
            expect(request.data.code).toBe('1300')
            expect(request.data.message).toBe("Passwords must have at least one non alphanumeric character, one digit ('0'-'9'), one uppercase ('A'-'Z'), one lowercase ('a'-'z'), one special character and Password must be eight characters or longer.")
        }),

        test('Создание пользователя успешно', async () => {
            const userName = faker.internet.userName()
            const request = (await AccountService.createUser(userName, 'Test!0test')).response
            expect(request.status).toBe(201)
            expect(request.data.username).toBe(userName)
        }),

        test('Генерация токена c ошибкой', async () => {
            const request = await AccountService.generateToken('test', faker.internet.password())
            expect(request.response.status).toBe(200)
            expect(request.response.data.status).toBe('Failed')
            expect(request.response.data.token).toBe(null)
        })

    test('Генерация токена успешно', async () => {
        const userName = faker.internet.userName()
        await AccountService.createUser(userName, 'Test!0test')
        const request = await AccountService.generateToken(userName, 'Test!0test')
        expect(request.response.status).toBe(200)
        expect(request.response.data.status).toBe('Success')
        expect(request.response.data.token).not.toBe(null)
    })
})

// Вариант 1:
// Напишите API тесты на следующие апи ручки (api endpoints)

// Авторизация
// Удаление пользователя
// Получение информации о пользователе
// При написании АПИ-тестов обязательно использовать контроллеры, так же вынести в конфиг данные для авторизации, базовый УРЛ.
// Будет плюсом, если так же вы отрефакторите тесты написанные в рамках ДЗ АПИ тесты

describe('Авторизация', () => {
    test('Успешная авторизация', async () => {
        const userName = faker.internet.userName()
        await AccountService.createUser(userName, 'Test!0test')
        const request = await AccountService.authorization(userName, 'Test!0test')
        expect(request.response.status).toBe(200)
        expect(request.response.data).toBe(true)
    })
})

describe('Удаление пользователя', () => {
    test('Успешное удаление', async () => {
        const userName = faker.internet.userName()
        const request = await AccountService.userDelete(
            (await AccountService.createUser(userName, 'Test!0test')).userID,
            (await AccountService.authorization(userName, 'Test!0test')).token)
        expect(request.status).toBe(204)

    })
})

describe('Получение информации о пользователе', () => {
    test('Успешное получение информации о пользователе', async () => {
        const userName = faker.internet.userName()
        const request = await AccountService.userInfo(
            (await AccountService.createUser(userName, 'Test!0test')).userID,
            (await AccountService.authorization(userName, 'Test!0test')).token)
        expect(request.status).toBe(200)
        expect(request.data).not.toBe(null)

    })
})

// Вариант 1:
// Напишите API тесты на следующие апи ручки (api endpoints)

//     Создание книги
//     Обновление книги
//     Получении информации о книге
//     Удаление книги

describe('Создание книги', () => {
    test('Успешное создание одной книги', async () => {
        const userName = faker.internet.userName()
        const isbn = [{ 'isbn': '9781449325862' }]
        const request = await BookStoreService.createBook(
            (await AccountService.createUser(userName, 'Test!0test')).userID,
            (await AccountService.authorization(userName, 'Test!0test')).token,
            isbn)
        expect(request.status).toBe(201)
        expect(request.data.books).toStrictEqual(isbn)
    }),

        test('Успешное создание двух книг', async () => {
            const userName = faker.internet.userName()
            const isbn = [{ 'isbn': '9781449325862' }, { 'isbn': '9781449331818' }]
            const request = await BookStoreService.createBook(
                (await AccountService.createUser(userName, 'Test!0test')).userID,
                (await AccountService.authorization(userName, 'Test!0test')).token,
                isbn)
            expect(request.status).toBe(201)
            expect(request.data.books).toStrictEqual(isbn)
        }),

        test('Создание несуществующей книги', async () => {
            const userName = faker.internet.userName()
            const isbn = [{ 'isbn': 'test' }]
            const request = await BookStoreService.createBook(
                (await AccountService.createUser(userName, 'Test!0test')).userID,
                (await AccountService.authorization(userName, 'Test!0test')).token,
                isbn)
            expect(request.status).toBe(400)
            expect(request.data.code).toStrictEqual('1205')
            expect(request.data.message).toStrictEqual('ISBN supplied is not available in Books Collection!')
        })
})


describe('Обвновление книги', () => {
    test('Успешное обновление книги', async () => {
        const token = (await AccountService.authorization(config.credentials.userName, config.credentials.password)).token
        await BookStoreService.createBook(
            config.credentials.userId,
            token,
            [{ "isbn": "9781449325862" }])
        const request = await BookStoreService.updateBook(
            config.credentials.userId,
            token,
            '9781449325862',
            '9781449331818'
        )
        expect(request.status).toBe(200)
        await BookStoreService.deleteAllBooks(config.credentials.userId, token)
    })
})

describe('Получение информации о книги', () => {
    test.each`
    isbn               | expectedIsbn       | expectedTitle
    ${'9781449325862'} | ${'9781449325862'} | ${'Git Pocket Guide'}
    ${'9781449331818'} | ${'9781449331818'} | ${'Learning JavaScript Design Patterns'}
    ${'9781449337711'} | ${'9781449337711'} | ${'Designing Evolvable Web APIs with ASP.NET'}
    ${'9781449365035'} | ${'9781449365035'} | ${'Speaking JavaScript'}
    ${'9781491904244'} | ${'9781491904244'} | ${'You Don\'t Know JS'}
    ${'9781491950296'} | ${'9781491950296'} | ${'Programming JavaScript Applications'}
    ${'9781593275846'} | ${'9781593275846'} | ${'Eloquent JavaScript, Second Edition'}
    ${'9781593277574'} | ${'9781593277574'} | ${'Understanding ECMAScript 6'}
    `('$isbn = $expectedIsbn $expectedTitle', async ({ isbn, expectedIsbn, expectedTitle }) => {
        const request = await BookStoreService.getBookInfo(isbn)
        expect(request.status).toBe(200)
        expect(request.data.isbn).toBe(expectedIsbn)
        expect(request.data.title).toBe(expectedTitle)
    })
})

describe('Удаление книги', () => {
    test('Успешное удаление книги', async () => {
        const userName = faker.internet.userName()
        const userID = (await AccountService.createUser(userName, 'Test!0test')).userID
        const token = (await AccountService.authorization(userName, 'Test!0test')).token
        await BookStoreService.createBook(
            userID,
            token,
            [{ "isbn": "9781449325862" }]
        )
        const request = await BookStoreService.deleteBook(
            userID,
            token,
            '9781449325862'
        )
        expect(request.status).toBe(204)
    })
})