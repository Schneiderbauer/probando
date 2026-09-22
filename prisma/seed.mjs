import { PrismaClient, Platform } from "@prisma/client";

const prisma = new PrismaClient();

const videos = [
  {
    platform: Platform.TIKTOK,
    url: "https://www.tiktok.com/@clinicasonrisa/video/7351122334455",
    title: "3 señales de que necesitás un blanqueamiento YA",
    authorHandle: "@clinicasonrisa",
    niche: "odontologia",
    painPoints: "vergüenza al sonreír,dientes amarillos,inseguridad en fotos",
    transcript:
      "¿Te tapás la boca cuando te reís en las fotos? Estas son las 3 señales de que tus dientes necesitan un blanqueamiento profesional... primero, si notás manchas amarillas que el cepillado no saca. Segundo, si evitás sonreír en videollamadas. Tercero, si tomás mucho café o mate. Agendá tu evaluación gratuita, el link está en la bio.",
    thumbnailUrl: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600",
    metrics: JSON.stringify({ likes: 48200, comments: 612, views: 890000 }),
    notes: "Buen hook con pregunta directa + señales numeradas.",
  },
  {
    platform: Platform.INSTAGRAM,
    url: "https://www.instagram.com/reel/C1odontoreel/",
    title: "El error #1 que cometés al cepillarte los dientes",
    authorHandle: "@dra.martinez.odonto",
    niche: "odontologia",
    painPoints: "mal aliento,sangrado de encías,técnica de cepillado",
    transcript:
      "El 90% de la gente se cepilla mal los dientes y por eso le sangran las encías. Te muestro en 15 segundos la técnica correcta que uso con mis pacientes. Guardá este video para cuando te cepilles hoy a la noche.",
    thumbnailUrl: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600",
    metrics: JSON.stringify({ likes: 15300, comments: 204, views: 210000 }),
    notes: "Formato educativo corto, buen CTA de guardar.",
  },
  {
    platform: Platform.TIKTOK,
    url: "https://www.tiktok.com/@psico.ana/video/7351998877665",
    title: "Por qué te sentís cansado aunque duermas 8 horas",
    authorHandle: "@psico.ana",
    niche: "psicologia",
    painPoints: "ansiedad,agotamiento mental,burnout",
    transcript:
      "Podés dormir 8 horas y despertarte igual de cansado. No es flojera, es fatiga mental por sobrecarga de decisiones y ansiedad no procesada. En este video te explico las 3 causas reales y qué hacer hoy mismo para cortar el ciclo.",
    thumbnailUrl: "https://images.unsplash.com/photo-1541199249251-f713e6145474?w=600",
    metrics: JSON.stringify({ likes: 67000, comments: 1450, views: 1200000 }),
    notes: "Gancho con contradicción (dormís 8hs pero...). Muy viral en nicho salud mental.",
  },
  {
    platform: Platform.INSTAGRAM,
    url: "https://www.instagram.com/reel/C1psicoreel2/",
    title: "Cómo saber si necesitás terapia (aunque estés 'bien')",
    authorHandle: "@lic.gonzalez",
    niche: "psicologia",
    painPoints: "estigma de ir al psicólogo,ansiedad,crisis de identidad",
    transcript:
      "No hace falta estar 'mal' para ir a terapia. Si sentís que reaccionás de forma exagerada a cosas pequeñas, que te cuesta poner límites, o que repetís los mismos patrones en tus relaciones, la terapia te puede ayudar. Escribime DM y te cuento cómo arrancar.",
    thumbnailUrl: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=600",
    metrics: JSON.stringify({ likes: 22100, comments: 380, views: 340000 }),
    notes: "Desmonta el estigma, ideal para MOFU/BOFU.",
  },
  {
    platform: Platform.TIKTOK,
    url: "https://www.tiktok.com/@constructorpablo/video/7352001122334",
    title: "El error que te hace gastar el doble en tu obra",
    authorHandle: "@constructorpablo",
    niche: "construccion",
    painPoints: "sobrecostos,estafas de contratistas,demoras en obra",
    transcript:
      "El 70% de la gente que construye su casa termina gastando el doble del presupuesto original. Te cuento el error número uno: no pedir un presupuesto detallado por escrito antes de arrancar. En este video te explico cómo evitarlo paso a paso.",
    thumbnailUrl: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600",
    metrics: JSON.stringify({ likes: 31500, comments: 540, views: 560000 }),
    notes: "Dolor de sobrecosto, excelente para TOFU en nicho construcción.",
  },
  {
    platform: Platform.INSTAGRAM,
    url: "https://www.instagram.com/reel/C1nestorreel/",
    title: "Así dejamos una obra terminada en tiempo récord",
    authorHandle: "@nestor.construcciones",
    niche: "construccion",
    painPoints: "demoras en obra,falta de confianza en constructoras,calidad de terminaciones",
    transcript:
      "Muchos nos preguntan cómo hacemos para entregar las obras a tiempo. Acá les mostramos el antes y después de una remodelación completa en 45 días. Planificación semanal, equipo fijo y materiales comprados desde el día uno. Si querés un presupuesto para tu proyecto, escribinos.",
    thumbnailUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600",
    metrics: JSON.stringify({ likes: 9800, comments: 130, views: 145000 }),
    notes: "Caso de éxito / prueba social, ideal BOFU.",
  },
  {
    platform: Platform.TIKTOK,
    url: "https://www.tiktok.com/@nutri.laura/video/7352334455667",
    title: "Por qué no bajás de peso aunque comas 'sano'",
    authorHandle: "@nutri.laura",
    niche: "salud",
    painPoints: "sobrepeso,frustración con dietas,falta de resultados",
    transcript:
      "Podés estar comiendo ensaladas todos los días y no bajar un gramo. Te explico las 3 razones reales: exceso de aderezos, porciones mal calculadas y falta de proteína. No es falta de voluntad, es falta de información.",
    thumbnailUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600",
    metrics: JSON.stringify({ likes: 88000, comments: 2100, views: 1500000 }),
    notes: "Muy alto engagement, buen ángulo de mito vs realidad.",
  },
  {
    platform: Platform.INSTAGRAM,
    url: "https://www.instagram.com/reel/C1saludreel2/",
    title: "La rutina de 10 minutos que cambió mi energía",
    authorHandle: "@drfitness.oficial",
    niche: "salud",
    painPoints: "falta de tiempo,fatiga,sedentarismo",
    transcript:
      "No necesitás una hora en el gimnasio. Con 10 minutos de esta rutina por la mañana vas a notar más energía en la primera semana. Te la muestro completa acá y te dejo el PDF gratis en el link de la bio.",
    thumbnailUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600",
    metrics: JSON.stringify({ likes: 41200, comments: 700, views: 610000 }),
    notes: "Lead magnet gratuito, bueno para MOFU con captura de leads.",
  },
];

async function main() {
  console.log("Seeding database...");

  await prisma.script.deleteMany();
  await prisma.competitorVideo.deleteMany();
  await prisma.client.deleteMany();

  const clients = await Promise.all(
    [
      { name: "Néstor Construcciones", industry: "Construcción y remodelación", whatsapp: "+54 9 11 5555-0101" },
      { name: "Clínica Sonrisa", industry: "Odontología", whatsapp: "+54 9 11 5555-0102" },
      { name: "Lic. González Psicología", industry: "Psicología", whatsapp: "+54 9 11 5555-0103" },
      { name: "NutriLaura", industry: "Salud y nutrición", whatsapp: "+54 9 11 5555-0104" },
    ].map((c) => prisma.client.create({ data: c }))
  );

  for (const v of videos) {
    await prisma.competitorVideo.create({ data: v });
  }

  console.log(`Seeded ${clients.length} clients and ${videos.length} competitor videos.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
