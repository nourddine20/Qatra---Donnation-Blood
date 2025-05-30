
# 🩸 Qatra — Blood Donation App

A full-stack blood donation application with a Laravel API backend and React frontend. The backend uses Laravel Sanctum for secure authentication.

## Features
- User registration and login with Laravel Sanctum (API token authentication)
- Blood donation request management
- React frontend with Axios for API calls
- Responsive design and user-friendly interface

## Prerequisites

- Node.js v22.15.1
- PHP 8.1
- Composer
- MySQL or any compatible database

## Backend Setup (Laravel API)

1. Clone the repository and navigate to the backend folder:
   ```bash
   git clone https://github.com/nourddine20/Qatra---Donnation-Blood.git
   cd Qatra---Donnation-Blood/qatra-backend
   ```

2. Install PHP dependencies:
   ```bash
   composer install
   ```

3. Copy the `.env.example` file to `.env` and configure your database and other settings:
   ```bash
   cp .env.example .env
   ```

4. Generate the application key:
   ```bash
   php artisan key:generate
   ```

5. Run migrations and seeders (if any):
   ```bash
   php artisan migrate --seed
   ```

6. Start the Laravel development server:
   ```bash
   php artisan serve
   ```

## Frontend Setup (React)

1. Navigate to the frontend folder:
   ```bash
   cd ../qatra-frontend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

4. Open your browser at `http://localhost:3000`

## Notes

- Ensure the Laravel backend is running (default at `http://127.0.0.1:8000`) before starting the React frontend to allow API requests.
- Sanctum is configured for SPA authentication using cookies; make sure both frontend and backend run on compatible domains or configure CORS accordingly.

---
Feel free to customize the `.env` files as needed for your environment.
