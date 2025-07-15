📊 Event Management API


🚀 Tech Stack
Node.js

Express.js

PostgreSQL (Neon)

dotenv

uuid

git clone https://github.com/your-username/event-management-api.git
cd event-management-api

npm install

node app.js

| Method | Endpoint     | Description   |
| ------ | ------------ | ------------- |
| POST   | `/api/users` | Create a user |

{
    "name": "Dummy",
    "email": "dummy@gmail.com"
}

| Method | Endpoint                   | Description             |
| ------ | -------------------------- | ----------------------- |
| POST   | `/api/events`              | Create an event         |
| GET    | `/api/events/:id`          | Get event details       |
| POST   | `/api/events/:id/register` | Register user for event |
| POST   | `/api/events/:id/cancel`   | Cancel registration     |
| GET    | `/api/events`              | List upcoming events    |
| GET    | `/api/events/:id/stats`    | Get event statistics    |


📖 Example: Create Event
POST /api/events


{
    "title": "Blockchain Conference",
    "date_time": "2025-08-01T10:00:00Z",
    "location": "Delhi",
    "capacity": 100
}

📏 Business Logic (Implemented ✅)

Validate user input (name, email, capacity)

Prevent double registrations

No registration allowed for past events

Enforce event capacity limits

Return proper HTTP status codes and clear JSON messages

👏 Author
Built by Himanshu
Using Neon + Node.js + Express.js
