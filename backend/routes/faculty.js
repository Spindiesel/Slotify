const express = require("express");
const router = express.Router();

let faculty = [];

router.get("/", (req, res) => {
  res.json(faculty);
});

router.post("/", (req, res) => {
  const newFaculty = {
    id: Date.now(),
    name: req.body.name,
    department: req.body.department,
    subjects: req.body.subjects,
  };

  faculty.push(newFaculty);

  res.status(201).json(newFaculty);
});

router.delete("/:id", (req, res) => {
  faculty = faculty.filter(
    (f) => f.id !== Number(req.params.id)
  );

  res.json({ success: true });
});

module.exports = router;