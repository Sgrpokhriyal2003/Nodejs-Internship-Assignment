# School Management API

A RESTful API built with Node.js, Express, and MySQL for managing school information with location-based features.

## 🚀 Features

- **CRUD Operations**: Create, Read, Update, and Delete school records
- **Location-based Search**: Find schools near a specific location using coordinates
- **Distance Calculation**: Calculate distance between user location and schools
- **Data Validation**: Comprehensive input validation for all endpoints
- **MySQL Database**: Persistent data storage with connection pooling

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v14 or higher)
- MySQL Server
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sgrpokhriyal2003/Nodejs-Internship-Assignment
   cd NodeJs-Assignment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory with the following variables:
   ```env
   PORT=8000
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=your_database_name
   DB_PORT=3306
   ```

4. **Database Setup**
   - Create a MySQL database
   - The application will automatically create the `schools` table on startup

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:8000` (or the port specified in your .env file)

## 📚 API Endpoints

### Base URL
```
http://localhost:8000
```

### 1. Health Check
- **GET** `/`
- **Description**: Check if the API is running
- **Response**: API status and available endpoints

### 2. Add School
- **POST** `/api/school/addschools`
- **Description**: Add a new school to the database
- **Body**:
  ```json
  {
    "name": "School Name",
    "address": "School Address",
    "latitude": 12.9716,
    "longitude": 77.5946
  }
  ```
- **Response**: School ID of the created school

### 3. List Schools (with distance)
- **GET** `/api/school/listschools?lat=12.9716&lang=77.5946`
- **Description**: Get all schools sorted by distance from user location
- **Query Parameters**:
  - `lat`: User's latitude (required)
  - `lang`: User's longitude (required)
- **Response**: List of schools with distance calculations

### 4. Get School by ID
- **GET** `/api/school/:id`
- **Description**: Retrieve a specific school by its ID
- **Response**: School details

### 5. Update School
- **PUT** `/api/school/:id`
- **Description**: Update an existing school
- **Body**:
  ```json
  {
    "name": "Updated School Name",
    "address": "Updated Address",
    "latitude": 12.9716,
    "longitude": 77.5946
  }
  ```

### 6. Delete School
- **DELETE** `/api/school/:id`
- **Description**: Delete a school by its ID

## 🗄️ Database Schema

### Schools Table
```sql
CREATE TABLE schools (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    address VARCHAR(255) NOT NULL,
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 📦 Dependencies

### Production Dependencies
- `express`: Web framework for Node.js
- `mysql2`: MySQL client for Node.js
- `dotenv`: Environment variable management
- `morgan`: HTTP request logger middleware

### Development Dependencies
- `nodemon`: Auto-restart server during development

## 🔧 Configuration

The application uses the following environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 8000 |
| `DB_HOST` | MySQL host | localhost |
| `DB_USER` | MySQL username | - |
| `DB_PASSWORD` | MySQL password | - |
| `DB_NAME` | MySQL database name | - |
| `DB_PORT` | MySQL port | 3306 |

## 🧪 Testing

To test the API endpoints, you can use tools like:
- Postman
- cURL
- Thunder Client (VS Code extension)

### Example cURL Commands

**Add a school:**
```bash
curl -X POST http://localhost:8000/api/school/addschools \
  -H "Content-Type: application/json" \
  -d '{
    "name": "ABC School",
    "address": "123 Main Street",
    "latitude": 12.9716,
    "longitude": 77.5946
  }'
```

**Get schools near a location:**
```bash
curl "http://localhost:8000/api/school/listschools?lat=12.9716&lang=77.5946"
```

## 🏗️ Project Structure

```
NodeJs-Assignment/
├── db/
│   └── db.js              # Database configuration and utilities
├── routes/
│   └── school.route.js    # School-related API routes
├── server.js              # Main server file
├── package.json           # Project dependencies and scripts
└── README.md             # Project documentation
```

## 🔄 Future Enhancements

- Authentication and authorization
- School ratings and reviews
- Advanced filtering options
- Pagination for large datasets
- API rate limiting
- Unit and integration tests
