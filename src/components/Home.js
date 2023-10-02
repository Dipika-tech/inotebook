import React from "react";
import NotesComponent from "./NotesComponent";

export default function Home(props) {
  return (
    <div className="container my-3">
      <NotesComponent showAlert={props.showAlert}/>
    </div>
  );
}
