const http = require('http');
const express = require('express');
const port = process.env.PORT || 3333;
const socketIO = require('socket.io');
const app = new express();
const server = http.createServer(app);
const io = socketIO(server);
const utils = require('./utils');


let tables = {};

io.on('connection', socket => {
  const user = JSON.parse(socket.handshake.query.user);
  console.log(`User connected with model: ${socket.handshake.query.user}`);
  console.log(`Tables: ${JSON.stringify(tables)}`);

  if (user.tableId) {
    socket.emit('stateUpdate', {
      tables: tables[user.tableId] || null
    });

    if (tables[user.tableId]) {
      tables[user.tableId][user.uid] = user;
      socket.join(user.tableId);
    }
  }

  socket.on('createTable', user => {
    const tableId = utils.Guid();
    user.tableId = tableId;
    tables[tableId] = {
      [user.uid]: user
    };
    socket.join(tableId);

    io.in(tableId).emit('stateUpdate', {
      tableId: tableId,
      tables: tables[tableId]
    });
  });

  socket.on('joinTable', data => {
    if (data.tableId && tables[data.tableId]) {
      data.user.tableId = data.tableId;
      tables[data.tableId][data.user.uid] = data.user;
      socket.join(data.tableId);
    }

    io.in(data.tableId).emit('stateUpdate', {
      tableId: data.tableId,
      tables: tables[data.tableId]
    });
  });

  socket.on('updateUser', user => {
    let tableId = user.tableId;
    let table = tables[tableId];

    if (table) {
      table[user.uid] = user;
    }

    io.in(tableId).emit('stateUpdate', {
      tables: tables[tableId] || null
    });
  });

  socket.on('estimate', () => {
    let tableId = user.tableId;
    let table = tables[tableId];

    let sum = 0;
    Object.keys(table).forEach(key => {
      if (utils.isNumber(table[key].selectedCard)) {
        sum += +table[key].selectedCard;
      }
    });

    let result = sum / Object.keys(table).length;
    io.in(tableId).emit('estimationReady', result);
  });

  socket.on('reEstimate', () => {
    let tableId = user.tableId;
    let table = tables[tableId];
    Object.keys(table).forEach(key => {
      table[key].selectedCard = null;
    });

    io.in(tableId).emit('stateUpdate', {
      tables: tables[tableId] || null,
      reEstimation: true
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnect');
  });
});

server.listen(port, () => {
  console.log(`Server is running on ${port} port :)`);
});