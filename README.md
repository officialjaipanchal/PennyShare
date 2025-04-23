# 💸 PennyShare

**AI-Powered Group Expense Management & Financial Insights**

PennyShare helps users manage group finances through intelligent automation, offering natural language queries, insights, and real-time expense tracking. Built with Node.js, MongoDB, and OpenAI GPT APIs.

---

## 🧱 Features

- Create and manage groups for trips, households, events, etc.
- Add and split expenses among group members.
- Track total/group/category-wise expenses.
- Generate financial summaries using a chatbot powered by OpenAI.
- Settle balances and visualize who owes whom.
- RESTful API with JWT-based authentication.

---

## 🚀 Tech Stack

- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **AI Integration:** OpenAI (GPT-3.5/4)
- **Authentication:** JWT
- **Environment:** `.env` configuration
- **Logging:** Custom middleware for logging requests and errors

---

## ⚙️ Prerequisites

Ensure the following are installed:

- **Node.js** (v18+)
- **MongoDB** (local or Atlas)
- **npm** (comes with Node)

---

## 🛠️ Installation

```bash
# Clone the repo
git clone https://github.com/officialjaipanchal/pennyshare.git
cd pennyshare

# Install dependencies
npm install
```

---

## 📄 Environment Setup

Create a `.env` file in the root directory:

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/pennyshare
ACCESS_TOKEN_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_key
DISABLE_API_AUTH=false
```

---

## 🧪 Run the App

```bash
npm start
```

Server will run on `http://localhost:3001`

---

## 🧾 API Endpoints

### 🔐 Auth Routes

```
POST   /api/users/v1/register         # Register a new user
POST   /api/users/v1/login            # Login and get JWT
POST   /api/users/v1/view             # View user details
POST   /api/users/v1/edit             # Edit user profile
POST   /api/users/v1/updatePassword   # Change user password
DELETE /api/users/v1/delete           # Delete user
```

### 👥 Group Routes

```
POST   /api/group/v1/add              # Create new group
POST   /api/group/v1/view             # View group details
POST   /api/group/v1/user             # Get groups for a user
POST   /api/group/v1/edit             # Edit group
DELETE /api/group/v1/delete           # Delete group
POST   /api/group/v1/settlement       # View balance sheet
POST   /api/group/v1/makeSettlement   # Make a settlement
```

### 💸 Expense Routes

```
POST   /api/expense/v1/add            # Add expense
POST   /api/expense/v1/edit           # Edit expense
DELETE /api/expense/v1/delete         # Delete expense
POST   /api/expense/v1/view           # View individual expense
POST   /api/expense/v1/group          # View group expenses
POST   /api/expense/v1/user           # View user expenses
POST   /api/expense/v1/user/recent    # View recent expenses
POST   /api/expense/v1/group/categoryExp  # Category breakdown for group
POST   /api/expense/v1/user/categoryExp   # Category breakdown for user
```

### 🤖 AI Financial Assistant

```
POST   /api/financial-query/          # Ask financial questions (requires auth)
```

Sample JSON:
```json
{
  "query": "How much did I spend last month?"
}
```

---

## 🧪 Testing APIs

You can test the API using:

- **Postman**
- **cURL**
- **Swagger (if integrated)**
- Or connect to a frontend

---

## 📁 Project Structure

```
/components          # Controllers
/routes              # Routers
/models              # Mongoose schemas
/middleware          # Auth + Logger middleware
/helper              # Validation and log utilities
.env                 # Environment variables
app.js               # Main server entry point
```

---

