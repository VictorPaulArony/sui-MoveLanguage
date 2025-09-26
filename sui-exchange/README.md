# Sui Exchange

This project is a Sui-based exchange that allows users to swap between KES (Kenyan Shilling) and SUI tokens. The backend is powered by Node.js and interacts with the M-Pesa API for mobile payments. The frontend is a React application.

## Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or later)
*   [Docker](https://www.docker.com/)
*   [pnpm](https://pnpm.io/installation) (or npm/yarn)

## Backend Setup

### 1. Run MongoDB with Docker

Start a MongoDB instance using Docker:

```bash
docker run -d -p 27017:27017 --name mongodb mongo
```

### 2. Configure the M-Pesa Backend

1.  Navigate to the `backend/mpesa` directory:
    ```bash
    cd backend/mpesa
    ```
2.  Create a `.env` file and add the following environment variables:
    ```
    MONGODB_URI=mongodb://localhost:27017/sui-exchange
    BACKEND_URL=http://localhost:3000
    MPESA_CONSUMER_KEY=your_mpesa_consumer_key
    MPESA_CONSUMER_SECRET=your_mpesa_consumer_secret
    MPESA_BUSINESS_SHORT_CODE=your_mpesa_short_code
    MPESA_PASSKEY=your_mpesa_passkey
    MPESA_TRANSACTION_TYPE=CustomerPayBillOnline
    MPESA_CALLBACK_URL=https://your_ngrok_or_public_url/api/callback
    ```
    *   Replace the placeholder values with your actual M-Pesa credentials.
    *   Use a tool like [ngrok](https://ngrok.com/) to get a public URL for your local backend for the callback URL.

### 3. Install Dependencies and Run the Backend

1.  Install the dependencies:
    ```bash
    pnpm install
    ```
2.  Run the backend server:
    ```bash
    node mpesa.js
    ```
    The backend will be running at `http://localhost:3000`.

## Frontend Setup

### 1. Configure the Frontend

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Create a `.env` file and add the following environment variables:
    ```
    VITE_PACKAGE_ID=your_sui_package_id
    VITE_MODULE_NAME=contract
    VITE_SWAP_STATE_ID=your_sui_swap_state_id
    VITE_BACKEND_URL=http://localhost:3000
    ```
    *   Replace the placeholder values with your actual Sui contract details.

### 2. Install Dependencies and Run the Frontend

1.  Install the dependencies:
    ```bash
    pnpm install
    ```
2.  Run the frontend development server:
    ```bash
    pnpm dev
    ```
    The frontend will be running at `http://localhost:5173`.
