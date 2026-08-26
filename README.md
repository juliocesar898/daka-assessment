# 🔐 Solución Técnica Full-Stack: DakaTest
## NestJS 11 · Next.js 15 · Socket.io · Docker Compose

<div align="center">
  <img src="https://img.shields.io/badge/Backend-NestJS_11-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="Backend" />
  <img src="https://img.shields.io/badge/Frontend-Next.js_15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Frontend" />
  <img src="https://img.shields.io/badge/Database-PostgreSQL_17-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="Database" />
  <img src="https://img.shields.io/badge/Infra-Docker_Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <br />
  <br />
  <img src="https://img.shields.io/badge/Estado-Completado_100%25-emerald?style=flat-square" alt="Status" />
  <img src="https://img.shields.io/badge/Security-OWASP_A02_--_A04_Compliant-4B0082?style=flat-square" alt="Security" />
  <img src="https://img.shields.io/badge/UI-Neobrutalist_Custom_Tech-3B82F6?style=flat-square" alt="Design System" />
  <img src="https://img.shields.io/badge/Uso-Evaluación_Interna-lightgrey?style=flat-square" alt="License" />
</div>

---

## 📌 Resumen de la Solución

Se ha finalizado e implementado satisfactoriamente la aplicación **DakaTest**, una plataforma Full-Stack de alto rendimiento para la gestión autenticada de usuarios y el streaming de sprites Pokémon en tiempo real mediante WebSockets.

### 🌟 Puntos Clave de la Implementación
1. **Seguridad Robusta (OWASP Compliance):**
   * **Mitigación de User Enumeration (OWASP A04):** Mensajes genéricos de error en autenticación y registro para prevenir el raspado de nombres de usuario.
   * **Protección de Credenciales (OWASP A02):** Autenticación JWT con expiración, almacenamiento seguro en Zustand con interceptor de respuestas en Axios y hasheo de contraseñas mediante `bcrypt` (10 salt rounds).
   * **Sanitización Estricta de Entradas:** DTOs en NestJS validados con `@Matches(/^[a-zA-Z0-9_]+$/)` y esquemas simétricos en el cliente utilizando **Zod** y **React Hook Form**.

2. **Arquitectura & Estado en Tiempo Real:**
   * **Axios Interceptor (`lib/axios.ts`):** Inyección automática de tokens Bearer y purga global de sesión en caso de recibir respuestas `401 Unauthorized`.
   * **WebSocket Gateway Resiliente (`PokemonGateway`):** Validación de tokens durante el Handshake inicial de Socket.io, emitiendo estados dinámicos en la UI (`WS ONLINE`, `WS CONECTANDO...`, `WS OFFLINE`) y deshabilitando controles automáticamente ante pérdida de señal.

3. **Interfaz de Usuario Neobrutalista Táctil:**
   * Diseño personalizado lejos de plantillas genéricas: fondo con malla técnica, bordes definidos, sombras en bloque (`shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]`) y tarjetas interactivas animadas con **Framer Motion**.
   * Gestión completa de *Empty States* con animaciones de entrada y salida mediante `<AnimatePresence mode="wait">`.

---

## 🛠️ Stack Tecnológico Final

| Capa | Tecnología | Versión |
|---|---|---|
| **Backend** | NestJS + MikroORM | ^11.x |
| **Frontend** | Next.js (App Router) | ^15.x |
| **Estilos** | Tailwind CSS + Custom Neobrutalism | ^4.x |
| **Animaciones** | Framer Motion | ^11.x |
| **Estado Global** | Zustand (Persist) | ^5.x |
| **Formularios** | React Hook Form + Zod | ^7.x / ^3.x |
| **Base de Datos** | PostgreSQL | 17-alpine |
| **Tiempo Real** | Socket.io Client & Server | ^4.x |
| **Infraestructura** | Docker & Docker Compose | ^24.x |

### 🛡️ Decisión de Arquitectura de Seguridad (OWASP A02: JWT Storage)
Se optó por gestionar el token JWT mediante **Zustand (Persist Store)** con inyección automática a través de interceptores de Axios y Handshake Auth en Socket.io.
* **Justificación:** Otorga compatibilidad directa y libre de bloqueos CORS/SameSite para la conexión WebSocket en tiempo real.
* **Mitigación XSS/OWASP:** Se previene la inyección de scripts mediante la sanitización estricta de entradas en Zod/DTOs (`@Matches`), el uso de componentes controlados en React 19 sin manipulación directa del DOM (`dangerouslySetInnerHTML`) y la purga automática del estado (`logout()`) ante respuestas `401 Unauthorized`.

## 🚀 Despliegue e Instalación

### 1. Configurar el entorno
Copia las variables de entorno de ejemplo a un archivo activo local (asegúrate de hacerlo en las carpetas correspondientes si requieren `.env` individuales o en la raíz si tu docker-compose los carga compartidos).
```bash
cp .env.example .env
```

### 2. Ejecutar con Docker Compose (Modo Desarrollo)
Levanta la base de datos, el backend y el frontend orquestados por Docker.
```bash
docker-compose -f docker-compose.dev.yml up --build
```

### 3. Verificar la Suite de Pruebas
Puedes correr los tests e2e o unitarios dentro del contenedor del backend activo.
```bash
docker-compose -f docker-compose.dev.yml exec backend npm test
```

---

## 🌐 Endpoints y URLs de Acceso

| Servicio | URL | Descripción |
|---|---|---|
| **🎨 Next.js Frontend** | `http://localhost:3001` | Dashboard y Login / Registro |
| **⚙️ NestJS REST API** | `http://localhost:3000` | API Backend base |
| **📖 Swagger API Docs** | `http://localhost:3000/api/docs` | Documentación Interactiva OpenAPI |
| **🗄️ PostgreSQL DB** | `localhost:5432` | Conexión a Base de Datos relacional |
