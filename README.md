# Forum API

A RESTful API for a forum platform built with **Node.js** and **Express**, following **Clean Architecture** principles. Supports threads, comments, replies, likes, and JWT-based authentication.

## Tech Stack

- **Runtime:** Node.js (ESM)
- **Framework:** Express.js v5
- **Database:** PostgreSQL
- **Auth:** JWT (Access & Refresh Token)
- **Testing:** Vitest + Supertest
- **Migration:** node-pg-migrate
- **CI/CD:** GitHub Actions → AWS EC2

## Features

- ✅ Register & login with JWT authentication (access + refresh token)
- ✅ Create, read, and list threads with **pagination**
- ✅ Add & soft-delete comments
- ✅ Add & soft-delete replies
- ✅ Like / unlike comments
- ✅ Clean Architecture (Domain → Application → Infrastructure)
- ✅ Unit & integration tests with coverage report
- ✅ CI/CD pipeline with GitHub Actions

## Architecture

This project follows **Clean Architecture** with clear separation of concerns:

```
src/
├── Domains/          # Business entities & repository interfaces
├── Applications/     # Use cases (business logic)
├── Infrastructures/  # DB, external services, framework config
└── Interfaces/       # HTTP handlers & routes
```

## API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/users` | ❌ | Register user |
| POST | `/authentications` | ❌ | Login |
| PUT | `/authentications` | ❌ | Refresh token |
| DELETE | `/authentications` | ❌ | Logout |

### Threads
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/threads?page=1&limit=10` | ❌ | List threads (paginated) |
| GET | `/threads/:threadId` | ❌ | Get thread detail |
| POST | `/threads` | ✅ | Create thread |

### Comments
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/threads/:threadId/comments` | ✅ | Add comment |
| DELETE | `/threads/:threadId/comments/:commentId` | ✅ | Delete comment |

### Replies
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/threads/:threadId/comments/:commentId/replies` | ✅ | Add reply |
| DELETE | `/threads/:threadId/comments/:commentId/replies/:replyId` | ✅ | Delete reply |

### Likes
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| PUT | `/threads/:threadId/comments/:commentId/likes` | ✅ | Toggle like comment |

## Getting Started

### Prerequisites

- Node.js >= 18
- PostgreSQL

### Installation

```bash
# Clone the repo
git clone https://github.com/farisderz/forum-api.git
cd forum-api

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env          # for development & production
cp .env.example .env.test     # for testing

# Fill in your DB credentials and JWT secrets
# Make sure PGDATABASE in .env.test is different from .env
# NODE_ENV is not required in .env.test — automatically set by Vitest
```

## Environment Variables

This project uses two environment files:

### `.env` (development & production)
```env
# HTTP SERVER
NODE_ENV=development
PORT=3000

# POSTGRES
PGHOST=localhost
PGUSER=postgres
PGDATABASE=forumapi
PGPASSWORD=your_password
PGPORT=5432

# TOKENIZE
ACCESS_TOKEN_KEY=your_access_token_secret
REFRESH_TOKEN_KEY=your_refresh_token_secret
ACCESS_TOKEN_AGE=3000
```

### `.env.test` (testing)
```env
# NODE_ENV is not required — automatically set to "test" by Vitest

# HTTP SERVER
PORT=3000

# POSTGRES
PGHOST=localhost
PGUSER=postgres
PGDATABASE=forumapi_test
PGPASSWORD=your_password
PGPORT=5432

# TOKENIZE
ACCESS_TOKEN_KEY=your_access_token_secret
REFRESH_TOKEN_KEY=your_refresh_token_secret
ACCESS_TOKEN_AGE=3000
```

### Database Setup

```bash
# Run migrations
npm run migrate up

# For test database
npm run migrate:test up
```

### Running the App

```bash
# Development
npm run start:dev

# Production
npm start
```

## Testing

```bash
# Run all tests
npm test

# With coverage
npm run test:coverage
```

## Pagination

The `GET /threads` endpoint supports pagination via query parameters:

```
GET /threads?page=1&limit=10
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "threads": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 42,
      "totalPages": 5
    }
  }
}
```

- Default: `page=1`, `limit=10`
- Max limit: `50`

## CI/CD

This project uses **GitHub Actions** for automated testing and deployment to **AWS EC2**:

1. On every push to `main`: run lint + tests
2. On passing tests: SSH deploy to EC2 and restart the app

## License

ISC — [BonzzSysSec](https://github.com/BonzzSysSec)
