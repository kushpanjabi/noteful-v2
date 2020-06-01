'use strict';

const express = require('express');
const NotesService = require('./note-service');
const notesRouter = express.Router();
const xss = require('xss');

const serializeNote = note => ({
  id: note.id,
  name: xss(note.note_name),
  content: xss(note.content),
  folder_id: note.folder_id,
  date_created: note.date_created
});




notesRouter
  .route('/')
  .get((req, res, next) => {
    const db = req.app.get('db');
    NotesService.getNotes(db)
      .then(notes => res.status(200).json(notes.map(note => serializeNote)))
      .catch(console.log);
  })
  .post(express.json(),(req, res, next) => {
    const db = req.app.get('db');
    const { name, content, folder_id } = req.body;
    if (!name || name.trim() === '' || name.length > 20 || !folder_id){
      return res.status(400).json({message: 'invalid'});
    }
    NotesService.addNote(db, {note_name: name, content, folder_id: Number(folder_id)})
      .then(newNote => res.status(201).json(serializeNote(newNote)))
      .catch(console.log);
  });
  

notesRouter
  .route('/:noteId')
  .all( (req, res, next) => {
    const { noteId } = req.params;
    const db = req.app.get('db');
    console.log(noteId);
    NotesService.getNote(db, Number(noteId))
      .then(note => {
        if (!note){
          return res.status(404).json({message: 'resource not found'});
        }
        res.note = note;
        next();
      })
      .catch(console.log);
  })
  .get( (req, res, next) => {
    return res.status(200).json(serializeNote(res.note));
  })
  .patch(express.json(), (req, res, next) => {
    const db = req.app.get('db');
    const { name, content, folder_id  } = req.body;
    if (!name || name.trim() === '' || name.length > 20 || !folder_id){
      res.status(400).json({message: 'invalid update'});
    }
    NotesService.updateNote(db, Number(res.note.id), {folder_id: Number(folder_id), content, note_name: name})
      .then(newNote => res.status(204).end())
      .catch(console.log);
  })
  .delete(express.json(), (req, res, next) => {
    const db = req.app.get('db');
   
    NotesService.deleteNote(db, res.note.id)
      .then(_=> res.status(203).end())
      .catch(console.log);
  });

module.exports = notesRouter;



