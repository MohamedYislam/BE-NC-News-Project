## NC News API

------------------------

NC News is a RESTful API designed to be the backend of a news app with similar functionality to social media sites and forums. It has been built with Node.js and Express.
PostgreSQL was used to access and manipulate the database, and Cylic used to host the app.

The API can 
-   Retrieve articles, topics, users and comments
-   Querying articles and sorting them by features such as date the article was created, the user who posted the article,  total votes and comment count
-   Filter by topic name
-   Vote on articles
-   Post new comments or delete existing ones


-------

## Hosted Version

List of all the endpoints :  https://news-app-msy.cyclic.app/api

Some examples: 

- https://news-app-msy.cyclic.app/api/articles/12/comments

- https://news-app-msy.cyclic.app/api/articles?topic=coding

- https://news-app-msy.cyclic.app/api/articles?sortBy=comment_count&&order=desc


----



## SETUP

First clone the repo by copying the code below into your terminal

    git clone https://github.com/MohamedYislam/backend-news-project

   

**A minimum version of Node v18.7.0 and PSQL v14.5 should be used**

    
The dependencies used are:

*  Jest
*  Jest-extended
*  Jest-sorted
*  Express
*  Supertest
*  pg
*  pg-format

To install them all, in the terminal type

    npm install


Then create 2 new files

  **.env.test** file containing

    PGDATABASE=nc_news_test
and  

  **.env.development** file with

    PGDATABASE=nc_news



To create and seed the database in the terminal run

    npm run setup-dbs
    npm run seed

To run the tests

    npm run test
