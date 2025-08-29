import { RowDataPacket } from "mysql2";
import { pool } from "../server";
import { AdminSummary } from "../types/adminTypes";

export const getAdminSummaryModel = async (): Promise<AdminSummary> => {
  const [rows] = await pool.query<AdminSummary[] & RowDataPacket[]>(
    `SELECT 
        (SELECT COUNT(*) FROM books) AS numOfBooks,
        (SELECT COUNT(*) FROM users) AS numOfUsers`
  );

  return rows[0]; // returns 1 line
};
