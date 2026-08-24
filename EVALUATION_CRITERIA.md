# Criterios de Evaluación — NestJS + Next.js
## Stack: NestJS + Next.js + WebSocket + Docker | Nivel: Mid-Senior

---

> [!IMPORTANT]
> Este documento es **de uso exclusivo del evaluador**. No compartir con el candidato antes de la revisión.

---

## Rúbrica de Puntuación (100 puntos)

| Criterio | Puntos | Descripción |
|----------|--------|-------------|
| **Funcionalidad** | 30 | Auth completo, CRUD Pokémon, WebSocket en tiempo real |
| **Calidad de Código** | 25 | SOLID, TypeScript strict, React Hook Form + Zod, estado global coherente |
| **Seguridad (OWASP)** | 20 | JWT, Guards, DTOs, CORS, almacenamiento seguro del token |
| **Manejo de Errores** | 15 | Exception filters, mensajes genéricos, logs internos |
| **Infraestructura** | 10 | Docker multi-stage, docker-compose funcional |
| **Total** | **100** | |

---

## Escala de Evaluación

| Rango | Nivel | Interpretación |
|-------|-------|----------------|
| 90–100 | Excelente | Mid-Senior sólido en stack NestJS/Next.js. Contratar. |
| 75–89 | Muy Bueno | Perfil competente. Recomendar con mentoring puntual. |
| 60–74 | Bueno | Mid con buen potencial. Evaluar complementando con entrevista. |
| 45–59 | Aceptable | Gaps en React/Next.js o arquitectura NestJS. |
| < 45 | Insuficiente | No cumple mínimos. |

---

## 🚩 Red Flags

- [ ] El proyecto no levanta con `docker-compose up`
- [ ] Credenciales hardcodeadas
- [ ] `CORS: { origin: '*' }`
- [ ] Sin Guards en el backend
- [ ] Sin protección de rutas en Next.js (cualquier usuario accede al dashboard)
- [ ] Contraseñas en texto plano
- [ ] Sin validación de formularios (React Hook Form ausente)

---

## 💡 Bonus Points (+5 a +10 pts)

- [ ] Tests unitarios con Jest — +5
- [ ] Refresh token implementado — +5
- [ ] Zustand bien estructurado (slices separados) — +3
- [ ] Swagger documentado — +3

---

## Evaluación Detallada por Criterio

### Funcionalidad (30 pts)

| Sub-criterio | Pts | Check |
|---|---|---|
| Registro e inicio de sesión funcionales | 8 | ☐ |
| JWT persistido correctamente en el frontend | 6 | ☐ |
| CRUD de Pokémon (crear, listar, detalle) | 8 | ☐ |
| WebSocket: Pokémon aleatorio en tiempo real | 8 | ☐ |

### Calidad de Código (25 pts)

| Sub-criterio | Pts | Check |
|---|---|---|
| TypeScript `strict: true` | 6 | ☐ |
| React Hook Form + Zod en todos los formularios | 7 | ☐ |
| Estado global coherente (Zustand o Context API, no mezcla aleatoria) | 6 | ☐ |
| Sin código muerto ni `console.log` residual | 6 | ☐ |

### Seguridad — OWASP Top 10 (20 pts)

| Control OWASP | Pts | Check |
|---|---|---|
| A02 — bcrypt para contraseñas | 4 | ☐ |
| A02 — JWT con expiración | 3 | ☐ |
| A01 — Guards en rutas protegidas | 4 | ☐ |
| A03 — DTOs con `class-validator` | 4 | ☐ |
| A05 — CORS restringido | 3 | ☐ |
| A07 — WebSocket con auth JWT | 2 | ☐ |

---

## Preguntas de Entrevista de Seguimiento

### Nivel Básico
1. ¿Cuándo usarías `useEffect` vs `useMemo` en Next.js para consumir un WebSocket?
2. ¿Qué ventaja ofrece Zod sobre la validación manual de forms?

### Nivel Intermedio
3. ¿Cómo protegerías una ruta de Next.js en el servidor (SSR) para que un usuario no autenticado no reciba el HTML?
4. ¿Cómo implementarías token refresh sin que el usuario note la interrupción?

### Nivel Avanzado
5. Si el WebSocket necesita escalar a múltiples instancias del backend, ¿cómo usarías Redis como adapter?

---

## Checklist Final del Evaluador

- [ ] `docker-compose up` funciona
- [ ] Swagger en `/api`
- [ ] WebSocket visible en el dashboard
- [ ] `SOLUTION_TEMPLATE.md` completado
- [ ] Sin `.env` reales ni `node_modules/` en el repo
