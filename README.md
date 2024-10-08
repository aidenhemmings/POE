# International Bank App

This project provides an Express-based API for handling user authentication, login, and logout functionalities. It uses MongoDB for database storage, JSON Web Tokens (JWT) for authentication, `bcrypt` for password hashing, `express-brute` for brute-force protection, and CSRF protection for secure requests.

## Features

- **User Login**
  - Users can log in with their email and password.
  - A JWT is generated upon successful login, which is stored in an HTTP-only cookie for security.
  - Includes brute-force protection with `express-brute` to limit login attempts.

- **User Logout**
  - Users can log out, which clears the JWT cookie.

- **CSRF Protection**
  - Implements CSRF tokens to secure forms and sensitive requests.

- **HTTPS Support**
  - Uses SSL certificates for secure HTTPS communication.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT, Bcrypt, CSRF
- **Brute-Force Protection**: Express-Brute
- **Security**: HTTPS, CSRF tokens, Cookie-based authentication

## Security Features

- **CSRF Protection**: Enabled using the csrf middleware with HTTP-only cookies.
- **JWT Authentication**: Token-based authentication using JWTs stored in secure cookies.
- **HTTPS**: The server is configured to use SSL certificates for secure communication.
- **Password Hashing**: All user passwords are hashed using bcrypt.

## Acknowledgements

- bcrypt for password hashing.
- jsonwebtoken for JWT handling.
- mongoose for MongoDB integration.
- express-brute for brute-force protection.
- csrf for CSRF protection.

## License

This project is licensed under the MIT License. Feel free to use, modify, and distribute it as needed.
