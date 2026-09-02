

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import llmRoutes from "./routes/llm.js";
import dbRoutes from "./routes/db.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/llm", llmRoutes);
app.use("/db", dbRoutes);

const PORT = process.env.PORT || 5000;

app.get("/health",(req,res) => {
  res.status(200).json({ message: "Server is running!" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});