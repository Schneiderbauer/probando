import type { GenerateScriptsParams, GeneratedScript, FunnelStage } from "@/types";

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

function firstPainPoint(painPoints: string): string {
  return painPoints.split(",")[0]?.trim() || painPoints.trim();
}

const HOOK_TEMPLATES: Record<FunnelStage, ((a: string) => string)[]> = {
  TOFU: [
    (a) => `¿Te pasa que ${a}? Pará todo, esto te va a servir.`,
    (a) => `El 90% de la gente comete este error con ${a} y ni se da cuenta.`,
    (a) => `Si sentís ${a}, no sos vos: es esto.`,
    (a) => `Nadie te lo va a decir, pero ${a} tiene una razón muy simple.`,
    (a) => `3 señales de que ${a} te está costando más de lo que pensás.`,
  ],
  MOFU: [
    (a) => `Esto es lo que de verdad hay que saber sobre ${a}.`,
    (a) => `Te lo explico como se lo explico a mis clientes: por qué pasa ${a}.`,
    (a) => `La razón real detrás de ${a} (y no es la que pensás).`,
    (a) => `Después de años trabajando esto, así es como resolvemos ${a}.`,
    (a) => `Guardá este video: acá te explico paso a paso cómo abordar ${a}.`,
  ],
  BOFU: [
    (a) => `Si estás decidido a resolver ${a}, esto es para vos.`,
    (a) => `Dejá de postergarlo: así solucionamos ${a} con nuestros clientes.`,
    (a) => `Dos cupos disponibles este mes para ayudarte con ${a}.`,
    (a) => `Esto es exactamente lo que hacemos cuando alguien llega con ${a}.`,
    (a) => `El resultado habla solo: así resolvimos ${a} en tiempo récord.`,
  ],
};

interface DevContext {
  angle: string;
  niche: string;
  clientName: string;
}

const DEV_TEMPLATES: Record<FunnelStage, ((ctx: DevContext) => string)[]> = {
  TOFU: [
    ({ angle }) =>
      `La mayoría piensa que ${angle} es normal y que no tiene mucho para hacer al respecto. Pero casi siempre hay una causa puntual: hábitos que nadie te explicó bien, información incompleta o simplemente falta de un empujón en la dirección correcta. No es falta de voluntad, es falta de claridad. Y una vez que entendés qué está pasando de verdad, es mucho más fácil de resolver.`,
    ({ angle }) =>
      `Vos pensás que ${angle} es algo con lo que hay que aprender a vivir... pero en realidad no. Lo que pasa es que casi nadie te cuenta las causas reales, así que seguís haciendo lo mismo esperando un resultado distinto. Cuando entendés el porqué, todo cambia: empezás a ver el problema con otros ojos y a tomar decisiones distintas.`,
    ({ angle }) =>
      `Tres cosas que casi nadie te dice sobre ${angle}: primero, no es solo tuyo, le pasa a mucha más gente de la que pensás. Segundo, casi siempre tiene una causa concreta y identificable. Tercero, no se resuelve solo con "fuerza de voluntad", se resuelve entendiendo qué lo está generando.`,
  ],
  MOFU: [
    ({ angle, clientName }) =>
      `En ${clientName} vemos esto todo el tiempo: personas que llegan con ${angle} sin saber que tiene una solución concreta. Así lo abordamos: primero identificamos la causa real, no los síntomas. Segundo, armamos un plan simple y realista para tu día a día. Tercero, hacemos seguimiento para ajustar lo que haga falta en el camino. No es una fórmula mágica, es un método probado.`,
    ({ angle, clientName }) =>
      `Hace poco trabajamos con alguien que llegó justo por ${angle}. Al principio pensaba que no tenía solución, pero cuando entendimos bien qué lo estaba generando, pudimos armar un plan a medida. En pocas semanas ya se notaba la diferencia. Esto es lo que hacemos en ${clientName}: no aplicamos recetas genéricas, entendemos cada caso antes de actuar.`,
    ({ angle, clientName }) =>
      `Si te identificás con ${angle}, esto te va a servir. En ${clientName} lo trabajamos en tres pasos: evaluación real de tu situación, un plan claro (sin vueltas ni promesas vacías) y acompañamiento durante todo el proceso. El objetivo no es una solución temporal, es que el cambio se sostenga en el tiempo.`,
  ],
  BOFU: [
    ({ angle, clientName }) =>
      `En ${clientName} ya ayudamos a un montón de personas a resolver ${angle}, con un proceso claro y resultados que se pueden ver. Este mes tenemos cupos limitados para arrancar. Si estás cansado de probar por tu cuenta sin resultados, esta es la diferencia: acompañamiento profesional, un plan hecho a tu medida y seguimiento real, no un video más en tu feed.`,
    ({ angle, clientName }) =>
      `Así resolvimos ${angle} con nuestro último cliente: evaluamos su caso puntual, armamos un plan concreto y lo acompañamos paso a paso hasta ver resultados. En ${clientName} trabajamos así con cada persona que llega. Si estás en la misma situación, es el momento de dar el paso.`,
    ({ angle, clientName }) =>
      `Si ya sabés que ${angle} no se va a resolver solo, en ${clientName} te ofrecemos exactamente lo que necesitás: un diagnóstico real de tu situación y un plan de acción claro, sin vueltas. Tenemos pocos lugares disponibles este mes para empezar.`,
  ],
};

const CTA_TEMPLATES: Record<FunnelStage, string[]> = {
  TOFU: [
    "Comentá 'QUIERO' y te mando más info.",
    "Seguime para la parte 2 de esto.",
    "Etiquetá a alguien que necesita ver esto.",
    "Guardá este video para no perderlo.",
  ],
  MOFU: [
    "Mandame un DM con la palabra 'INFO' y te cuento más.",
    "Descargá la guía gratuita en el link de la bio.",
    "Escribime tu duda en los comentarios y te respondo en el próximo video.",
    "Sumate a la newsletter para recibir más contenido como este.",
  ],
  BOFU: [
    "Agendá tu consulta gratuita, el link está en la bio.",
    "Escribinos 'QUIERO EMPEZAR' por DM y coordinamos hoy mismo.",
    "Quedan pocos cupos este mes, reservá el tuyo ahora.",
    "Hacé clic en el link de la bio y agendá tu evaluación sin costo.",
  ],
};

export function generateWithTemplateEngine(params: GenerateScriptsParams): GeneratedScript[] {
  const { competitorVideo, clientName, variantCount, funnelStage, angle } = params;
  const resolvedAngle = angle?.trim() || firstPainPoint(competitorVideo.painPoints);
  const results: GeneratedScript[] = [];

  for (let i = 0; i < variantCount; i++) {
    const hookFn = pick(HOOK_TEMPLATES[funnelStage], i);
    const devFn = pick(DEV_TEMPLATES[funnelStage], i);
    const cta = pick(CTA_TEMPLATES[funnelStage], i);

    const hook = hookFn(resolvedAngle);
    const development = devFn({
      angle: resolvedAngle,
      niche: competitorVideo.niche,
      clientName,
    });

    const fullText = `HOOK (0-3s):\n${hook}\n\n${development}\n\nCTA:\n${cta}`;

    results.push({
      variantNo: i + 1,
      funnelStage,
      angle: resolvedAngle,
      hook,
      development,
      cta,
      fullText,
      model: "template-engine",
    });
  }

  return results;
}
