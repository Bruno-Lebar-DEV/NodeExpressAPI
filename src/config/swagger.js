import swaggerUI from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const swaggerDocument = require('../docs/swagger.json');

const specs = swaggerJsdoc({
  definition: swaggerDocument,
  apis: [],
});

export { swaggerUI, specs };
