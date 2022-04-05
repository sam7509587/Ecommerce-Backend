const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path =require("path");
const {
  PORT,
  connectDb,
  errorHandler,
} = require('./config/index');
const {
  userRouter,
  sellerRouter,
  adminRouter,
  productRouter,
} = require('./routes');
const { logger } = require('./shared/');
const app = express();
const port = 8000 || PORT;
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const bodyParser = require('body-parser');
const option = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-commerse Api',
      version: '^1.0.0',
      description: 'a simple Ecommerce Project Apis',
    },
    components: {
      securitySchemes: {
        jwt: {
          type: 'http',
          scheme: 'bearer',
          in: 'header',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        jwt: [],
      },
    ],
    servers: [
      {
        url: 'http://127.0.0.1:8000',
      },
    ],
  },
  apis: [`${__dirname}/routes/*.js`],
};
const specs = swaggerJsDoc(option);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'hbs');


app.use(cors());
app.use(express());
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'views')));
// app.use(express.static(path.join(__dirname,"images")))
app.use('/api/v1/user', userRouter);
app.use('/api/v1/seller', sellerRouter);
app.use('/api/v1/admin', adminRouter);
app.use("/api/v1/product",productRouter)
app.use(errorHandler);

connectDb()
  .then(() => {
    app.listen(port, () => {
      logger.info('database connected');
      logger.info(`server is running :http://127.0.0.1:${port}`);
    });
  })
  .catch((err) => {
    logger.error('database not connected........');
  });
