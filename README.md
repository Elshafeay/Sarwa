# Sarwa Backend Assessment

## Table of Contents

* [Description](#Description)
* [Prerequisites](#Prerequisites)
* [Instructions](#Instructions)
* [Documentation](#Documentation)
* [Areas of Improvement](#Improvement)

## Description

This is a mini Project in typescript.
It features the use of **Typescript**, **Knex**, **MySQL**, **Jest**, **Winston & Morgan**, **Joi**, and **Eslint**.

## Prerequisites
Your machine must have the following installed on it:
- [Node/NPM](https://nodejs.org/en/download/) (v16 or higher)
- [MySQL](https://nodejs.org/en/download/) (v8 or higher)

## Instructions

### 1. Create the needed databases
Start your MySQL server and create two databases, one for development and another one for testing

### 2. Install the needed dependencies
After Cloning the project, head inside the project folder and run
```
npm install
```

### 3. DB Creation and Migrations
```
cp .env.example .env
```
Now, replace the variables inside `.env` with your credentials and then run

``` 
npm run migrate
```

### 4. Starting the project
```
npm run start:watch
```

### 5. Running the tests
```
npm test
```

Any by now you should be able to go to `localhost:3000` to test that everything is working as expected.

## Documentaion
- There's a postman collection within the repo `docs/Sarwa.postman_collection.json` than can help you navigate the endpoints.
- There's a document that describes the project architecture within the repo `docs/Architecture.pdf` than can help give you a more clear idea about the design.

## Areas of Improvement <a name="Improvement"></a>
- Adding Authentication and Authorization
- Adding more filters to the transactions search endpoint (i.e. by received_at)
- Dockerizing the project
- Implementing CI/CD