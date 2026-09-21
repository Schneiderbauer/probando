# ReelScout

Centro de inteligencia de contenido, análisis de competencia y generación de guiones para agencias de marketing.

Interfaz estilo feed (dark, tipo TikTok/Instagram) para explorar referencias de la competencia, generar guiones de video clasificados por etapa de embudo (TOFU / MOFU / BOFU) y guardarlos en una biblioteca lista para exportar.

## Stack

- **Next.js 16** (App Router) + **TypeScript** + **Tailwind CSS 4**
- **Prisma** + **SQLite** (base de datos local, sin configuración externa)
- Motor de generación de guiones con **fallback de plantillas** (funciona sin API key) y **generación real con Claude** (Anthropic API) cuando se configura `ANTHROPIC_API_KEY`

## Funcionalidad

1. **Feed de competencia**: tarjetas con thumbnail, plataforma (TikTok/Instagram), nicho, puntos de dolor y métricas. Buscador por palabra clave, nicho o punto de dolor.
2. **Ingesta de referencias**: modal para pegar el link del video de la competencia junto con su transcripción/metadata (simula la ingesta sin depender de scraping externo).
3. **Panel de generación**: al hacer clic en "Generar guiones" sobre una tarjeta, se abre un panel que pregunta:
   - Cliente/negocio para el que es
   - Cantidad de variantes
   - Etapa del embudo (TOFU / MOFU / BOFU), con su definición
   - Ángulo o punto de dolor específico
4. **Guiones generados**: cada variante incluye Gancho (0-3s), Desarrollo (alineado a la etapa de embudo) y CTA específico, etiquetados por etapa. Se pueden copiar o guardar en la biblioteca.
5. **Biblioteca**: guiones guardados, filtrables por cliente/etapa/favoritos, con copiar y exportar a `.txt`.
6. **Clientes**: alta simple de clientes de la agencia.

## Setup

```bash
npm install
cp .env.example .env   # ya viene con DATABASE_URL configurado
npx prisma migrate dev # crea prisma/dev.db
npm run db:seed        # carga clientes y videos de ejemplo
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

### Generación con IA real (opcional)

Por defecto la app usa un motor de plantillas local (sin dependencias externas). Para generar guiones con Claude:

```bash
# en .env
ANTHROPIC_API_KEY=sk-ant-...
```

Si la llamada a la API falla o no hay key configurada, la app cae automáticamente al motor de plantillas.

## Estructura

```
prisma/schema.prisma        Modelos: Client, CompetitorVideo, Script
src/lib/ai/                 Motor de generación (template engine + Anthropic)
src/app/api/                Rutas API (videos, clients, generate, scripts)
src/app/                    Páginas: feed (/), /library, /clients
src/components/             UI: feed, generación, biblioteca, clientes
```

## Scripts

- `npm run dev` — servidor de desarrollo
- `npm run build` / `npm run start` — build y producción
- `npm run lint` — ESLint
- `npm run db:seed` — repuebla la base con datos de ejemplo
