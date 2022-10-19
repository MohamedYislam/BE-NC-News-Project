## NC News API

------------------------

NC news is a RESTful API designed to be the backend of a news app with similar fucntionality to social media sites and forums. It has been built with Node.js and Express, PostgreSQL was used to access and manipulate the database, and heroku used to host the app.

The API can 
-   Retrieve articles, topics, users and comments
-   Querying articles and sorting them by features such as date the article was created, the user who posted the article,  total votes and comment count
- Filter by topic name
- Vote on articles
- Post new coments or Delete existing ones


-------

## Hosted Version

List of all the endpoints :  https://news-app-msy.herokuapp.com/api/

Some examples: 
- https://news-app-msy.herokuapp.com/api/articles/12/comments

- https://news-app-msy.herokuapp.com/api/articles?topic=coding

- https://news-app-msy.herokuapp.com/api/articles?sortBy=comment_count&&order=desc




----



## SETUP

First clone the repo by copying the code below into your terminal

    git clone https://github.com/MohamedYislam/backend-news-project
    
The dependencies used are:

    -Jest
    -Jest-extended
    -Jest-sorted
    -Express
    -Supertest
    -pg
    -pg-format

To add them all, in the terminal type

    npm install


Then add two new files

 an **.env.test** file containing

    PGDATABASE=nc_news_test
and a **.env.development** file

    PGDATABASE=nc_news




Following this to create and seed the database run

    npm run setup-dbs
    npm run seed



The minimimum requirement to run this database is