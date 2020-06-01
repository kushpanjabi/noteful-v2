'use strict';

const table = 'folders';

module.exports = {
  getNotes(db){
    return db.select('*').from(table);
  },

  getNote(db, folderId){
    console.log(typeof folderId)
    return db.select('*').from(table).first().where('id', folderId);
  },

  addNote(db, newFolder){
    return db.insert(newFolder).into(table).returning('*').then(responseArray => responseArray[0]);
  },

  updateNote(db, folderId, updatedFolder){
    return db(table).where('id', folderId).update(updatedFolder);
  },

  deleteNote(db, folderId){
    return db(table).where('id', folderId).delete();
  }
};