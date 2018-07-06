const {Guid, isNumber} = require("../utils");

class Tables {
  /**
   * Generate and add new tableId
   * @return string
   */
  static create() {
    const tableId = Guid();
    Tables.tables[tableId] = {};
    return tableId;
  }

  /**
   * Join to table by tableId and user model
   * @param tableId
   * @param user
   */
  static join(tableId, user) {
    if (!Tables.tables[tableId]) {
      console.log(`Cannot join to not existing table ${tableId}, 
                   user ${JSON.stringify(user)}`);
      return;
    }

    Tables.tables[tableId][user.uid] = user;
  }

  /**
   * Make estimation based on selected users cards
   * @param tableId
   */
  static estimate(tableId) {
    let table = Tables.getById(tableId);

    let sum = 0;
    Object.keys(table).forEach(userId => {
      if (isNumber(table[userId].selectedCard)) {
        sum += +table[userId].selectedCard;
      }
    });

    return Math.round(sum / Object.keys(table).length);
  }

  /**
   *
   */
  static reEstimate(tableId) {
    let table = Tables.getById(tableId);
    Object.keys(table).forEach(userId => {
      table[userId].selectedCard = null;
    });
  }

  /**
   * Syntax sugar
   * @param id
   * @returns {*|null}
   */
  static getById(id) {
    return Tables.tables[id] || null;
  }

  /**
   * Add user to table
   * @param user
   */
  static setUser(user) {
    if (!user.tableId || !user.uid) {
      console.log(`User wasn't add to table, model ${user}`);
      return;
    }

    Tables.tables[user.tableId][user.uid] = user;
  }
}

Tables.tables = {};


module.exports = Tables;