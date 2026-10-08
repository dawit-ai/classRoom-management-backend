import express from "express";

const app = express();
const PORT = 7000;

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Classroom server is running.");
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
