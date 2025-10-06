## Backend overview:
The backend of this project is powered by Hasura GraphQL Engine, providing a scalable, real-time API layer on top of the database.
It handles all CRUD operations, authentication rules, and data relationships automatically through GraphQL schemas — no need to write traditional REST endpoints.

## Architecture
+ Hasura GraphQL Engine runs on top of PostgreSQL
+ Clerk Authentication integrated via JWT claims
+ Frontend interacts directly with Hasura's GraphQL endpoint
+ Custom resolvers/ actions handle advanced logic (analytics, reports, etc. )

## Backend Structure
```
backend/
├── hasura/
│   ├── metadata/             
│   ├── migrations/            
│   └── config.yaml            
├── actions/                   
│   └── analytics.js
└── docker-compose.yml  
```

## Start Hasura+PostgreSQL with Docker
```bash
docker-compose up -d
hasura console
```