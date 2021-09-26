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
rinvoice
├── FileStructure.md
├── miner
│   ├── index.js
│   ├── miner1csv
│   └── node_modules
│
├── rinvoice
│   ├── app.js
│   ├── bin
│   │   └── www
│   ├── node_modules
│   ├── rinvoice.sql
│   ├── routes
│   │   ├── auth.js
│   │   ├── index.js
│   │   ├── invoices.js
│   │   ├── profile.js
│   │   ├── upload_file.js
│   │   └── user.js
│   ├── tree.txt
│   └── views
│       ├── pages
│       │   ├── home
│       │   │   ├── invoices.ejs
│       │   │   ├── profile.ejs
│       │   │   └── upload_file.ejs
│       │   ├── login.ejs
│       │   ├── register.ejs
│       │   └── view_invoice.ejs
│       └── partials
│           ├── add-invoice.ejs
│           ├── footer.ejs
│           ├── header.ejs
│           ├── html_head.ejs
│           ├── private_key.txt
│           ├── public_key.txt
│           ├── scripts.ejs
│           ├── sidenav.ejs
│           └── topnav.ejs
├── rinvoice.sql
└── source.pdf
```

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

next, import the mysql [db schema](rinvoice/rinvoice.sql) and update the db credentials in [app.js](rinvoice/app.js)


start the express server
```sh
> npm run devstart #for dev start
> npm start #for production
```
