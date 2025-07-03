# 🧩 Domina Test - Fullstack App

Aplicación completa basada en arquitectura de microservicios usando:

- **Frontend**: React + Vite + TailwindCSS
- **Gateway**: Node.js + Express (con proxy y validación JWT)
- **Microservicios**:
  - `auth-service`: Login y generación de tokens
  - `task-service`: Gestión de tareas por usuario autenticado
- **Base de datos**: MongoDB

---

## 🚀 Requisitos

- Node.js ≥ 18
- MongoDB en local (`mongodb://localhost:27017`)
- Puertos abiertos:
  - `4000` → Auth Service
  - `4001` → Task Service
  - `3999` → Gateway
  - `5173` → Frontend (Vite)

---

## 📁 Estructura del proyecto

```
domina/
├── auth-service/          # Servicio de autenticación
├── task-service/          # Servicio de tareas
├── domina-gateway/        # API Gateway con Express
└── frontend/              # React + Vite + Tailwind
```

---

## 📦 Instalación y ejecución

### 🔐 Auth Service

```bash
cd auth-service
npm install
npm run dev
```

Archivo `.env` requerido:

```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/auth
JWT_SECRET=supersecreto123
```

---

### 📋 Task Service

```bash
cd task-service
npm install
npm run dev
```

Archivo `.env` requerido:

```
PORT=4001
MONGODB_URI=mongodb://localhost:27017/tasks
```

---

### 🌐 Gateway

```bash
cd domina-gateway
npm install
npm run dev
```

Archivo `.env` requerido:

```
PORT=3999
AUTH_SERVICE_URL=http://localhost:4000
TASK_SERVICE_URL=http://localhost:4001
JWT_SECRET=supersecreto123
```

El Gateway expone:

- `POST /auth/login`
- `POST /auth/register`
- `GET /tasks`
- `POST /tasks`

---

### 🎨 Frontend (React + Vite + Tailwind)

```bash
cd frontend
npm install
npm run dev
```

Este cliente React se conecta a `http://localhost:3999`.

---

## 🧪 Flujo de uso

1. **Login** desde frontend → `POST /auth/login`
2. Recibe un **JWT**
3. Frontend guarda token en `localStorage`
4. En cada solicitud a `/tasks`, se adjunta `Authorization: Bearer <token>`
5. El **Gateway** verifica el token, reenvía al microservicio correspondiente, y añade `x-user-id`
6. El microservicio gestiona los datos para ese usuario

---

## 🔐 Seguridad

- Cada ruta de `/tasks` está protegida por `verifyToken` en el Gateway
- El microservicio de tareas **no está expuesto directamente**
- El token se verifica solo en el Gateway

---

## 🧑‍💻 Ejemplo de usuario

Puedes autenticarte con:

```
usuario: string
contraseña: string
```

O registrar uno desde `/auth/register`.

---

## 🎁 Créditos

Desarrollado por **David Gomez** como parte de una prueba técnica basada en arquitectura de microservicios con JWT, Express y React moderno.

