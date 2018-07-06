const Tables = require('./tables');

class User {
  constructor(socket, io) {
    this.socket = socket;
    this.io = io;
    this.model = JSON.parse(socket.handshake.query.user);

    console.log(`User connected with model: ${JSON.stringify(this.model)}`);
    // console.log(`Tables: ${JSON.stringify(tables)}`);

    if (this.model.tableId) {
      this._selfUpdateState();

      if (Tables.getById(this.model.tableId)) {
        Tables.setUser(this.model);
        socket.join(this.model.tableId);
      }
    }
  }

  updateModel(updatedModel) {
    this.model = Object.assign(this.model, updatedModel);
    Tables.setUser(this.model);
    this._massUpdateState();
  }

  /**
   * Set table to user, join room and send update
   * @param tableId
   */
  setTable(tableId) {
    this.updateModel({tableId});
    this.joinRoom();
  }

  /**
   * Update table value for the user
   * @private
   */
  _selfUpdateState() {
    this.socket.emit('stateUpdate', {
      tables: Tables.getById(this.model.tableId)
    });
  }

  /**
   * Update table value for all table users
   * @private
   */
  _massUpdateState() {
    this.io.in(this.model.tableId).emit('stateUpdate', {
      tables: Tables.getById(this.model.tableId)
    });
  }

  /**
   * Syntax sugar
   * @param tableId
   * @private
   */
  joinRoom(tableId = this.model.tableId) {
    this.socket.join(tableId);
  }
}

module.exports = User;