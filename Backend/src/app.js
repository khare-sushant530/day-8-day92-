//->

const express = require("express");
const noteModel = require("./models/note.model");
const cors = require("cors");
const path = require("path");

const handleUpdateNote = async (noteId) => {
  const description = prompt("Enter updated description:");

  if (!description) return;

  try {
    const res = await axios.patch(
      "https://day-9-6e8w.onrender.com/api/notes/" + noteId,
      {
        description: description,
      },
    );

    console.log(res.data);

    // Refresh notes after update
    getNotes();
  } catch (error) {
    console.log("Error updating note:", error);
  }
};

const app = express();
app.use(cors());
//use middleware
app.use(express.json());

//this is used to serve static files from the public folder .when browser request for http://localhost:3000/index.html then it will serve the index.html file from public folder
app.use(express.static("./public"));

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

  const note = await noteModel.findByIdAndUpdate(
    id,
    { description },
    { new: true },
  );

  res.status(200).json({
    message: "Note updated successfully",
    note,
  });
});

//it handle the request which is not handled by any of the above routes/apis
app.use("*name", (req, res) => {
  // res.sendFile("../public/index.html",{root:__dirname})
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

module.exports = app;
