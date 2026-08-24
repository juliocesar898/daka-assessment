# 📋 Template de Solución — NestJS + Next.js

> **Instrucciones:** Completa este documento como parte de tu entrega. Es obligatorio. El evaluador usará este archivo para entender tus decisiones técnicas antes de revisar el código.

---

## 👤 Información del Candidato

| Campo | Valor |
|-------|-------|
| **Nombre completo** | |
| **Años de experiencia en NestJS** | |
| **Años de experiencia en Next.js / React** | |
| **Fecha de entrega** | |
| **Tiempo total invertido** | |

---

## 🏗️ Decisiones de Diseño

### Backend (NestJS)

**¿Cómo estructuraste la autenticación JWT? ¿Strategy, Guards, o ambas?**

```
[Tu respuesta aquí]
```

**¿Cómo implementaste la autenticación del WebSocket (Pokémon Gateway)?**

```
[Tu respuesta aquí]
```

### Frontend (Next.js)

**¿Usaste React Hook Form + Zod? ¿Dónde añadiste validaciones adicionales?**

```
[Tu respuesta aquí]
```

**¿Cómo manejaste el estado global? ¿Zustand, Context API, o ambos?**

```
[Tu respuesta aquí]
```

**Estrategia de almacenamiento del token:**

| Método | Elegiste | Razón |
|--------|:---:|-------|
| `localStorage` | ☐ | |
| HTTP-Only Cookie | ☐ | |
| Next.js Server Session | ☐ | |

---

## ⚠️ Dificultades Encontradas

1. **Dificultad:**
   **Solución:**

---

## 🔒 Seguridad Implementada (OWASP)

| Control | Implementado | Notas |
|---------|:---:|-------|
| Contraseñas hasheadas con `bcrypt` | ☐ | |
| JWT con expiración | ☐ | |
| Guards en todas las rutas protegidas | ☐ | |
| DTOs con `class-validator` | ☐ | |
| CORS restringido | ☐ | |
| Variables sensibles en `.env` | ☐ | |

---

## 📈 Qué Mejorarías con Más Tiempo

1.
2.
3.

---

## 🚀 Instrucciones de Ejecución

```bash
cp .env.example .env
docker compose up -d
# Backend:  http://localhost:3000/api
# Frontend: http://localhost:3001
```

---

## 💬 Supuestos y Limitaciones

-
-

---

## 🤖 Uso de Herramientas de Inteligencia Artificial

Daka permite el uso asistido de IA en este assessment. **Solo están permitidas las siguientes herramientas:**

| Herramienta | Modalidad | Disponibilidad |
|---|---|---|
| **Claude Code** | CLI / IDE integrado | Si tienes acceso |
| **Gemini** | Navegador (cuenta Google personal) | Fallback universal |
| **Google Antigravity** | Plataforma interna Daka | Si tienes acceso |
| **Claude Sonnet** | Navegador / API | Alternativa a Claude Code |

> ❌ **No permitido:** GitHub Copilot, ChatGPT, Cursor AI auto-complete sin supervisión, o cualquier herramienta que genere y confirme código sin revisión explícita del candidato.

**Si usaste IA, completa esta sección (obligatorio si aplica):**

| Campo | Respuesta |
|---|---|
| ¿Usaste alguna herramienta de IA? | Sí / No |
| ¿Cuál(es)? | |
| ¿Para qué la usaste? *(ej: generar boilerplate, debug, explicar un concepto)* | |
| ¿Cómo verificaste que el código generado era correcto y seguro? | |

> El uso de IA **no penaliza** ni bonifica directamente. Lo que evaluamos es tu capacidad de supervisar, verificar y adaptar el output generado. Un candidato que usa IA sin criterio es penalizado igual que uno que no la usa y entrega código deficiente.
