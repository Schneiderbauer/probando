# ReelScout

Centro de inteligencia de contenido, análisis de competencia y generación de guiones para agencias de marketing.

Interfaz estilo feed (dark, tipo TikTok/Instagram) para explorar referencias de la competencia, generar guiones de video clasificados por etapa de embudo (TOFU / MOFU / BOFU) y guardarlos en una biblioteca lista para exportar.

## Stack

- **Next.js 16** (App Router) + **TypeScript** + **Tailwind CSS 4**
- **Prisma** + **SQLite** (base de datos local, sin configuración externa)
- Motor de generación de guiones **100% IA real** (Claude Opus 5, vía Anthropic API) — no hay plantillas estáticas ni fallback genérico. Sin `ANTHROPIC_API_KEY` configurada, la generación no funciona y la app lo avisa claramente en vez de simular resultados.

## Funcionalidad

1. **Feed de competencia**: tarjetas con thumbnail, plataforma (TikTok/Instagram), nicho, puntos de dolor y métricas. Buscador por palabra clave, nicho o punto de dolor. Cada video guardado queda **permanentemente en la base de datos** — es la memoria/catálogo de ideas de la competencia, y crece sin límite a medida que agregás links día a día.
2. **Ingesta por link con vista previa reproducible**: pegás un link de TikTok o Instagram, la app resuelve automáticamente título/autor/thumbnail (vía oEmbed de TikTok, o metadata pública para Instagram) y muestra un reproductor embebido real (`iframe`) para ver el video antes de guardar. Completás nicho, puntos de dolor y, opcionalmente, la transcripción como memoria para la IA.
3. **Panel de generación al hacer clic en cualquier video**: clickear la tarjeta (o su miniatura) abre un panel interactivo con el video embebido y reproducible arriba, y el formulario de generación abajo:
   - Cliente/negocio para el que es (con WhatsApp asociado)
   - Cantidad de variantes
   - Etapa del embudo (TOFU / MOFU / BOFU), con su definición
   - Ángulo o punto de dolor específico
4. **Análisis estratégico automático**: al guardar una referencia (si hay `ANTHROPIC_API_KEY` configurada), Claude analiza el video — concepto central, ángulo, mecanismo psicológico del gancho y estructura del desarrollo — y lo guarda como memoria reutilizable en cada generación futura desde ese video.
5. **Guiones generados con IA real**: cada variante se genera con Claude Opus 5 (salida estructurada vía Zod, thinking adaptativo), usando el análisis del video como guía de estructura psicológica — nunca copiándolo. Cada variante usa un mecanismo de gancho distinto (pregunta, dato shockeante, confesión, contraste, etc.) para evitar la repetición de fórmulas. Incluye Gancho (0-3s), Desarrollo (alineado a la etapa de embudo) y CTA específico. Los CTA de **BOFU dirigen siempre a WhatsApp** (usa el número cargado en el cliente si existe). Se pueden copiar o guardar en la biblioteca.
6. **Biblioteca**: guiones guardados, filtrables por cliente/etapa/favoritos, con copiar y exportar a `.txt`.
7. **Clientes**: alta simple de clientes de la agencia, incluyendo su número de WhatsApp para personalizar los CTA de venta directa.

## Setup

```bash
npm install
cp .env.example .env   # ya viene con DATABASE_URL configurado
npx prisma migrate dev # crea prisma/dev.db
npm run db:seed        # carga clientes y videos de ejemplo
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

### Generación con IA (obligatoria)

La generación de guiones y el análisis estratégico de referencias usan la API real de Claude — no hay motor de plantillas ni modo offline. Configurá:

```bash
# en .env
ANTHROPIC_API_KEY=sk-ant-...
```

Sin esta clave, el feed y la biblioteca funcionan igual (podés guardar referencias), pero al intentar generar guiones la app muestra un aviso claro pidiendo configurarla — nunca genera contenido genérico como reemplazo.

### Sobre los embeds de TikTok/Instagram

El reproductor usa los embeds públicos oficiales de cada plataforma (`tiktok.com/embed/v2/...` y `instagram.com/.../embed`), sin necesidad de API keys. TikTok expone un endpoint de oEmbed público que se usa para autocompletar título/autor/thumbnail; Instagram no permite oEmbed sin token de Meta, así que para ese caso se intenta un scrape best-effort de metadata pública y, si falla, igual se muestra el reproductor embebido. Esto requiere que el servidor tenga salida a internet — en entornos sandboxeados sin acceso a internet el fetch falla de forma controlada y podés completar los datos a mano.

## Estructura

```
prisma/schema.prisma        Modelos: Client, CompetitorVideo, Script
src/lib/ai/                 Motor de generación y análisis (Claude Opus 5, salida estructurada con Zod)
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
