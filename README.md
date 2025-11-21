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
