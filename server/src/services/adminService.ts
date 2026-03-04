import sql from "../../db";
import { deletePost } from "../controllers/PostController";

export class AdminService {
  // --- User Management ---
  async getAllUsers() {
    return await sql`
      SELECT student_id, first_name, last_name, email, role, status, created_at, updated_at
      FROM "User"
      ORDER BY created_at DESC
    `;
  }

  async getUserDetails(student_id: number) {
    const user = await sql`
      SELECT student_id, first_name, last_name, email, role, status, created_at, updated_at
      FROM "User"
      WHERE student_id = ${student_id}
      LIMIT 1
    `;

    if (user.length === 0) return null;

    const posts = await sql`
      SELECT post_id, title, status, created_at
      FROM "Post"
      WHERE student_id = ${student_id}
      ORDER BY created_at DESC
    `;

    return { ...user[0], posts };
  }

  async updateUserStatus(
    student_id: number,
    status: "ACTIVE" | "BANNED" | "INACTIVE",
  ) {
    const updated = await sql`
      UPDATE "User"
      SET status = ${status}::"UserStatus", updated_at = NOW()
      WHERE student_id = ${student_id}
      RETURNING student_id, first_name, last_name, email, status
    `;
    return updated[0] || null;
  }

  // --- Listing Management ---
  async getAllListings() {
    return await sql`
      SELECT p.post_id, p.title, p.status, p.created_at, u.first_name, u.last_name,
             (SELECT count(*) FROM "report" r WHERE r.post_id = p.post_id) as report_count
      FROM "Post" p
      JOIN "User" u ON p.student_id = u.student_id
      ORDER BY p.created_at DESC
    `;
  }

  async deletePost(post_id: number) {
    return await sql.begin(async (tx: any) => {
      // Clean up relations
      await tx`DELETE FROM "post_image" WHERE post_id = ${post_id}`;
      await tx`DELETE FROM "post_category" WHERE post_id = ${post_id}`;
      await tx`DELETE FROM "favorite" WHERE post_id = ${post_id}`;
      await tx`DELETE FROM "report" WHERE post_id = ${post_id}`;

      const deleted = await tx`
        DELETE FROM "Post"
        WHERE post_id = ${post_id}
        RETURNING post_id, title
      `;
      return deleted[0] || null;
    });
  }

  // --- Report Management ---
  async getAllReports() {
    return await sql`
      SELECT r.report_id, r.reason, r.description, r.status, r.created_at,
             p.post_id, p.title as post_title,
             u.first_name as reporter_name, u.last_name as reporter_surname
      FROM "report" r
      JOIN "Post" p ON r.post_id = p.post_id
      JOIN "User" u ON r.reporter_id = u.student_id
      ORDER BY r.created_at DESC
    `;
  }

  async getReportDetails(report_id: number) {
    const report = await sql`
      SELECT r.report_id, r.text, r.created_at,
             p.post_id, p.title as post_title, p.description as post_description,
             u.student_id as reporter_id, u.first_name as reporter_name, u.last_name as reporter_surname
      FROM "report" r
      JOIN "Post" p ON r.post_id = p.post_id
      JOIN "User" u ON r.reporter_id = u.student_id
      WHERE r.report_id = ${report_id}
      LIMIT 1
    `;
    return report[0] || null;
  }

  async resolveReport(report_id: number) {
    // 1. หา post_id จาก report_id ตัวที่ถูกกดเข้ามาก่อน
    // ใช้ชื่อ column ให้เป๊ะตาม table (เช็คว่าใน Neon ชื่อ post_id หรือ id)
    const reportData = await sql`
    SELECT post_id FROM "report" WHERE report_id = ${report_id}
  `;

    if (!reportData || reportData.length === 0) return null;
    const targetPostId = reportData[0].post_id;

    try {
      // 2. ใช้ Transaction (sql.begin)
      return await sql.begin(async (sql) => {
        // Step A: ลบรายงาน "ทุกตัว" ที่แจ้งโพสต์นี้
        // เพื่อป้องกัน Foreign Key Error จากรายงานคนอื่นที่แจ้งโพสต์เดียวกัน
        await sql`
        DELETE FROM "report"
        WHERE post_id = ${targetPostId}
      `;

        // Step B: ลบโพสต์ต้นทาง
        // *** เช็คใน Neon ของคุณว่าตาราง post ใช้ชื่อ column ว่า "id" หรือ "post_id" ***
        const deletedPost = await sql`
        DELETE FROM "post"
        WHERE id = ${targetPostId} 
        RETURNING id
      `;

        return { success: true, post_id: targetPostId };
      });
    } catch (err: any) {
      // พ่น error ออกมาที่ Terminal ของ Backend เพื่อดูสาเหตุที่แท้จริง
      console.error("Neon DB Error:", err.message);
      throw new Error(err.message);
    }
  }
}

export const adminService = new AdminService();
