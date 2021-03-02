# rinvoice
A tamper-proof invoice financing solution using Blockchain.

### table of contents
---
- file structure
- languages and tools used
- installation

### file structure
----
```
├── FileStructure.md
├── README.md
├── resources
│   ├── color\ palette.png
│   └── logo
│       ├── logo-dark-bg.png
│       ├── logo-text-dark-bg.png
│       ├── logo-text-transparent-bg.png
│       ├── logo_transparent-bg.png
│       └── original.png
└── rinvoice
    ├── app.js
    ├── bin
    │   └── www
    ├── node_modules
    ├── package-lock.json
    ├── package.json
    ├── public
    │   ├── images
    │   ├── javascripts
    │   └── stylesheets
    ├── routes
    │   ├── home.js
    │   ├── invoices.js
    │   ├── login.js
    │   ├── profile.js
    │   └── register.js
    └── views
        ├── pages
        └── partials
```

### languages and tools used
---
[![JavaScript](https://img.shields.io/badge/-JavaScript-000?&logo=JavaScript&logoColor=ddc508)](https://github.com/adamalston?tab=repositories&q=&type=&language=javascript) ![SQL](https://img.shields.io/badge/-SQL-000?&logo=MySQL&logoColor=4479A1) ![AWS](https://img.shields.io/badge/-AWS-000?&logo=Amazon-AWS&logoColor=FF9900) ![Linux](https://img.shields.io/badge/-Linux-000?&logo=Linux&logoColor=FCC624) ![Node.js](https://img.shields.io/badge/-Node.js-000?&logo=node.js)

### installation
---

to use express, install nodejs and npm on your os first and then run the "version" command in your terminal to check successfull installation.

```
> node -v
v14.15.4
```
npm installation can be tested in the same way:
```sh
> npm -v
7.6.0
```

install express
```sh
> npm install express
```

clone this repo
```sh
> git clone https://github.com/hiranyagarbh/rinvoice.git #or clone your own fork
> cd rinvoice
```

install dependencies
```sh
> npm install
```

start the express server
```sh
> npm run devstart #for dev start
> npm start #for production
```