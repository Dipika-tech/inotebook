const express = require("express");
const fetchUser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");
const router = express.Router();

// ROUTE 1: Get all the notes using: GET "/api/notes/fetchallnotes". Login required
router.get("/fetchallnotes", fetchUser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id }).sort({
      date: "desc",
    });
    res.json(notes);
  } catch (error) {
    console.error({ internal_error: error.message });
    return res.status(500).send("Internal Server Error");
  }
});

// ROUTE 2: Add a new note using: POST "/api/notes/addnote". Login required
router.post(
  "/addnote",
  fetchUser,
  [
    body("title", "Enter a valid title.").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 characters.").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      //error handling
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, description, tag } = req.body;

      // create note
      const savedNote = await Notes.create({
        title,
        description,
        tag,
        user: req.user.id,
      });
      res.json(savedNote);
    } catch (error) {
      console.error({ internal_error: error.message });
      return res.status(500).send("Internal Server Error");
    }
  }
);

// ROUTE 3: Update an existing note using: PUT "/api/notes/updatenote". Login required
router.put(
  "/updatenote/:id",
  fetchUser,
  [
    body("title", "Enter a valid title.").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 characters.").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const newNote = {};
      if (title) {
        newNote.title = title;
      }
      if (description) {
        newNote.description = description;
      }
      if (tag) {
        newNote.tag = tag;
      }

      //find the note to be updated
      let note = await Notes.findById(req.params.id);
      if (!note) {
        return res.status(404).send("Not Found!!");
      }
      // Validate allow user
      if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowed");
      }

      note = await Notes.findByIdAndUpdate(
        req.params.id,
        { $set: newNote },
        { new: true }
      );
      return res.json(note);
    } catch (error) {
      console.error(error);
      console.error({ internal_error: error.message });
      return res.status(500).send("Internal Server Error");
    }
  }
);

// ROUTE 4: Delete an existing note using: DELETE "/api/notes/deletenote". Login required
router.delete(
  "/deletenote/:id",
  fetchUser,
  [
    body("title", "Enter a valid title.").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 characters.").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      //find the note to be delete
      let note = await Notes.findById(req.params.id);
      if (!note) {
        return res.status(404).send("Not Found!!");
      }

      // Validate allow user
      if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowed");
      }

      note = await Notes.findByIdAndDelete(req.params.id);
      return res.json({ Success: "Note has been deleted" });
    } catch (error) {
      console.error(error);
      console.error({ internal_error: error.message });
      return res.status(500).send("Internal Server Error");
    }
  }
);

module.exports = router;
