const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const path = require("path");
const rateLimit = require('express-rate-limit')
const apiLimits = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  legacyHeaders: false,
  message: "Request limit exceeds wait for 1 hour to try again;"
})

const {
  PORT,
  connectDb,
  errorHandler,
} = require('./config/index');
const {
  userRouter,
  sellerRouter,
  adminRouter,
  productRouter, categoryRoutes, brandRoutes, cartRoutes
} = require('./routes');
const { logger } = require('./shared/');
const app = express();
const port = 8000 || PORT;
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const bodyParser = require('body-parser');
const { swaggerOptions } = require("./config");
const { timeOut, otherRoute } = require('./config/routeERROR');
const specs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'hbs');
app.use(apiLimits)

app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'views')));
app.use(timeOut)

// app.use(express.static(path.join(__dirname,"images")))
app.use('/api/v1/user', userRouter);
app.use('/api/v1/seller', sellerRouter);
app.use('/api/v1/admin', adminRouter);
app.use("/api/v1/product", productRouter)
app.use("/category", categoryRoutes)
app.use("/brand", brandRoutes)
app.use("/api/v1/cart",cartRoutes)
app.use("*", otherRoute)
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
