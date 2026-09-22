import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [notes, setNotes] = useState([]);

  const [editingNoteId, setEditingNoteId] = useState(null);
  const [updatedDescription, setUpdatedDescription] = useState("");

  function fetchNotes() {
    axios.get("http://localhost:3000/api/notes").then((res) => {
      setNotes(res.data.notes);
      console.log(res.data.notes);
    });
  }

  useEffect(() => {
    fetchNotes();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();

    const { title, description } = e.target.elements;
    console.log(title.value, description.value);

    axios
      .post("http://localhost:3000/api/notes", {
        title: title.value,
        description: description.value,
      })
      .then((res) => {
        cosole.log(res.data);
        fetchNotes();
      });
  }

  function handleDeleteNote(noteId) {
    console.log(noteId);
    axios.delete("http://localhost:3000/api/notes/" + noteId).then((res) => {
      console.log(res.data);
      fetchNotes();
    });
  }
  function handleUpdateNote(noteId) {
    console.log(noteId, "Note updated");

    const note = notes.find((note) => note._id === noteId);

    setEditingNoteId(noteId);
    setUpdatedDescription(note.description);
  }
  function handleSaveUpdate(noteId) {
    axios
      .patch("http://localhost:3000/api/notes/" + noteId, {
        description: updatedDescription,
      })
      .then((res) => {
        console.log("Note updated:", res.data);

        setEditingNoteId(null);
        setUpdatedDescription("");

        fetchNotes();
      });
  }

  return (
    <>
      <form className="note-create-form" onSubmit={handleSubmit}>
        <input name="title" type="text" placeholder="Title" />
        <input name="description" type="text" placeholder="Description" />
        <button type="submit">Create Note</button>
      </form>

      <div className="notes">
        {notes.map((note) => {
          return (
            <div className="note" key={note._id}>
              <h1>{note.title}</h1>

              {editingNoteId === note._id ? (
                <>
                  <input
                    type="text"
                    value={updatedDescription}
                    onChange={(e) => setUpdatedDescription(e.target.value)}
                  />

                  <button onClick={() => handleSaveUpdate(note._id)}>
                    Save Update
                  </button>
                </>
              ) : (
                <p>{note.description}</p>
              )}
              <button
                className="delete"
                onClick={() => {
                  handleDeleteNote(note._id);
                }}
              >
                Delete
              </button>
              <button
                className="update"
                onClick={() => handleUpdateNote(note._id)}
              >
                Update
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default App;
