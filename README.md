# Approval BE — Invoice Management Backend

NestJS + TypeORM + MySQL + JWT + RBAC + SSE.

## Tech Stack

- NestJS 10
- TypeORM + MySQL
- JWT Authentication
- RBAC (Admin, Approver, Viewer)
- SSE (Server-Sent Events) for real-time approval

## Quick Start

1. Setup MySQL database:
```sql
CREATE DATABASE approval_db;
```

2. Configure `.env`:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=password
DB_NAME=approval_db
JWT_SECRET=your-secret-key
```

3. Run:
```bash
npm install
npm run dev        # Dev server at http://localhost:3000
```

## API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/login` | No | Login → JWT |
| POST | `/auth/register` | No | Register new user |

### Invoices
| Method | Endpoint | Auth | Roles |
|--------|----------|------|-------|
| GET | `/invoices` | JWT | All |
| GET | `/invoices/:id` | JWT | All |
| POST | `/invoices/:id/approve` | JWT | Admin, Approver |
| POST | `/invoices/:id/reject` | JWT | Admin, Approver |
| GET | `/invoices/:id/events` | None | SSE stream |

## SSE Flow

```
POST /invoices/1/approve
  → Update DB
  → Broadcast SSE to all clients subscribed to invoice 1

GET /invoices/1/events (EventSource)
  ← event: connected (initial state)
  ← event: status_changed (real-time update)
```

## RBAC

| Role | Permissions |
|------|------------|
| Admin | View + Approve/Reject all |
| Approver | View + Approve/Reject all |
| Viewer | View only |
