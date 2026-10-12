import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "5000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  jwt: {
    secret: process.env.JWT_SECRET || "radhix_erp_super_secure_jwt_token_secret_key_2026",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },
  database: {
    client: process.env.DATABASE_CLIENT || "sqlite3",
    filename: process.env.DATABASE_FILENAME || "./radhix_erp.sqlite",
    connectionString: process.env.DATABASE_URL || "",
  },
};
