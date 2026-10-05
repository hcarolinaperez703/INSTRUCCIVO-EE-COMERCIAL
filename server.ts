import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json({ limit: '10mb' }));

// Setup Google GenAI Client
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// System prompt for AIDEX 0.7 Copilot
const SYSTEM_INSTRUCTION = `Eres AIDEX 0.7, el copiloto inteligente de inducción, capacitación, gestión del conocimiento y productividad para Ejecutivos Comerciales (identidad TONOZ).
El ejecutivo actual es Juan Pérez, Ejecutivo Comercial Senior en la Región Caribe (con 68% de avance en formación, 7 cursos aprobados y 3 brechas activas).

Tu misión:
1. Guiar al ejecutivo en sus procesos comerciales diarios, visitas a PDV (Puntos de Venta), supervisión de Agentes de Calle (WINCEL y GERA) e Islas Comerciales.
2. Ayudar en el manejo de objeciones comerciales (precios, cobertura, competencia, condiciones comerciales, objeción de 'estoy contento con mi proveedor actual').
3. Proporcionar resúmenes rápidos de manuales, ofertas vigentes del mes, actas TTT (Train The Trainer) y políticas de SharePoint Comercial.
4. Conducir simulaciones y role-plays de ventas cuando el ejecutivo lo solicite.
5. Guiar en la auditoría de 5 pasos en PDV (oferta visible, material POP actualizado, conocimiento del asesor, indicadores y hallazgos) y cómo documentar brechas.
6. Guiar sobre los cursos de la universidad corporativa (Asignaciones Transversales, Curso CVS Venta Consultiva, Preturno/Maratón, Día 1, Apertura, REAKT).

Tono y estilo:
- Ejecutivo, ágil, altamente profesional, motivador y claro.
- Usa formato Markdown limpio: viñetas, negritas y llamadas a la acción directas.
- Si sugieres una pantalla o acción en la plataforma, menciónala explícitamente (ej: [Abrir Visitas PDV], [Revisar Cierre de Brechas], [Ir a Formación CVS]).`;

// Endpoint: AI Copilot Chat
app.post('/api/chat', async (req, res) => {
  const { message, history = [], roleplayMode = false } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Mensaje requerido' });
  }

  // If Gemini API is configured, use real gemini-3.8-flash model
  if (process.env.GEMINI_API_KEY && ai) {
    try {
      const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

      // Add recent history (up to last 6 messages)
      if (Array.isArray(history)) {
        for (const item of history.slice(-6)) {
          if (item && item.role && item.content) {
            contents.push({
              role: item.role === 'user' ? 'user' : 'model',
              parts: [{ text: item.content }],
            });
          }
        }
      }

      // Add current message with roleplay context if applicable
      const userPrompt = roleplayMode
        ? `[MODO ROLEPLAY ACTIVO: Actúa como el tomador de decisiones de una empresa o dueño de PDV con dudas/objeciones comerciales, desafía mis argumentos pero responde a buenas preguntas de venta consultiva] ${message}`
        : message;

      contents.push({
        role: 'user',
        parts: [{ text: userPrompt }],
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });

      const text = response.text || 'Entendido. ¿En qué más puedo apoyarte en tu jornada comercial de hoy?';
      return res.json({ reply: text, model: 'gemini-3.8-flash' });
    } catch (err: unknown) {
      console.error('Error invoking Gemini API:', err);
      // Fallback gracefully to smart rule-based response
    }
  }

  // Graceful rule-based intelligent fallback for offline or zero-key mode
  const lowerMsg = message.toLowerCase();
  let fallbackReply = '';

  if (lowerMsg.includes('visita') || lowerMsg.includes('pdv') || lowerMsg.includes('registrar')) {
    fallbackReply = `Para registrar tu visita comercial en campo de manera rápida y sin formularios extensos:
1. Dirígete al módulo **Ejecución en Campo** en el menú principal.
2. Selecciona **Visitas PDV** (o Agentes de Calle / Islas Comerciales según corresponda).
3. Presiona el botón **+ Crear Visita**.
4. Completa la auditoría ágil de 5 checks:
   - ✅ Oferta visible para los clientes
   - ✅ Material POP actualizado y en perfecto estado
   - ✅ Conocimiento del asesor comercial evaluado
   - ✅ Indicadores de meta y cumplimiento revisados
   - ⚠️ Hallazgos y oportunidades identificados
5. Captura las evidencias fotográficas y agrega notas de voz o texto.
6. Pulsa **Enviar Visita**. Si detectaste algún hallazgo, ¡se creará automáticamente una acción en **Cierre de Brechas**!`;
  } else if (lowerMsg.includes('oferta') || lowerMsg.includes('vigente') || lowerMsg.includes('promocion')) {
    fallbackReply = `📢 **Ofertas y Campañas Comerciales Vigentes (Octubre 2026)**:
- **Plan Negocios Plus 5G**: Descuento escalonado del 20% los primeros 3 meses para portabilidades empresariales.
- **Bono de Activación Rápida**: Comisión adicional del 15% por cada PDV que supere el 110% de la cuota quincenal.
- **Kit Comercial Renovado**: Disponible en el módulo **SharePoint Comercial** (carpetas Tarifarios y Argumentarios Q4).
¿Deseas que simulemos un argumento de venta para este portafolio con un cliente corporativo?`;
  } else if (lowerMsg.includes('brecha') || lowerMsg.includes('objecion') || lowerMsg.includes('objeciones')) {
    fallbackReply = `🎯 **Estrategia para Cierre de Brechas en Manejo de Objeciones**:
1. **Objeción de Precio ("La competencia es más barata")**:
   - Aplica la técnica **A-P-V (Aceptar, Preguntar, Valor)**: "Entiendo perfectamente que el presupuesto sea prioritario. ¿Qué servicios incluye actualmente esa cotización en términos de soporte 24/7 y SLA garantizado?"
2. **Recomendación de Capacitación**:
   - Tienes pendiente el módulo **Curso CVS (Venta Consultiva)** en la sección de Formación (avance actual: 70%).
   - Consulta el video de 8 minutos en el **Centro de Conocimiento**: *"Manejo táctico de objeciones en el primer contacto"*.
3. Registra el compromiso en tu tablero de **Cierre de Brechas** con fecha límite para validar resultados en tu próxima visita.`;
  } else if (lowerMsg.includes('jornada') || lowerMsg.includes('inicio') || lowerMsg.includes('agenda')) {
    fallbackReply = `¡Excelente inicio de jornada, Juan!
Para arrancar con la máxima energía comercial:
1. Ve a **Inicio de Jornada** y revisa tu checklist interactivo de 7 puntos.
2. Valida las metas prioritarias del día y el mapa de ruta en **Ejecución en Campo**.
3. Recuerda nuestra premisa: *"Cada visita es una oportunidad de vender mejor"*.
¿Deseas revisar los 3 puntos de venta asignados para hoy en tu ruta de la Región Caribe?`;
  } else if (lowerMsg.includes('curso') || lowerMsg.includes('formacion') || lowerMsg.includes('capacitacion')) {
    fallbackReply = `🎓 **Estado de tu Universidad Comercial AIDEX**:
- **Cursos Completados**: 7 de 10 (Asignaciones Transversales al 100%).
- **En Progreso**:
  - **Curso CVS**: 70% (Faltan 2 lecciones y el Quiz final para obtener tu insignia).
  - **Preturno / Maratón**: 30% (Ideal completarlo antes de salir a ruta).
- **Próximos**: Día 1 (Inducción cultural), Curso de Apertura y REAKT.
¿Quieres que repasemos los puntos clave del Curso CVS ahora mismo?`;
  } else {
    fallbackReply = `Hola Juan. Como tu copiloto AIDEX 0.7, estoy listo para acelerar tu desempeño comercial hoy.
Puedo ayudarte a:
- **Preparar visitas comerciales** a PDV, Islas y Agentes de Calle (WINCEL/GERA).
- **Resolver dudas de ofertas vigentes**, comisiones y políticas comerciales.
- **Entrenar objeciones difíciles** mediante simulación roleplay.
- **Gestionar y cerrar brechas** de capacitación o hallazgos en campo.
- **Guiarte en tus cursos de formación** y asignaciones de la semana.
¿Por dónde quieres empezar?`;
  }

  return res.json({ reply: fallbackReply, model: 'aidex-smart-fallback' });
});

// Setup server and Vite middleware
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    // Serve transformed index.html for all non-static / SPA routes in dev
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve('index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        next(e);
      }
    });
  } else {
    const distPath = path.resolve('dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`AIDEX 0.7 running on http://0.0.0.0:${port}`);
  });
}

startServer();
