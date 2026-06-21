import postgres from "postgres";

const connectionString = process.env.SUPABASE_CONNECTION_STRING;
const sql = postgres(connectionString);

export default sql;
