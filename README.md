# Real-Time Hardware Status Tracker

## Overview

The Real-Time Hardware Status Tracker is a web application designed to monitor and track the status of various hardware components such as CPU, RAM, Disk, and Network interfaces in real-time. The application provides users with the ability to set thresholds for CPU and Disk usage, and it sends email alerts if these thresholds are exceeded. The system also supports real-time data visualization using Socket.IO.

## Features

- Real-time monitoring of CPU load, RAM usage, Disk usage, and Network traffic.
- User-configurable thresholds for CPU and Disk usage.
- Email alerts when hardware usage exceeds the configured thresholds.
- Historical data tracking for CPU usage with average, minimum, and maximum values.
- Interactive web interface for monitoring system status and setting user preferences.

## Getting Started

### Prerequisites

- Node.js (>=14.x)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/realtime-hardware-status-tracker.git
    cd realtime-hardware-status-tracker
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory and configure the following environment variables:
    ```bash
    PORT=3000
    MONGODB_URI=mongodb://localhost:27017/your-database-name
    EMAIL_SERVICE=your-email-service
    EMAIL_USER=your-email@example.com
    EMAIL_PASS=your-email-password
    ```

4. Start the MongoDB server if it's not already running:
    ```bash
    mongod
    ```

### Running the Application

1. Start the server:
    ```bash
    npm start
    ```

2. Open your browser and navigate to `http://localhost:3000` to access the web interface.

## Project Structure

- **/models**: Contains Mongoose models for CPU, RAM, Disk, Network status, and User settings.
- **/routes**: Express routes for handling API requests.
- **/services**: Contains the email service logic.
- **/utils**: Utility functions for fetching system information.
- **/public**: Static files served by Express (HTML, CSS, JavaScript).
- **/serverUtils**: Contains the functions to initialize the HTTP server, Socket.IO server, and database connection.

## API Endpoints

- `POST /api/set-max-values`: Sets user preferences for max CPU and Disk usage.
  - Request Body:
    ```json
    {
      "maxCpu": 80,
      "maxDisk": 90,
      "email": "user@example.com"
    }
    ```

## How It Works

1. **Server Initialization**: The HTTP and Socket.IO servers are initialized, and the database connection is established.
2. **System Monitoring**: The server periodically fetches system information (CPU, RAM, Disk, Network) and saves it to the database.
3. **Real-Time Updates**: The server emits system information and CPU statistics to connected clients via Socket.IO.
4. **User Settings and Alerts**: Users can set thresholds for CPU and Disk usage through the web interface. If the thresholds are exceeded, an email alert is sent to the configured email address.
