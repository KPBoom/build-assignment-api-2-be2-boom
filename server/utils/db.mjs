// Create PostgreSQL Connection Pool here !
import * as pg from "pg";
const { Pool } = pg.default;

const connectionPool = new Pool({
  connectionString:
    "postgresql://postgres:31102532@localhost:5432/LMS assignment SQL code",
});

export default connectionPool;
