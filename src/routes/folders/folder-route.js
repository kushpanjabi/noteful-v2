'use strict';

const express = require('express');
const FoldersService = require('./folder-service');
const foldersRouter = express.Router();
const xss = require('xss');

const serializeFolder = folder => ({
  id: folder.id,
  name: xss(folder.folder_name)
});




foldersRouter
  .route('/')
  .get((req, res, next) => {
    const db = req.app.get('db');
    FoldersService.getNotes(db)
      .then(folders => res.status(200).json(folders))
      .catch(console.log);
  })
  .post(express.json(),(req, res, next) => {
    const db = req.app.get('db');
    const { name } = req.body;
    if (!name || name.trim() === '' || name.length > 20){
      return res.status(400).json({message: 'name invalid'});
    }
    FoldersService.addNote(db, {folder_name: name})
      .then(newFolder => res.status(201).json(serializeFolder(newFolder)));
  });
  

foldersRouter
  .route('/:folderId')
  .all( (req, res, next) => {
    const { folderId } = req.params;
    const db = req.app.get('db');
    console.log(folderId)
    FoldersService.getNote(db, Number(folderId))
      .then(folder => {
        if (!folder){
          return res.status(404).json({message: 'resource not found'});
        }
        res.folder = folder;
        next();
      })
      .catch(console.log);
  })
  .get( (req, res, next) => {
    return res.status(200).json(serializeFolder(res.folder));
  })
  .patch(express.json(), (req, res, next) => {
    const db = req.app.get('db');
    const { name } = req.body;
    if (!name || name.trim() === '' || name.length > 20){
      res.status(400).json({message: 'name invalid'});
    }
    FoldersService.updateNote(db, res.folder.id, {folder_name: name})
      .then(newFolder => res.status(204).json(serializeFolder(newFolder)))
      .catch(console.log);
  })
  .delete(express.json(), (req, res, next) => {
    const db = req.app.get('db');
   
    FoldersService.deleteNote(db, res.folder.id)
      .then(newFolder => res.status(203).end())
      .catch(console.log);
  })

  
module.exports = foldersRouter;



