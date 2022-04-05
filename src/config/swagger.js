exports.swaggerOptions = {
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
