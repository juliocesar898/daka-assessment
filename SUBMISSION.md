# 📬 Normas de Entrega — Daka Technical Assessment

Antes de comenzar la prueba, el candidato y el evaluador deben **acordar explícitamente** la modalidad de entrega. Ambas opciones son válidas; la elección depende del contexto de la entrevista.

---

## Modalidades de Entrega

### Opción A — Repositorio Privado (Recomendada)

1. Crea un repositorio **privado** en GitHub o GitLab.
2. Nombra el repositorio con el siguiente formato:
   ```
   daka-assessment-<tu-apellido>-<YYYY-MM>
   ```
   Ejemplo: `daka-assessment-rojas-2025-08`
3. Realiza **commits atómicos** con mensajes descriptivos. El historial de commits es parte de la evaluación.
4. Concede acceso de lectura al evaluador usando su nombre de usuario (acordado previamente).
5. Envía el enlace al repositorio por el canal acordado antes del vencimiento del plazo.

> **⚠️ Importante:** El repositorio debe ser **privado** durante todo el proceso. No lo hagas público hasta que el evaluador te lo indique.

---

### Opción B — Archivo Comprimido

1. Ejecuta el siguiente comando desde la raíz del proyecto para generar el archivo:
   ```bash
   # Excluye node_modules, .env, build artifacts y archivos de sistema
   zip -r daka-assessment-<apellido>-<YYYY-MM>.zip . \
     --exclude "*/node_modules/*" \
     --exclude "*/.env" \
     --exclude "*/dist/*" \
     --exclude "*/__pycache__/*" \
     --exclude "*/.next/*" \
     --exclude "*/.git/*" \
     --exclude "*/bin/*" \
     --exclude "*/obj/*"
   ```
2. Verifica que el `.zip` **no contenga** archivos `.env` con secretos reales antes de enviarlo.
3. Envía el archivo por el canal acordado (correo, Google Drive, WeTransfer, etc.).

---

## ✅ Checklist antes de entregar

Antes de enviar tu solución, verifica que:

- [ ] Los **seed tests pasan** sin modificar los archivos `.spec.ts` / `.spec.py` / `*Tests.cs` originales
  ```bash
  npm run test          # NestJS
  pytest tests/         # Python
  dotnet test           # C#
  php artisan test      # Laravel
  ```
- [ ] El proyecto **levanta correctamente** siguiendo el README (setup local o Docker)
- [ ] No hay archivos `.env` con secretos reales en el entregable
- [ ] No se incluyen `node_modules/`, `vendor/`, `dist/`, `__pycache__/`, `bin/`, `obj/`
- [ ] El código compila sin errores de TypeScript / linter (`npm run build`)
- [ ] Las variables de entorno requeridas están documentadas en `.env.example`
- [ ] Si usaste Docker: `docker-compose up` levanta toda la aplicación sin intervención manual

---

## 🚫 Lo que NO debes hacer

| ❌ Prohibido | ✅ Alternativa |
|---|---|
| Subir `.env` con credenciales reales | Usar `.env.example` con valores de ejemplo |
| Hardcodear secrets en el código | Usar `process.env.*` / `ConfigService` |
| Modificar los archivos de seed tests | Implementar el código hasta que pasen |
| Usar `any` en TypeScript de forma masiva | Tipar correctamente los DTOs y entidades |
| Subir `node_modules` al repositorio | El evaluador ejecuta `npm install` localmente |
| Omitir el historial de commits (1 commit gigante) | Commits pequeños y descriptivos |

---

## ⏱️ Plazo de Entrega

El assessment inicia formalmente el **día hábil siguiente** al que recibes este mensaje con el repositorio.

| Nivel | Plazo máximo |
|---|---|
| Junior | **3 días hábiles** (24 horas laborales) |
| Mid | **3 días hábiles** (24 horas laborales) |
| Mid-Senior | **3 días hábiles** (24 horas laborales) |
| Senior | **3 días hábiles** (24 horas laborales) |

> **Ejemplo:** Si recibes el repo el lunes a las 15:00, el plazo vence el **jueves al cierre de tu jornada laboral**.

Si necesitas una extensión por causa justificada, comunícalo **antes** de que venza el plazo.  
Las solicitudes post-vencimiento no se considerarán.
---

## 📞 Contacto durante la prueba

Si tienes dudas técnicas sobre el enunciado (no sobre la implementación), comunícate con el evaluador por el canal acordado. Las preguntas sobre el enunciado son bienvenidas; las preguntas sobre "cómo implementarlo" son parte de la evaluación.

---

*Daka Engineering Team — Technical Assessment Program*
