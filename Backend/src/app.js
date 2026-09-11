//->

const express = require("express");

const noteModel = require("./models/note.model");

const cors = require("cors");

const app = express();

app.use(cors());

//use middleware
app.use(express.json());

//POST API
app.post("/api/notes", async (req, res) => {
  const { title, description } = req.body;

  const note = await noteModel.create({ title, description });

  res.status(201).json({
    message: "Note created successfully",
    note,
  });
});

//get API
app.get("/api/notes", async (req, res) => {
  const notes = await noteModel.find();

  res.status(200).json({
    message: "Notes fetched successfully",
    notes,
  });
});

//Delete API using id
app.delete("/api/notes/:id", async (req, res) => {
  const id = req.params.id;

  await noteModel.findByIdAndDelete(id);

  console.log(id);

  res.status(200).json({
    message: "Note deleted successfully",
  });
});

//-PATCH API using id -> update the description of note
app.patch("/api/notes/:id", async (req, res) => {
  const id = req.params.id;
  const { description } = req.body;

  await noteModel.findByIdAndUpdate(id, { description });

  res.status(200).json({
    message: "Note updated successfully",
    note,
  });
});

module.exports = app;
