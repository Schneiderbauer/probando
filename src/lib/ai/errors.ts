export class MissingApiKeyError extends Error {
  constructor() {
    super(
      "No hay una ANTHROPIC_API_KEY configurada. La generación de guiones requiere una conexión real a la API de Claude — configurá la variable de entorno para poder generar guiones."
    );
    this.name = "MissingApiKeyError";
  }
}

export class AiGenerationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AiGenerationError";
  }
}
