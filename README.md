## MeLi Middleend

This repository is related to technical challenge by Full Stack developer position and it is developed with next technologies:

  * NodeJS with ExpressJS framework
  * Typescript
  * Docker
  * Docker Compose
  * PostgreSQL

## Table of Contents

- [Folder Structure](#folder-structure)
- [Set Up Project](#set-up-project)
- [Running Application](#running-application)
- [Testing](#testing)
- [Cleaning app](#unmount-application)
- [Author](#author)

## Folder Structure

The folder structure in the app, it should look something like:

```
.
├── index.ts
├── README.md
├── package.json
├── package-lock.json
├── tsconfig.json
├── server.ts
├── seeds.ts
├── docker-compose.yml
├── Dockerfile
├── jest.config.js
├── .prettierrc.json
├── .prettierignore
├── .eslintrc.json
├── .eslintignore
├── .env
├── .dockerignore
├── __tests__
│   └── index.ts
├── src
├── api
│   ├── items
│   │   ├── controllers.ts
│   │   ├── dtos.ts
│   │   └── services.ts
│   ├── purchases
│   │   ├── controllers
│   │   ├── dtos.ts
│   │   ├── models.ts
│   │   └── services.ts
│   ├── users
│   │   ├── models.ts
│   │   └── services.ts
├── db-config
│   ├── index.ts
│   ├── dtos.ts
│   └── models.ts
├── middleware
│   ├── index.ts
│   ├── error-handler.ts
│   └── auth.ts
├── utils
│   ├── index.ts
│   ├── constants.ts
│   ├── errors.ts
│   └── http.ts
├── run.sh
└── README.md
```

## Set Up Project

* The next dependencies are required for run the app:

    * docker
    * docker-compose

You should be sure that your docker app is to up and running correctly
  
## Running Application

  Executes the next command: 

  * On your terminal `sh run.sh`

## Testing

Integration tests suites are configured for this

  * Configuration

    * Uses: 

        * node v14.19.0
        * npm 8.5.0
        
    * Run command

        `npm install`

  * Run tests

    `npm run test`

## Unmount Application

  It be sure to remove the application that is running. Execute next line

  `npm run unmount`
  
## Author

* Jose Alberto Cano Govea
* juliojacg@hotmail.com
* https://www.linkedin.com/in/jose-alberto-cano-govea-4b882370