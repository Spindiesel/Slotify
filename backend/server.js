const express = require("express");
const cors = require("cors");

const app = express();
const facultyRoutes = require("./routes/faculty");

app.use(cors());
app.use(express.json());
app.use("/api/faculty", facultyRoutes);

app.get("/", (req, res) => {
  res.send("Slotify Backend Running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});