const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0", // Versão do Swagger
    info: {
      title: "Arquivo Criminal Brasileiro API",
      description: "API para organizar informações públicas sobre casos criminais brasileiros e relacioná-los a produções audiovisuais",
      version: "1.0.0",
      contact: {
        name: "HHR Solutions",
      },
      servers: [{ url: "http://localhost:4000" }],
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT", // token usado pelo middleware de autenticação
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js", "./docs/swaggerDocs.yaml"], // rotas + especificação mantida pela Documentação
};

export default swaggerOptions;
