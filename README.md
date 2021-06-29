# BlogSystem

## Angular, Node.js(Express), MongoDB Based Website

###[Live Example](http://blog.guydav.com/)

## How to run this project

Clone the repository to you desired location. Make sure to run 'npm install' on the main directory and ./server directory.

Create a .env file with the following vars in ./server directory:

| Variable              | Explanation                                  |
| --------------------- | -------------------------------------------- |
| mongoUrl              | Your Mongo server URL.                       |
| SMTP_USER             | Username of your NetCore API Account         |
| SMTP_PASSWORD         | Password of your NetCore API Account         |
| SMTP_FROM             | NetCore API email address                    |
| SMTP_TO               | NetCore authorized recipients Email address  |
| JWT_STRING            | A secret string used to sign your JWT tokens |
| AWS_ACCESS_KEY_ID     | AWS access key id                            |
| AWS_SECRET_ACCESS_KEY | AWS secret key                               |
| AWS_S3_REGION         | AWS S3 region                                |
| AWS_S3_BUCKET         | AWS S3 bucket name                           |

Once done, you can run `ng serve` on the main directory and `node server.js` on ./server directory.

## How to deploy the project

Use the `ng build --prod` command to make a dist folder in the /server directory. Deploy the entire /server directory to your prefered host.
