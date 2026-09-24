const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Claim Engine API',
            version: '1.0.0',
            description: 'API documentation for the Claim Engine service',
        },
        servers: [
            {
                url: 'http://localhost:3001', // change to your app's actual port
                description: 'Local server',
            },
        ],
    },
    // Path(s) to files containing OpenAPI annotations
    apis: [path.join(__dirname, './routes/*.js')],

};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;