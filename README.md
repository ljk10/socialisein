# SocialiseIn (Simple LinkedIn-Style App)

SocialiseIn is a full-stack MERN application built from scratch, inspired by the core functionality of LinkedIn. It allows users to sign up, log in, create posts, and interact with other users' profiles and content. This project was built to demonstrate key full-stack development skills, including user authentication, REST API design, database management, and frontend deployment.

### [View the Live Demo](https://resilient-longma-28581e.netlify.app/)

*(Note: The free backend server on Render may take 30-60 seconds to "wake up" on the first visit.)*

---

## ✨ Features

* **Full User Authentication:** Secure signup and login (JWT & bcrypt).
* **Create Posts:** Logged-in users can create and share text-based posts.
* **Public Feed:** A central feed where all users' posts are displayed, with the newest first.
* **Delete Posts:** Users can delete their own posts.
* **User Search:** A real-time search bar to find other users by name.
* **View Profiles:** Click on any user's name to see their dedicated profile page.
* **Profile Personalization:** Users can edit their own profile to add/update their **Name**, **Headline**, and **Bio**.

---

## 🛠️ Tech Stack

This project was built using the MERN stack and deployed to the cloud.

* **Frontend:**
    * **React.js**
    * **React Router:** For client-side routing.
    * **Axios:** For making requests to the backend API.
* **Backend:**
    * **Node.js**
    * **Express.js:** For the REST API framework.
    * **MongoDB:** As the document database.
    * **Mongoose:** As the object-data modeling (ODM) library.
    * **jsonwebtoken (JWT):** For authorization.
    * **bcrypt.js:** For password hashing.
* **Deployment:**
    * **Frontend:** Deployed on **Netlify**.
    * **Backend:** Deployed on **Render**.

---

## 🚀 How to Run Locally

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js (v18 or higher)
* npm
* Git
* A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (for your `MONGO_URI`)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/ljk10/socialisein.git](https://github.com/ljk10/socialisein.git)
    cd socialisein
    ```

2.  **Set up the Backend:**
    ```sh
    # Go into the backend folder
    cd backend

    # Install dependencies
    npm install

    # Create a .env file in the /backend folder
    # and add your variables:
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_secret_key_for_jwt

    # Start the backend server (on localhost:5000)
    node index.js
    ```

3.  **Set up the Frontend:**
    (Open a new terminal for this)
    ```sh
    # Go into the frontend folder
    cd frontend

    # Install dependencies
    npm install

    # Start the frontend app (on localhost:3000)
    npm start
    ```

Your app will open automatically in your browser at `http://localhost:3000` and will be connected to your local backend server.

---

## 🗺️ API Endpoints

The following REST API routes were created for this project:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/api/auth/signup` | Register a new user. |
| **POST** | `/api/auth/login` | Log in a user and get a token. |
| **GET** | `/api/posts` | Get all posts from all users. |
| **POST** | `/api/posts` | Create a new post (Protected). |
| **DELETE** | `/api/posts/:id` | Delete a post (Protected, owner only). |
| **GET** | `/api/posts/user/:userId` | Get all posts from a specific user. |
| **GET** | `/api/users/:id` | Get a user's profile information. |
| **GET** | `/api/users?search=...`| Search for users by name. |
| **PUT** | `/api/users/profile` | Update the logged-in user's profile (Protected). |
