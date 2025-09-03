# BUS_RESERVATION
The User Module handles authentication, registration, and profile management. It provides secure access to the system using JWT-based authentication and enforces role-based access control for Admins and Customers.

Features

User Registration

New users (customers) can register with name, email, phone, and password.

Passwords are stored securely using BCrypt hashing.

User Login

Registered users can log in using email & password.

A JWT token is generated on successful authentication and used for API requests.

Role Management

Admin: Manage buses, routes, schedules, pricing, and reports.

Customer: Search trips, book seats, make payments, and download tickets.

Profile Management

Customers can update their profile details.

Each user is mapped 1–1 with customer details (extended profile).
