# 📊 Rúbrica de Evaluación — Daka Technical Assessment

> **Uso exclusivo del evaluador.** Este documento no debe compartirse con el candidato antes ni durante la prueba.

**Puntaje total:** 105 puntos · **Nota mínima de aprobación:** 65 puntos

---

## Criterios de Evaluación

### 1. Funcionalidad Core — 30 pts

| Criterio | Pts | Evidencia a revisar |
|---|---|---|
| Seed tests pasan sin modificar el archivo `.spec.ts` | 15 | `npm run test` → 5/5 tests en verde |
| Endpoints de auth funcionan (`/register`, `/login`, `/profile`) | 10 | Postman / curl response 200/201 |
| Flujo Pokemon (o recurso equivalente) funciona con auth guard | 5 | Request con JWT válido → 200; sin JWT → 401 |

> 🔴 **Descalificación automática:** Si los seed tests fueron modificados.

---

### 2. Calidad del Código — 25 pts

| Criterio | Pts | Evidencia a revisar |
|---|---|---|
| Tipado TypeScript correcto (sin `any` injustificado) | 8 | Revisión de DTOs, entidades, retornos de servicio |
| Principios SOLID aplicados (al menos SRP e ISP visibles) | 7 | Separación service/controller/entity |
| Manejo de errores apropiado (no `console.log`, excepciones tipadas) | 5 | `ConflictException`, `UnauthorizedException` con mensajes claros |
| Código limpio: naming, funciones pequeñas, sin código muerto | 5 | Revisión general del diff |

---

### 3. Seguridad — OWASP — 25 pts

| Criterio | OWASP | Pts | Evidencia |
|---|---|---|---|
| Contraseña hasheada con bcrypt (cost ≥ 10) | A02 | 10 | `user.entity` / `auth.service` — ver hash en DB |
| JWT con secret desde variables de entorno (`getOrThrow`) | A02/A07 | 5 | `auth.module.ts` — no hay fallback hardcodeado |
| Validación de inputs con `class-validator` en DTOs | A03 | 5 | `register.dto.ts` — `@IsString`, `@MinLength`, `@Matches` |
| Sin credenciales en el código fuente ni en el repo | A02 | 5 | `git log --all` — sin `.env` comprometido |

---

### 4. Docker — 10 pts

| Criterio | Pts | Evidencia |
|---|---|---|
| Stage de producción completado en `Dockerfile` | 5 | Imagen distroless o equivalente, sin devDependencies |
| `docker-compose up` levanta la app sin intervención manual | 3 | DB healthy + backend running + frontend accessible |
| Variables de entorno correctamente inyectadas (no hardcodeadas en Compose) | 2 | `environment:` usa `${VAR}` del `.env` |

---

### 5. Arquitectura y Comprensión — 10 pts

| Criterio | Pts | Evidencia |
|---|---|---|
| Entidad `User` extendida apropiadamente (campos extra: `email`, `createdAt`, etc.) | 4 | `user.entity.ts` |
| Migración MikroORM creada y documentada | 3 | `src/migrations/` — al menos un archivo de migración |
| README actualizado con instrucciones reales de su solución | 3 | Pasos adicionales si los hubiera |

---


### 6. Uso Supervisado de IA — 5 pts

| Criterio | Pts | Evidencia a revisar |
|---|---|---|
| Uso de IA declarado en `SOLUTION_TEMPLATE.md` con herramienta y propósito | 2 | Sección "Uso de Herramientas de IA" completada |
| Código generado revisado, adaptado y tipado correctamente (no copiar-pegar ciego) | 3 | Revisión del diff — sin bloques genéricos sin adaptar al dominio |

> ⚠️ **Penalización:** Si hay evidencia de uso de IA no declarado (código genérico, comentarios en inglés con patrones de LLM, sin coherencia con el stack) y el candidato marcó "No" en la sección de IA: **-5 pts automáticos**.

---

## Tabla de Calificación

| Rango | Decisión |
|---|---|
| 90 – 100 | ✅ Contratar — candidato excepcional |
| 75 – 89 | ✅ Avanzar a entrevista técnica profunda |
| 65 – 74 | ⚠️ Avanzar con reservas — profundizar en debilidades detectadas |
| 50 – 64 | ❌ No avanzar — feedback constructivo al candidato |
| < 50 | ❌ Descartado — brechas fundamentales |

---

## Notas del Evaluador

*(Completar durante la revisión)*

**Candidato:**
**Fecha de evaluación:**
**Evaluador:**
**Puntaje total:** / 100

### Fortalezas observadas:
-

### Áreas de mejora:
-

### Decisión final:

---

*Daka Engineering Team — Technical Assessment Program*
