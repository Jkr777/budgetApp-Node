* For the reset password logic, you need to add your SENDGRID_API_KEY and a valid reset link. The file path is ('./routes/reset.js')

* about:
  - This project uses mongoDB database.
  - Express framework was used to create the server.
  - I used Json Web Token(JWT) to create a Token Based Authentication.

* dependencies:
    - "@sendgrid/mail" // Mail Service for the SendGrid v3 Web API
    - "bcrypt" // used to hash the password
    - "compression" // used to compress the server response
    - "cors" // used to handle Cross-Origin Resource Sharing
    - "express" // a framework for Node.js
    - "express-async-errors" // used to handle async errors
    - "helmet" // helps you secure your Express apps
    - "joi" // adds request validation
    - "jsonwebtoken" // used to create JSON-based access tokens
    - "lodash" // a JavaScript utility library 
    - "mongoose" // an Object Data Modeling (ODM) library for MongoDB
    - "mongoose-float" // used to solve JavaScript number imprecision
    - "winston" // a logging library
