# Letsbloom-task1-books-api

**About the project**

It is an API which resembles of a Library Management system.

**What one can do?**


1. New books can be added to the database,provided with proper details.
2. All the data about the books can be fetched. Also we can find details for a specific book. 
3. Currently available data about the books can be modified.
4. Remove any book from the database,if you wish to.

**Tech Stack**

* NodeJs
* Express
* MongoDb
* Postman

**How to run**

In the directory,
1. run "npm i" in the terminal
2. "nodemon index.js" will give the status of the database connection.

In MongoDB Compass - localhost connection is established.

You can go to the books database and see the updates with data while we perform CRUD operations. 

Postman

* To seed the data first: run

GET : http://localhost:3000/api/seed

**Endpoint 1: Retrieve All Books**

GET : http://localhost:3000/api/books

To retrieve data of a particular book 


**NOTE:** Each book is alloted a unique book_id . We can refer to particular book using their ID. 

GET : http://localhost:3000/api/books/6478113515

**Endpoint 2: Add a New Book**

POST : http://localhost:3000/api/books/

Under Body column, choose data raw JSON 

Enter all details in the following format(all input as strings) , also make sure id is unique :

{
    "book_id":"xxxx",
    "book_name":"xxxxxx",
    "author":"yyyyy",
    "publisher":"zzzzz",
    "isbn":"aaaaaa-bbbbb-cccc"
}

any error will be displayed with reason.

**Endpoint 3: Update Book Details**

PUT : http://localhost:3000/api/books/12345   (id number)

Under Body column, choose data raw JSON 

Enter the details in the correct format(all input as strings) you wish to modify (except id,which cannot be chnaged) :

{
    "book_name":"yyyy",
    "author":"yyyy",
    "publisher":"zzzzz",
    "isbn":"aaaaaa-bbbbb-cccc"
}

This will be succesful only if the id entered is valid.Any error will be displayed with reason.

**DELETE ITEM**

DELETE : http://localhost:3000/api/books/2345(id)

This will be succesful only if the id entered is valid.

