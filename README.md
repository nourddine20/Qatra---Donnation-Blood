
# 🩸 Qatra — Blood Donation App

Qatra is a full-stack web application to coordinate blood donations. It is divided into:

- **Backend:** Laravel RESTful API using Sanctum for authentication.
- **Frontend:** React app that consumes the API.

---

## 🗂 Project Structure

```
Qatra---Donnation-Blood/
├── qatra-backend/    # Laravel API (Laravel 10+)
└── qatra-frontend/   # React app (React 18+)
```

---

## 🚀 Getting Started

This guide will help you set up the project locally on your machine.

---

## ⚙️ Backend Setup (Laravel API)

### Prerequisites

- PHP >= 8.1
- Composer
- MySQL or other supported DB
- Node.js & npm (for Laravel Mix assets if used)
- Laravel CLI (optional)

### Installation Steps

1. **Navigate to the backend folder:**

```bash
cd qatra-backend
```

2. **Install dependencies:**

```bash
composer install
```

3. **Copy `.env` and configure environment:**

```bash
cp .env.example .env
```

Then open `.env` and configure:

```env
DB_DATABASE=your_db_name
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
SESSION_DOMAIN=localhost
SANCTUM_STATEFUL_DOMAINS=localhost:3000
```

4. **Generate app key and storage link:**

```bash
php artisan key:generate
php artisan storage:link
```

5. **Run database migrations (and seed if needed):**

```bash
php artisan migrate
# php artisan db:seed (optional)
```

6. **Serve the backend API:**

```bash
php artisan serve
```

API runs on: `http://127.0.0.1:8000`

---

## 🔐 Sanctum Setup Notes

Ensure CORS and cookie setup work properly:

- `SANCTUM_STATEFUL_DOMAINS=localhost:3000`
- `SESSION_DOMAIN=localhost`
- Enable credentials in CORS config if not already:

**In `config/cors.php`:**

```php
'supports_credentials' => true,
```

---

## 🌐 Frontend Setup (React)

### Prerequisites

- Node.js (v16 or later)
- npm or yarn

### Installation Steps

1. **Navigate to frontend folder:**

```bash
cd ../qatra-frontend
```

2. **Install React dependencies:**

```bash
npm install
# or
yarn install
```

3. **Create a `.env` file:**

```env
REACT_APP_API_URL=http://127.0.0.1:8000
```

4. **Run the frontend app:**

```bash
npm start
# or
yarn start
```

Frontend runs on: `http://localhost:3000`

---

## 🧪 Testing Authentication (Login, Register)

- Open your React app.
- Try to register or login using the UI.
- API cookies will be handled via `withCredentials`.

---

## 🗃 Technologies Used

- **Backend:** Laravel, Sanctum, MySQL
- **Frontend:** React, Axios, Bootstrap (optional)

---

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).

---

## 👤 Author

**Nourddine**  
GitHub: [@nourddine20](https://github.com/nourddine20)

Feel free to contribute, suggest improvements, or fork this repo! ❤️
