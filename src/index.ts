import express from "express";
import subjectRoutes from "./routes/subject.js";
import cors from "cors";
const app = express();
const PORT = 7000;
app.use(cors({
  origin: process.env.FROTEND_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());
app.use("/api/subjects", subjectRoutes);

app.get("/", (_req, res) => {
  res.send("Classroom server is running.");
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
