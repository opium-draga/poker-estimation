const http = require('http');
const express = require('express');
const port = process.env.PORT || 3333;
const socketIO = require('socket.io');
const app = new express();
const server = http.createServer(app);
const io = socketIO(server);

const Tables = require('./entities/tables');
const User = require('./entities/user');


io.on('connection', socket => {
  const user = new User(socket, io);

  socket.on('createTable', () => {
    const tableId = Tables.create();
    user.setTable(tableId);
    socket.emit('tableInited', {tableId});
  });

  socket.on('joinTable', req => {
    user.model = Object.assign(user.model, req.user);
    user.setTable(req.tableId);

    socket.emit('tableInited', {tableId: req.tableId});
  });

  socket.on('updateUser', userModel =>
    user.updateModel(userModel)
  );

  socket.on('estimate', () => {
    const tableId = user.model.tableId;
    const result = Tables.estimate(tableId);
    io.in(tableId).emit('estimationReady', result);
  });

  socket.on('reEstimate', () => {
    const tableId = user.model.tableId;
    Tables.reEstimate(tableId);
    io.in(tableId).emit('stateUpdate', {
      tables: Tables.getById(tableId),
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