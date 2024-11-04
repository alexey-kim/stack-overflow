# Stack Overflow API

## Prerequisites
1. Node v22.11.0
2. Docker

## Project setup
1. Clone the repository `git clone git@github.com:alexey-kim/stack-overflow.git`.
2. Go to the newly created folder: `cd stack-overflow`.
3. Use Node v22.11.0, e.g. `nvm use 22.11.0`.
4. Make sure Docker is running.
5. Run the following script which will create `.env` file and start application and Postgresql database in Docker:
```
cd backend
npm run copy:env
docker compose up --build
```
6. Application should start on http://localhost:3002. Please confirm that this page returns `running: true` status.
7. Database schema should be auto-synchronised on the initial start (this is enabled in `development` mode only).
8. Next we need to seed test data into the database. Go to http://localhost:3002/seed-data (this is enabled in `development` mode only). After a short delay you should see a message that `Seeding of data is complete`. This should create 1,000 users with 100 questions each. So 100,000 questions in total.
9. Go to http://localhost:3002/api/v1/docs to view auto-generated Swagger docs which should be in sync with the latest code.
10. On Swagger page execute `/api/v1/users/login` request. username is `username123`, password is `password`. You should receive `jwt` token in the response. Copy it.
11.  Scroll to the top and click `Authorize` button and paste it into `bearerAuth` text field. Click `Authorize` button.
12.  Now you should be able to call all endpoints for 1 hour.

## Main dependencies (all latest versions as of 4 Nov 2024)
1. Typescript as the main programming language.
2. Postgresql for data persistence.
3. Express for REST APIs.
4. `routing-controllers` for scaffolding the endpoints.
5. `typeorm` as ORM for Postgresql.
6. `typedi` for dependency injection.
7. `routing-controllers-openapi` and `swagger-ui-express` for auto-generation of Swagger documentation based on the code.
8. `class-validator` and `class-transformer` for validation of incoming requests.
9. `jsonwebtoken` for JWT token signing/verification.
10. `sanitize-html` for validation/sanitizing of HTML (questions).
11. `bcryptjs` for hashing of user passwords.
12. Middlewares:
    1. `compression` for compressing responses.
    2. `cors` for CORS.
    3. `express-rate-limit` for rate limits.
    4. `helmet` for securing response headers.
    5. `morgan` for logging.
    6. `uuid` for assigning requestId to each request for troubleshooting.

## General structure
At high level the project is structured as Controllers - Services - Data Repositories.

Responsibilities of Controllers:
1. Expose REST API endpoints.
2. Validation of incoming requests.
3. Swagger documentation.

Responsibilities of Services:
1. Main business logic.
2. They consume Data Repositories and convert database responses to DTOs (data transfer objects) before returning data to Controllers. This way there is a decoupling between database entities and the actual responses that are sent back to the clients. One example is to ensure that user passwords are not exposed to the clients.

## Notes
1. `Database Ids`. For this project I used integers though for large scale applications it should be BigInts.
2. Each request is assigned a unique `RequestId` and then it is also added to the response as `x-request-id` header. I used uuid v7 which is considered to be the most performant version of uuid. The reason for using RequestIds is to simplify troubleshooting. In the age of micro-services and distributed systems in general it's common that we need to make lots of additional requests to other services or systems. By attaching the same RequestId to all of those requests it becomes much easier to see the entire lifecycle of a particular request, e.g. in tools like Grafana, etc.
3. `Validation`. As soon as request comes in, the first thing I do is its validation. I always prefer doing validation as soon as possible. Mainly because the risk grows significantly if invalid data is able to travel deeper into the system. I used `class-validator` to validate incoming data at runtime.
4. `Config validation`. Similarly to the point above, I always try to add validation around config values. If any of the config values is invalid then the application will fail to start. When it comes to configuration, I prefer the application to fail big quickly rather than start and silently fail later on.
5. `API versioning`. In this project there is no need for API versioning but I structured the code to make it easier to add another version later if needed.
6. `Validation of HTML (questions)`. This is a potentially serious security hole if we need to allow users to send user-edited HTML which will be displayed to other users. I used `sanitize-html` to sanitize HTML though I think this code needs further review in order to identify any potential risks. Alternatively, I was thinking of changing the format of data. Instead of receiving HTML, I was thinking of using JSON format to split HTML on the client into nodes. This way I think it would be much safer.
7. `Swagger documentation`. I tried to auto-generate as much of Swagger documentation as possible. The goal is to ensure that Swagger is always in sync with the latest code. It also provides examples of both requests and responses, all tied to the latest code.
8. `Pagination`. All endpoints that return lists of data are paginated (page, pageSize). In this implementation I used offset based pagination, though it's possible to implement a cursor based pagination. Each has its pros/cons. As an improvement I was thinking of adding sorting as well.
9. `Authentication`. There is a very basic implementation of authentication using JWT tokens. In real projects I would probably use existing service providers, e.g. Firebase, AWS Cognito, etc. They provide a lot more functionality, e.g. Google/Facebook/etc. sign-ins, multi-factor authentication, verification by email/SMS, etc.
10. `Authorization`. There is no authorization at all. I was thinking of adding role based authorization, e.g. only admins could see the list of all users. Roles can be even more granular, e.g. can see users, can edit users, can delete users, etc.
11. There are a few `magic numbers` in the code, there are a few places where I used `any`. This needs to be cleaned up.
12. `Error codes`. Similarly, at the moment I used numeric error codes, e.g. 400 for Bad Request. This needs to be moved to constants to make it more readable.
13. `Testing`. Due to time constraints I was not able to add sufficient number of unit tests. Though there are a few examples of tests just to show the general approach to testing.
14. `Linting / formatting` needs to be added/improved.
15. In general the code still needs some polishing.
