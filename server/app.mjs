import express from "express";
import pool from "./utils/db.mjs";
import connectionPool from "./utils/db.mjs";
const app = express();
const port = 4001;

app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀");
});

app.get("/assignments", async (req, res) => {
  try {
    const result = await pool.query("select * from assignments");

    return res.status(200).json({
      data: result.rows,
    });
  } catch {
    return res.status(500).json({
      message: "Server could not read assignment because database connection",
    });
  }
});

app.get("/assignments/:assignmentId", async (req, res) => {
  const assignmentIdFromClient = req.params.assignmentId;
  let result;
  try {
    result = await pool.query(
      "select * from assignments where assignment_id=$1",
      [assignmentIdFromClient]
    );
  } catch {
    return res.status(500).json({
      message: "Server could not read assignment because database connection",
    });
  }
  if (!result.rows[0]) {
    return res.status(404).json({
      message: "Server could not find a requested assignment",
    });
  }
  return res.status(200).json({
    data: result.rows[0],
  });
});

app.put("/assignments/:assignmentId", async (req, res) => {
  const assignmentIdFromClient = req.params.assignmentId;
  const updateAssign = { ...req.body, updated_at: new Date() };
  if (!assignmentIdFromClient) {
    return res.status(404).json({
      message: "Server could not find a requested assignment to update",
    });
  }

  try {
    await connectionPool.query(
      `update assignments
    set title = $2,
        content = $3,
        category = $4,
        updated_at = $5
        where assignment_id = $1`,
      [
        assignmentIdFromClient,
        updateAssign.title,
        updateAssign.content,
        updateAssign.category,
        updateAssign.updated_at,
      ]
    );
  } catch {
    return res.status(500).json({
      message: "Server could not update assignment because database connection",
    });
  }

  return res.status(200).json({
    message: "Updated assignment sucessfully",
  });
});

app.delete("/assignments/:assignmentId", async (req, res) => {
  const assignmentIdFromClient = req.params.assignmentId;
  let result;
  try {
    result = await pool.query(
      `delete from assignments where assignment_id = $1`,
      [assignmentIdFromClient]
    );
  } catch {
    return res.status(500).json({
      message: "Server could not delete assignment because database connection",
    });
  }
  if (!assignmentIdFromClient) {
    return res.status(404).json({
      message: "Server could not find a requested assignment to delete",
    });
  }
  return res.status(200).json({
    message: "Deleted assignment sucessfully",
  });
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
