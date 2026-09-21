# ReelScout

Centro de inteligencia de contenido, análisis de competencia y generación de guiones para agencias de marketing.

Interfaz estilo feed (dark, tipo TikTok/Instagram) para explorar referencias de la competencia, generar guiones de video clasificados por etapa de embudo (TOFU / MOFU / BOFU) y guardarlos en una biblioteca lista para exportar.

## Stack

- **Next.js 16** (App Router) + **TypeScript** + **Tailwind CSS 4**
- **Prisma** + **SQLite** (base de datos local, sin configuración externa)
- Motor de generación de guiones con **fallback de plantillas** (funciona sin API key) y **generación real con Claude** (Anthropic API) cuando se configura `ANTHROPIC_API_KEY`

## Funcionalidad

1. **Feed de competencia**: tarjetas con thumbnail, plataforma (TikTok/Instagram), nicho, puntos de dolor y métricas. Buscador por palabra clave, nicho o punto de dolor. Cada video guardado queda **permanentemente en la base de datos** — es la memoria/catálogo de ideas de la competencia, y crece sin límite a medida que agregás links día a día.
2. **Ingesta por link con vista previa reproducible**: pegás un link de TikTok o Instagram, la app resuelve automáticamente título/autor/thumbnail (vía oEmbed de TikTok, o metadata pública para Instagram) y muestra un reproductor embebido real (`iframe`) para ver el video antes de guardar. Completás nicho, puntos de dolor y, opcionalmente, la transcripción como memoria para la IA.
3. **Panel de generación al hacer clic en cualquier video**: clickear la tarjeta (o su miniatura) abre un panel interactivo con el video embebido y reproducible arriba, y el formulario de generación abajo:
   - Cliente/negocio para el que es (con WhatsApp asociado)
   - Cantidad de variantes
   - Etapa del embudo (TOFU / MOFU / BOFU), con su definición
   - Ángulo o punto de dolor específico
4. **Guiones generados**: cada variante incluye Gancho (0-3s), Desarrollo (alineado a la etapa de embudo) y CTA específico, etiquetados por etapa. Los CTA de **BOFU dirigen siempre a WhatsApp** (usa el número cargado en el cliente si existe). Se pueden copiar o guardar en la biblioteca.
5. **Biblioteca**: guiones guardados, filtrables por cliente/etapa/favoritos, con copiar y exportar a `.txt`.
6. **Clientes**: alta simple de clientes de la agencia, incluyendo su número de WhatsApp para personalizar los CTA de venta directa.

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

### Sobre los embeds de TikTok/Instagram

El reproductor usa los embeds públicos oficiales de cada plataforma (`tiktok.com/embed/v2/...` y `instagram.com/.../embed`), sin necesidad de API keys. TikTok expone un endpoint de oEmbed público que se usa para autocompletar título/autor/thumbnail; Instagram no permite oEmbed sin token de Meta, así que para ese caso se intenta un scrape best-effort de metadata pública y, si falla, igual se muestra el reproductor embebido. Esto requiere que el servidor tenga salida a internet — en entornos sandboxeados sin acceso a internet el fetch falla de forma controlada y podés completar los datos a mano.

## Estructura

```
prisma/schema.prisma        Modelos: Client, CompetitorVideo, Script
src/lib/ai/                 Motor de generación (template engine + Anthropic)
src/lib/embed.ts            Detección de plataforma y URLs de embed (TikTok/Instagram)
src/app/api/                Rutas API (videos, clients, generate, scripts, oembed)
src/app/                    Páginas: feed (/), /library, /clients
src/components/             UI: feed, generación, biblioteca, clientes
```

## Scripts

- `npm run dev` — servidor de desarrollo
- `npm run build` / `npm run start` — build y producción
- `npm run lint` — ESLint
- `npm run db:seed` — repuebla la base con datos de ejemplo
