# RetroStore 🛒

A backend e-commerce project built with C# .NET Core (ASP.NET Web API) and Entity Framework Core, designed for buying and selling retro-themed products.

## 🚀 Technologies Used

* **Framework:** .NET Core / ASP.NET Web API
* **Database & ORM:** Entity Framework Core (with Migrations support)
* **Authentication & Security:** JWT (JSON Web Tokens) & BCrypt password hashing (`JwtService`, `PasswordService`)

## 📁 Project Structure

* **`Controllers/`**: API endpoints handling HTTP requests (`AdminController`, `AuthController`, `CartController`, `ProductsController`).
* **`Data/`**: Database context and seed data (`AppDbContext`, `DbSeeder`).
* **`Models/`**: Database entities, request/response DTOs (`Product`, `User`, `Order`, `CartItem`, etc.).
* **`Services/`**: Business logic services including JWT authentication and password hashing.

## ⚙️ Getting Started

Follow these steps to set up and run the project locally:

1. **Clone the repository:**
```bash
git clone <repo-url>
cd RetroStore-main/backend/RetroStoreApi

```


2. **Configure Settings:**
Update your database connection string and JWT secret keys in `appsettings.json` or `appsettings.Development.json`.
3. **Restore Dependencies & Run:**
```bash
dotnet restore
dotnet run

```



## 📌 Key Features

* User registration, login, and secure authentication via JWT.
* Product management and shopping cart functionality.
* Order processing and checkout workflows.
* Admin panel API management.
