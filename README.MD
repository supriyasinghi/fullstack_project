# fullstack_project

Installing all the packages.
---------------------------
after node is installed in your system.

npm init
    This will create and initialize the package.json file.
    This file will contain list of all the packages and dependencies that are needed by the programs/current project. 

To install express, express-session, nodemon, pug, axios
--------------------------------------
    npm install express --save
    npm install express-session
    npm install --save-dev nodemon
    npm install pug --save
    npm install axios

How to run the file.
----------------------
    node <filename>     or
    nodemon <filename>                 --> it starts the server at the mentioned port in the .js file.
    npm start
        This command will work for all the .js files. 
        We need to change the file name under script >> start option in package.json file.

How to Debug the file
-------------------------
    node --inspect <filename>          --> to debug the particular <filename>.
    node --inspect-brk <filename>      --> this will let us debug at every breakpoint that we have put.
    OR
    nodemon --inspect <filename>       --> to debug the particular <filename>.
    nodemon --inspect-brk <filename>   --> this will let us debug at every breakpoint that we have put.

To stop or exit from the running <filename> use CTRL+C, followed by yes / no option.

npm start
    This Command will start and run the file <filename> mentioned in package.json file in start option by default.