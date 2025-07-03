import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import proxy from 'express-http-proxy';
import { verifyToken } from './middleware/auth.middleware.js';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

dotenv.config();

if (!process.env.AUTH_SERVICE_URL || !process.env.TASK_SERVICE_URL) {
  console.error('❌ ERROR: Las variables AUTH_SERVICE_URL o TASK_SERVICE_URL no están definidas.');
  console.error('🔍 Asegúrate de tener un archivo .env en la raíz con esas variables.');
  process.exit(1);
}

console.log('✅ AUTH_SERVICE_URL:', process.env.AUTH_SERVICE_URL);
console.log('✅ TASK_SERVICE_URL:', process.env.TASK_SERVICE_URL);


const app = express();
// ✅ Configurar CORS completo
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ✅ Permitir respuestas explícitas a OPTIONS
app.options('*', cors());
app.use(express.json());
app.use(morgan('dev'));

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Gateway - Microservicios',
      version: '1.0.0',
      description: 'Documentación centralizada de Auth y Task Service'
    },
    servers: [
      {
        url: 'http://localhost:3999'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ['./docs/**/*.yaml']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    swaggerOptions:{
            persistAuthorization: true

    }
}));

app.use('/auth', proxy(process.env.AUTH_SERVICE_URL, {
  proxyReqPathResolver: req => {
    const path = `/api/auth${req.url}`;
    console.log(`[Proxy → Auth] -> ${path}`);
    return path;
  },
  proxyReqOptDecorator: (options) => {
    options.headers['Content-Type'] = 'application/json';
    return options;
  },
  userResHeaderDecorator: (headers) => {
    headers['Access-Control-Allow-Origin'] = 'http://localhost:5173';
    headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
    headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
    return headers;
  }
}));

app.use('/tasks', verifyToken, proxy(process.env.TASK_SERVICE_URL, {
  proxyReqPathResolver: req => {
    const path = `/api/tasks${req.url}`;
    console.log(`[Proxy → Tasks] -> ${path}`);
    return path;
  },
  proxyReqOptDecorator: (options, req) => {
    options.headers['Content-Type'] = 'application/json';
    if (req.user?.id) {
      options.headers['x-user-id'] = req.user.id;
    }
    return options;
  },
  userResHeaderDecorator: (headers) => {
    headers['Access-Control-Allow-Origin'] = 'http://localhost:5173';
    headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
    headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
    return headers;
  }
}));



const PORT = process.env.PORT || 3999;
app.listen(PORT, () => {
  console.log(`[Gateway] corriendo en http://localhost:${PORT}`);
});