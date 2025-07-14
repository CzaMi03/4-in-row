const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Connect Four Game API',
      version: '1.0.0',
      description: 'API documentation for Connect Four game highscores',
    },
    servers: [
      {
        url: 'http://localhost:5001',
        description: 'Development server',
      },
    ],
  },
  apis: ['./server.js'], // Path to the API docs
};

module.exports = swaggerJsdoc(options);
