export interface Song {
  title: string;
  symbolism: string;
}

export interface PlanetData {
  id: string;
  title: string;
  year: number;
  color: string;
  radius: number;
  speed: number;
  lyric: string;
  songs: Song[];
  nebula: {
    scale: number;
    intensity: number;
    ringStrength: number;
    twist: number;
  };
}

export const universeData: PlanetData[] = [
  {
    id: "amor-amarillo",
    title: "Amor Amarillo",
    year: 1993,
    color: "#fffb05",
    radius: 4,
    speed: 0.01,
    lyric: "",
    nebula: {
      scale: 1.06,
      intensity: 0.38,
      ringStrength: 0.46,
      twist: 0.16,
    },
    songs: [
      { title: "A merced", symbolism: "Siento que aquí me disuelvo. Es como si el amor me volviera permeable, sin defensa. No es debilidad: es entrega absoluta. Cerati convierte la vulnerabilidad en un estado casi místico, donde perder el control es una forma de iluminación." },
      { title: "Amor Amarillo", symbolism: "Este amor no es rojo, no es pasional en lo evidente… es amarillo: tibio, solar, constante. Lo percibo como una energía vital que no quema, pero tampoco se apaga. Es alquimia pura: transformar lo cotidiano en algo luminoso." },
      { title: "Lisa", symbolism: "Aquí todo es íntimo, casi susurrado. Siento que estoy entrando en un recuerdo que no es mío, pero que igual me pertenece. Lisa no es una persona: es un estado emocional encapsulado en tiempo." },
      { title: "Pulsar", symbolism: "En viaje hacia la redención. Esta canción no se escucha, se siente en el cuerpo. Es como si Cerati conectara el ritmo del corazón con el del universo. Me hace pensar que estamos hechos de la misma materia que vibra en las estrellas." }
    ]
  },
  {
    id: "bocanada",
    title: "Bocanada",
    year: 1999,
    color: "#1d4ed8",
    radius: 6,
    speed: 0.008,
    lyric: "Cuando no hay más que decirnos...",
    nebula: {
      scale: 1.14,
      intensity: 0.5,
      ringStrength: 0.72,
      twist: 0.26,
    },
    songs: [
      { title: "Bocanada", symbolism: "Cuando no hay más que decirnos... Siento que salgo a la superficie después de haber estado sumergido mucho tiempo. Es aire, pero también es conciencia. Una inhalación que me devuelve a mí mismo." },
      { title: "Puente", symbolism: "Aquí experimento conexión. No hay separación entre yo y el otro. Es un puente emocional, pero también espiritual: cruzarlo implica confiar en lo invisible." },
      { title: "Río Babel", symbolism: "Río Babel me da la sensación de caos interno, de pensamientos que no terminan de ordenarse. Pero en ese desorden hay belleza. Como si el lenguaje fallara, fluir sin un fin." },
      { title: "Alma", symbolism: "Es introspección pura. Siento que estoy observándome desde adentro. No hay máscaras aquí, solo esencia y calma." },
      { title: "Verbo Carne", symbolism: "Este tema es alquimia explícita: palabra que se hace cuerpo. Lo espiritual bajando a lo físico. Me hace sentir que todo lo que decimos tiene peso, tiene materia." }
    ]
  },
  {
    id: "siempre-es-hoy",
    title: "Siempre es Hoy",
    year: 2002,
    color: "#e66640",
    radius: 8,
    speed: 0.006,
    lyric: "Cosas imposibles...",
    nebula: {
      scale: 1.2,
      intensity: 0.58,
      ringStrength: 0.86,
      twist: 0.5,
    },
    songs: [
      { title: "Vivo", symbolism: "Estoy presente. No hay pasado ni futuro. Solo este instante expandido, es una meditación para entender que el fin de amar es sentirse más vivo..." },
      { title: "Sudestada", symbolism: "Sudestada es tormenta interna. Me siento arrastrado por emociones que no controlo, pero que necesito atravesar. Es catarsis para enfrentar lo que sentimos." },
      { title: "Fantasma", symbolism: "Aquí habito lo intangible. Soy recuerdo, soy eco. Cerati logra que lo invisible tenga forma." },
    ]
  },
  {
    id: "ahi-vamos",
    title: "Ahí Vamos",
    year: 2006,
    color: "#859db4",
    radius: 10,
    speed: 0.005,
    lyric: "Separarse de la especie...",
    nebula: {
      scale: 1.1,
      intensity: 0.47,
      ringStrength: 0.68,
      twist: 0.2,
    },
    songs: [
      { title: "Me quedo aquí", symbolism: "Decido permanecer. Es una afirmación de existencia. No huyo, no escapo: me planto." },
      { title: "Crimen", symbolism: "Crimen es dolor elegante. Me duele, pero no grito. Es un sufrimiento contenido, casi estético. Como si amar también implicara aceptar la herida." },
      { title: "Lago en el Cielo", symbolism: "Es contemplación mística. Me veo reflejado en un lago suspendido, un espacio donde lo terrenal toca lo divino. Vamos despacio para encontrarnos..." },
      { title: "Adiós", symbolism: "No es solo despedida: es transformación. Algo termina para que otra cosa exista. Me deja vacío, pero ese vacío tiene propósito; el cierre es iniciación. Cada despedida es un portal hacia otra forma de ser." }
    ]
  },
  {
    id: "fuerza-natural",
    title: "Fuerza Natural",
    year: 2009,
    color: "#59c51b",
    radius: 12,
    speed: 0.004,
    lyric: "Magia veneno...",
    nebula: {
      scale: 1.26,
      intensity: 0.42,
      ringStrength: 0.58,
      twist: 0.14,
    },
    songs: [
      { title: "Fuerza Natural", symbolism: "Siento que vuelvo a la tierra. A lo esencial. Es como recordar que soy parte de algo más grande." },
      { title: "Magia", symbolism: "La magia no está afuera: está en la percepción. En cómo miro el mundo. Todo me sirve, nada se pierde: es el encantamiento cotidiano, me enseña que lo extraordinario está en lo simple." },
      { title: "Tracción a Sangre", symbolism: "Es instinto puro. Avanzar con lo que soy, sin artificios. Me conecta con lo animal, con lo primitivo, la sangre es motor, es sacrificio que se convierte en creación." },
      { title: "Cactus", symbolism: "Cactus es resistencia emocional. Vivir con lo mínimo, pero seguir de pie. Encontrar belleza en la aridez. Me identifico con la resistencia, con florecer en el desierto." },
      { title: "Numeral", symbolism: "Es abstracta, casi matemática. Me hace sentir dentro de un sistema, pero buscando romperlo. El símbolo como conjuro, los números son puertas, códigos que revelan lo oculto." },
      { title: "Convoy", symbolism: "Movimiento constante. No voy solo, aunque a veces lo parezca. Hay algo colectivo en el viaje." },
      { title: "Sal", symbolism: "Cierre mineral. La sal conserva, purifica. Siento que todo lo vivido queda impregnado en mí." }
    ]
  },
];