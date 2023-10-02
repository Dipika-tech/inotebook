import React, { useContext, useState } from "react";
import noteContext from "../context/notes/noteContext";


function AddNote(props) {
    const context = useContext(noteContext);
    const {addNote} = context;
    const [note, setNote] = useState({title: "", description: "", tag: ""});

    const handleClick = (event) =>{
        event.preventDefault();
        addNote(note.title, note.description, note.tag);
        setNote({title: "", description: "", tag: ""})
        props.showAlert('Note Added Successfully', 'success')
      }

    const onChange = (event) =>{
        setNote({...note, [event.target.name]: event.target.value})
    }
  return (
    <div>
      <h2>Add a Note</h2>
      <form>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            aria-describedby="emailHelp"
            name="title"
            value={note.title}
            onChange={onChange}
            minLength={3}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <input
            type="text"
            className="form-control"
            id="description"
            name="description"
            value={note.description}
            onChange={onChange}
            minLength={5}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="tag" className="form-label">
            Tag
          </label>
          <input
            type="text"
            className="form-control"
            value={note.tag}
            id="tag"
            name="tag"
            onChange={onChange}
          />
        </div>

        <button disabled={note.title.length<3 || note.description.length < 5} type="submit" className="btn btn-primary" onClick={handleClick}>
          Add Note
        </button>
      </form>
    </div>
  );
}

export default AddNote;
