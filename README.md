
# IP to Country API

This project is a Node.js application that provides an API to retrieve the country associated with a given IP address. The application uses two third-party services (IP Stack and IP API) to fetch the country information and includes rate limiting to manage API requests. The application also implements caching to store and retrieve IP address lookups, improving performance.

## Table of Contents

- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)


## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/pratikbhat89/forter-pratik.git
   ```

2. Navigate to the project directory:

   ```bash
   cd forter-pratik
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

## Environment Variables

Create a `.env` file in the root of your project and set the following environment variables:

```env
PORT=3000
IP_STACK_API_KEY=509565499448f6b73345a106496f04cf
IP_STACK_RATE_LIMIT=2
IP_API_RATE_LIMIT=2
```

- **PORT**: The port on which the server will run.
- **IP_STACK_API_KEY**: Your API key for the IP Stack service.
- **IP_STACK_RATE_LIMIT**: The rate limit for the IP Stack API (requests per hour).
- **IP_API_RATE_LIMIT**: The rate limit for the IP API (requests per hour).

## Usage

1. Start the server:

   ```bash
   npm start
   ```

2. The server will be running at `http://localhost:3000`.

## API Endpoints

### GET `/ip-to-country/:ip`

Fetches the country information for the provided IP address.

#### Parameters

- `ip` (string): The IP address to look up.

#### Responses

- **200 OK**: Returns the country associated with the IP address.
- **400 Bad Request**: Returns an error if the IP address is invalid or not provided.
- **429 Too Many Requests**: Returns an error if the rate limit is exceeded.

#### Example Request

```bash
GET http://localhost:3000/ip-to-country/101.2.127.203
```

#### Example Response

```json
{
  "country": "India"
}
```

## Testing

### Unit Tests

To run the unit tests:

```bash
npm run test:unit
```

### End-to-End Tests

To run end-to-end tests using Cypress:

1. Make sure the server is running:

   ```bash
   npm start
   ```

2. In a separate terminal, run Cypress:

   ```bash
   npm run test:e2e
   ```

3. Select and run the tests.

### CI Tests
   ```bash
   npm run ci
   ```