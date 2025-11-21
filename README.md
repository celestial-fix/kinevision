# KineVision

**Plataforma de Recuperación de Movilidad Impulsada por IA**

KineVision es una aplicación web moderna diseñada para ayudar a pacientes en su proceso de rehabilitación física mediante el uso de visión por computadora e inteligencia artificial. Conecta a pacientes con profesionales de la salud y entrenadores de IA para un seguimiento preciso y motivador.

## 🚀 Características Principales

### Para Pacientes
*   **Coach de IA en Tiempo Real:** Análisis de movimiento mediante visión por computadora (MediaPipe) directamente en el navegador. Feedback instantáneo sobre la calidad del ejercicio y conteo de repeticiones.
*   **Dashboard Gamificado:** Sistema de rachas, puntajes de movilidad y rangos (Bronce, Plata, Oro) para mantener la motivación.
*   **Interacción por Voz:** Comandos de voz para interactuar con el coach sin usar las manos ("¿Cómo voy?", "Está muy difícil").
*   **Modo Híbrido:** Opción de usar la cámara en vivo o subir videos pre-grabados para análisis.
*   **Privacidad Primero:** Control total sobre el almacenamiento de videos de las sesiones.

### Para Profesionales
*   **Gestión de Pacientes:** Seguimiento del progreso y adherencia al plan de recuperación.
*   **Revisión de Sesiones:** Acceso a videos y métricas detalladas (si el paciente lo autoriza).
*   **Asignación de Planes:** Personalización de rutinas de ejercicios.

### Para Entrenadores de IA (colaboradores)
*   **Entrenamiento del Modelo:** Carga y clasificación de videos para mejorar la precisión del análisis.

## 🛠️ Stack Tecnológico

### Frontend
*   **React + Vite:** Desarrollo rápido y optimizado.
*   **Tailwind CSS:** Diseño moderno y responsivo con tema oscuro premium.
*   **MediaPipe:** Visión por computadora en el cliente para baja latencia.
*   **Lucide React:** Iconografía moderna.
*   **React Router:** Navegación SPA.

### Backend
*   **FastAPI:** API de alto rendimiento con Python.
*   **OpenCV:** Procesamiento de video en el servidor.
*   **SQLAlchemy:** ORM para gestión de base de datos.
*   **SQLite:** Base de datos ligera para desarrollo.

## 📦 Instalación y Uso

### Prerrequisitos
*   Node.js (v18+)
*   Python (v3.10+)
*   `uv` (Gestor de paquetes de Python)

### Configuración del Backend

1.  Navega al directorio del backend:
    ```bash
    cd backend
    ```
2.  Instala las dependencias e inicia el servidor:
    ```bash
    uv run uvicorn main:app --reload --port 8000
    ```

### Configuración del Frontend

1.  Navega al directorio del frontend:
    ```bash
    cd frontend
    ```
2.  Instala las dependencias:
    ```bash
    npm install
    ```
3.  Inicia el servidor de desarrollo:
    ```bash
    npm run dev
    ```

## 🌍 Localización

La aplicación está completamente localizada al **Español**, incluyendo la interfaz de usuario y el feedback del Coach de IA.

## 🔒 Privacidad

KineVision prioriza la privacidad del usuario. El análisis de video principal ocurre en el dispositivo del usuario. La subida de videos para revisión profesional es opcional y requiere consentimiento explícito.

# Magic Link Authentication Setup

The magic link authentication is now configured and ready to use.

## Current Status

✅ **Dev Mode (Default)**: Magic links are printed to the backend console
- When you request a magic link, check your backend terminal
- Look for the formatted email output with the clickable link
- Copy and paste the link into your browser

✅ **Production Mode**: Real emails via SMTP
- Configure SMTP credentials in `backend/.env`
- See `backend/.env.example` for configuration options

## How to Enable Real Emails

### Option 1: Gmail (Easiest for testing)

1. **Create a Gmail App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Generate a new app password for "Mail"
   - Copy the 16-character password

2. **Update `backend/.env`**:
   ```env
   SMTP_SERVER=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-16-char-app-password
   ```

3. **Restart the backend**

### Option 2: SendGrid (Recommended for production)

1. Sign up at https://sendgrid.com (free tier: 100 emails/day)
2. Create an API key
3. Update `backend/.env`:
   ```env
   SMTP_SERVER=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASSWORD=your-sendgrid-api-key
   ```

### Option 3: Mailgun

1. Sign up at https://www.mailgun.com
2. Get your SMTP credentials
3. Update `backend/.env` accordingly

## Testing the Magic Link

1. Go to `http://localhost:5173`
2. Enter your email address
3. Click "Continuar con Magic Link"
4. **Dev Mode**: Check backend console for the link
5. **Production Mode**: Check your email inbox
6. Click the magic link to authenticate

## For Docker Deployment

Add SMTP credentials to `docker-compose.yml` or use environment variables:

```yaml
backend:
  environment:
    - SMTP_USER=your-email@gmail.com
    - SMTP_PASSWORD=your-app-password
```

Or create a `.env` file in the project root and reference it in docker-compose.
