import React, { useContext } from "react";
import noteContext from "../context/notes/noteContext";

function NoteItem(props) {
  const { title, description, _id } = props.note;
  const context = useContext(noteContext);
  const { deleteNote } = context;
  return (
    <div className="col-md-3">
      <div className="card my-3">
        <div className="card-body">
          <div className="d-flex align-items-center">
            <h5 className="card-title">{title}</h5>
            <i
              className="fa-solid fa-pen-to-square mx-2"
              onClick={() => {
                props.updateNote(props.note);
              }}
            ></i>
            <i
              className="fa-solid fa-trash-can mx-2"
              onClick={() => {
                deleteNote(_id, props.showAlert);
              }}
            ></i>
          </div>
          <p className="card-text">{description}</p>
        </div>
      </div>
    </div>
  );
}

export default NoteItem;
