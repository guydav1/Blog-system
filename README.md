# BlogSystem
## Angular and Node.js Based Website

Live Example: http://blog.guydav.com/

## How to run this project

Clone the repository to you desired location. 
Make sure to run 'npm install' on the main directory and ./server directory.

Create a .env file with the following vars in ./server directory:

| Variable | Explanation |
| ------ | ------ |
| mongoUrl | Your Mongo server URL.|
| SMTP_USER | Username of your NetCore API Account |
| SMTP_PASSWORD | Password of your NetCore API Account |
| JWT_STRING | A secret string used to sign your JWT tokens |

Once done, you can run `ng serve` on the main directory and `node server.js` on ./server directory.
