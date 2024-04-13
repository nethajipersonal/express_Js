const express = require('express');
const dbConnect = require('./config/dbConnect');
const app = express();
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 4000;
const authRouter = require('./routes/authRoute');
const productRouter = require('./routes/productRoute');
const bodyParser = require('body-parser');
const { nonFound, errorHandler } = require('./middlewares/errorHandler');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
// const fs = require('fs');
// const path = require('path');
dbConnect();
// Allow all origins (not recommended for production)
app.use(cors());
// Swagger definition
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'API Documentation'
        },
        servers: [{ url: `http://localhost:${PORT}`, description: 'Development Server' }]
    },
    apis: ['./routes/*.js',] // Path to the API routes files
};
const swaggerDocs = swaggerJSDoc(swaggerOptions);

// Initialize Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(cookieParser());
app.use("/api/user",authRouter);
app.use('/api/product',productRouter);
app.use(nonFound);
app.use(errorHandler)
app.listen(PORT,()=>{
    console.log(`server running at in PORT ${PORT}`)
});
