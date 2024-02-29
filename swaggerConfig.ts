import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CORENOTES API Documentation",
      version: "1.0.0",
      description: "API documentation for CORENOTES",
    },
    components: {
      securitySchemes: {
        // Load SID cookie name from config
        sid_cookie: {
          type: "apiKey",
          name: "sid", // Default fallback
          in: "cookie",
          description: "Session ID cookie for authentication",
        },
      },
    },
    security: [
      {
        sid_cookie: [], // Empty array to enable the scheme without requiring the cookie
      },
    ],
  },
  apis: ["./src/api/features/individual/routes/*.ts"], // Path to the controllers containing your routes
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
