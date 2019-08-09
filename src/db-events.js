const mysql = require('mysql');
const MySQLEvents = require('@rodrigogs/mysql-events');

const program = async (cb) => {
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
  });

  const instance = new MySQLEvents(connection, {
    startAtEnd: true,
    excludedSchemas: {
      mysql: true,
    },
  });

  await instance.start();
/*
  instance.addTrigger({
    name: 'TEST',
    expression: '*',
    statement: MySQLEvents.STATEMENTS.ALL,
    onEvent: (event) => { // You will receive the events here
      console.log(event);
    },
  });
*/
  instance.addTrigger({
    name: 'TITLE_UPDATE',
    expression: 'text_socket.title.title',
    statement: MySQLEvents.STATEMENTS.UPDATE,
    onEvent: async (event) => {
      // Here you will get the events for the given expression/statement.
      // This could be an async function.
      return await cb(event.affectedRows);
    },
  });
  instance.on(MySQLEvents.EVENTS.CONNECTION_ERROR, console.error);
  instance.on(MySQLEvents.EVENTS.ZONGJI_ERROR, console.error);
};

module.exports.program = program
