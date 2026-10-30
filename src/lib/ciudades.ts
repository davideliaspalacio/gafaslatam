// Departamentos y municipios de Colombia (DANE, vía github.com/marcovega/colombia-json).
// `codigo` es el que usa Shopify para el departamento (provinceCode). Bogotá D.C. va aparte.

export type Departamento = { nombre: string; codigo: string; ciudades: string[] };

export const DEPARTAMENTOS: Departamento[] = [
  { nombre: "Amazonas", codigo: "AMA", ciudades: ["Leticia", "Puerto Nariño"] },
  { nombre: "Antioquia", codigo: "ANT", ciudades: ["Abejorral", "Abriaquí", "Alejandría", "Amagá", "Amalfi", "Andes", "Angelópolis", "Angostura", "Anorí", "Anzá", "Apartadó", "Arboletes", "Argelia", "Armenia", "Barbosa", "Bello", "Belmira", "Betania", "Betulia", "Briceño", "Buriticá", "Cáceres", "Caicedo", "Caldas", "Campamento", "Cañasgordas", "Caracolí", "Caramanta", "Carepa", "Carolina del Príncipe", "Caucasia", "Chigorodó", "Cisneros", "Ciudad Bolívar", "Cocorná", "Concepción", "Concordia", "Copacabana", "Dabeiba", "Donmatías", "Ebéjico", "El Bagre", "El Carmen de Viboral", "El Peñol", "El Retiro", "El Santuario", "Entrerríos", "Envigado", "Fredonia", "Frontino", "Giraldo", "Girardota", "Gómez Plata", "Granada", "Guadalupe", "Guarne", "Guatapé", "Heliconia", "Hispania", "Itagüí", "Ituango", "Jardín", "Jericó", "La Ceja", "La Estrella", "La Pintada", "La Unión", "Liborina", "Maceo", "Marinilla", "Medellín", "Montebello", "Murindó", "Mutatá", "Nariño", "Nechí", "Necoclí", "Olaya", "Peque", "Pueblorrico", "Puerto Berrío", "Puerto Nare", "Puerto Triunfo", "Remedios", "Rionegro", "Sabanalarga", "Sabaneta", "Salgar", "San Andrés de Cuerquia", "San Carlos", "San Francisco", "San Jerónimo", "San José de la Montaña", "San Juan de Urabá", "San Luis", "San Pedro de los Milagros", "San Pedro de Urabá", "San Rafael", "San Roque", "San Vicente", "Santa Bárbara", "Santa Fe de Antioquia", "Santa Rosa de Osos", "Santo Domingo", "Segovia", "Sonsón", "Sopetrán", "Támesis", "Tarazá", "Tarso", "Titiribí", "Toledo", "Turbo", "Uramita", "Urrao", "Valdivia", "Valparaíso", "Vegachí", "Venecia", "Vigía del Fuerte", "Yalí", "Yarumal", "Yolombó", "Yondó", "Zaragoza"] },
  { nombre: "Arauca", codigo: "ARA", ciudades: ["Arauca", "Arauquita", "Cravo Norte", "Fortul", "Puerto Rondón", "Saravena", "Tame"] },
  { nombre: "Atlántico", codigo: "ATL", ciudades: ["Baranoa", "Barranquilla", "Campo de la Cruz", "Candelaria", "Galapa", "Juan de Acosta", "Luruaco", "Malambo", "Manatí", "Palmar de Varela", "Piojó", "Polonuevo", "Ponedera", "Puerto Colombia", "Repelón", "Sabanagrande", "Sabanalarga", "Santa Lucía", "Santo Tomás", "Soledad", "Suán", "Tubará", "Usiacurí"] },
  { nombre: "Bogotá D.C.", codigo: "DC", ciudades: ["Bogotá"] },
  { nombre: "Bolívar", codigo: "BOL", ciudades: ["Achí", "Altos del Rosario", "Arenal", "Arjona", "Arroyohondo", "Barranco de Loba", "Brazuelo de Papayal", "Calamar", "Cantagallo", "Cartagena de Indias", "Cicuco", "Clemencia", "Córdoba", "El Carmen de Bolívar", "El Guamo", "El Peñón", "Hatillo de Loba", "Magangué", "Mahates", "Margarita", "María la Baja", "Mompós", "Montecristo", "Morales", "Norosí", "Pinillos", "Regidor", "Río Viejo", "San Cristóbal", "San Estanislao", "San Fernando", "San Jacinto", "San Jacinto del Cauca", "San Juan Nepomuceno", "San Martín de Loba", "San Pablo", "Santa Catalina", "Santa Rosa", "Santa Rosa del Sur", "Simití", "Soplaviento", "Talaigua Nuevo", "Tiquisio", "Turbaco", "Turbaná", "Villanueva", "Zambrano"] },
  { nombre: "Boyacá", codigo: "BOY", ciudades: ["Almeida", "Aquitania", "Arcabuco", "Belén", "Berbeo", "Betéitiva", "Boavita", "Boyacá", "Briceño", "Buenavista", "Busbanzá", "Caldas", "Campohermoso", "Cerinza", "Chinavita", "Chiquinquirá", "Chíquiza", "Chiscas", "Chita", "Chitaraque", "Chivatá", "Chivor", "Ciénega", "Cómbita", "Coper", "Corrales", "Covarachía", "Cubará", "Cucaita", "Cuítiva", "Duitama", "El Cocuy", "El Espino", "Firavitoba", "Floresta", "Gachantivá", "Gámeza", "Garagoa", "Guacamayas", "Guateque", "Guayatá", "Güicán", "Iza", "Jenesano", "Jericó", "La Capilla", "La Uvita", "La Victoria", "Labranzagrande", "Macanal", "Maripí", "Miraflores", "Mongua", "Monguí", "Moniquirá", "Motavita", "Muzo", "Nobsa", "Nuevo Colón", "Oicatá", "Otanche", "Pachavita", "Páez", "Paipa", "Pajarito", "Panqueba", "Pauna", "Paya", "Paz del Río", "Pesca", "Pisba", "Puerto Boyacá", "Quípama", "Ramiriquí", "Ráquira", "Rondón", "Saboyá", "Sáchica", "Samacá", "San Eduardo", "San José de Pare", "San Luis de Gaceno", "San Mateo", "San Miguel de Sema", "San Pablo de Borbur", "Santa María", "Santa Rosa de Viterbo", "Santa Sofía", "Santana", "Sativanorte", "Sativasur", "Siachoque", "Soatá", "Socha", "Socotá", "Sogamoso", "Somondoco", "Sora", "Soracá", "Sotaquirá", "Susacón", "Sutamarchán", "Sutatenza", "Tasco", "Tenza", "Tibaná", "Tibasosa", "Tinjacá", "Tipacoque", "Toca", "Togüí", "Tópaga", "Tota", "Tunja", "Tununguá", "Turmequé", "Tuta", "Tutazá", "Úmbita", "Ventaquemada", "Villa de Leyva", "Viracachá", "Zetaquira"] },
  { nombre: "Caldas", codigo: "CAL", ciudades: ["Aguadas", "Anserma", "Aranzazu", "Belalcázar", "Chinchiná", "Filadelfia", "La Dorada", "La Merced", "Manizales", "Manzanares", "Marmato", "Marquetalia", "Marulanda", "Neira", "Norcasia", "Pácora", "Palestina", "Pensilvania", "Riosucio", "Risaralda", "Salamina", "Samaná", "San José", "Supía", "Victoria", "Villamaría", "Viterbo"] },
  { nombre: "Caquetá", codigo: "CAQ", ciudades: ["Albania", "Belén de los Andaquíes", "Cartagena del Chairá", "Curillo", "El Doncello", "El Paujil", "Florencia", "La Montañita", "Milán", "Morelia", "Puerto Rico", "San José del Fragua", "San Vicente del Caguán", "Solano", "Solita", "Valparaíso"] },
  { nombre: "Casanare", codigo: "CAS", ciudades: ["Aguazul", "Chámeza", "Hato Corozal", "La Salina", "Maní", "Monterrey", "Nunchía", "Orocué", "Paz de Ariporo", "Pore", "Recetor", "Sabanalarga", "Sácama", "San Luis de Palenque", "Támara", "Tauramena", "Trinidad", "Villanueva", "Yopal"] },
  { nombre: "Cauca", codigo: "CAU", ciudades: ["Almaguer", "Argelia", "Balboa", "Bolívar", "Buenos Aires", "Cajibío", "Caldono", "Caloto", "Corinto", "El Tambo", "Florencia", "Guachené", "Guapí", "Inzá", "Jambaló", "La Sierra", "La Vega", "López de Micay", "Mercaderes", "Miranda", "Morales", "Padilla", "Páez", "Patía", "Piamonte", "Piendamó", "Popayán", "Puerto Tejada", "Puracé", "Rosas", "San Sebastián", "Santa Rosa", "Santander de Quilichao", "Silvia", "Sotará", "Suárez", "Sucre", "Timbío", "Timbiquí", "Toribío", "Totoró", "Villa Rica"] },
  { nombre: "Cesar", codigo: "CES", ciudades: ["Aguachica", "Agustín Codazzi", "Astrea", "Becerril", "Bosconia", "Chimichagua", "Chiriguaná", "Curumaní", "El Copey", "El Paso", "Gamarra", "González", "La Gloria (Cesar)", "La Jagua de Ibirico", "La Paz", "Manaure Balcón del Cesar", "Pailitas", "Pelaya", "Pueblo Bello", "Río de Oro", "San Alberto", "San Diego", "San Martín", "Tamalameque", "Valledupar"] },
  { nombre: "Chocó", codigo: "CHO", ciudades: ["Acandí", "Alto Baudó", "Bagadó", "Bahía Solano", "Bajo Baudó", "Bojayá", "Cantón de San Pablo", "Cértegui", "Condoto", "El Atrato", "El Carmen de Atrato", "El Carmen del Darién", "Istmina", "Juradó", "Litoral de San Juan", "Lloró", "Medio Atrato", "Medio Baudó", "Medio San Juan", "Nóvita", "Nuquí", "Quibdó", "Río Iró", "Río Quito", "Riosucio", "San José del Palmar", "Sipí", "Tadó", "Unguía", "Unión Panamericana"] },
  { nombre: "Córdoba", codigo: "COR", ciudades: ["Ayapel", "Buenavista", "Canalete", "Cereté", "Chimá", "Chinú", "Ciénaga de Oro", "Cotorra", "La Apartada", "Lorica", "Los Córdobas", "Momil", "Moñitos", "Montelíbano", "Montería", "Planeta Rica", "Pueblo Nuevo", "Puerto Escondido", "Puerto Libertador", "Purísima", "Sahagún", "San Andrés de Sotavento", "San Antero", "San Bernardo del Viento", "San Carlos", "San José de Uré", "San Pelayo", "Tierralta", "Tuchín", "Valencia"] },
  { nombre: "Cundinamarca", codigo: "CUN", ciudades: ["Agua de Dios", "Albán", "Anapoima", "Anolaima", "Apulo", "Arbeláez", "Beltrán", "Bituima", "Bojacá", "Cabrera", "Cachipay", "Cajicá", "Caparrapí", "Cáqueza", "Carmen de Carupa", "Chaguaní", "Chía", "Chipaque", "Choachí", "Chocontá", "Cogua", "Cota", "Cucunubá", "El Colegio", "El Peñón", "El Rosal", "Facatativá", "Fómeque", "Fosca", "Funza", "Fúquene", "Fusagasugá", "Gachalá", "Gachancipá", "Gachetá", "Gama", "Girardot", "Granada", "Guachetá", "Guaduas", "Guasca", "Guataquí", "Guatavita", "Guayabal de Síquima", "Guayabetal", "Gutiérrez", "Jerusalén", "Junín", "La Calera", "La Mesa", "La Palma", "La Peña", "La Vega", "Lenguazaque", "Machetá", "Madrid", "Manta", "Medina", "Mosquera", "Nariño", "Nemocón", "Nilo", "Nimaima", "Nocaima", "Pacho", "Paime", "Pandi", "Paratebueno", "Pasca", "Puerto Salgar", "Pulí", "Quebradanegra", "Quetame", "Quipile", "Ricaurte", "San Antonio del Tequendama", "San Bernardo", "San Cayetano", "San Francisco", "San Juan de Rioseco", "Sasaima", "Sesquilé", "Sibaté", "Silvania", "Simijaca", "Soacha", "Sopó", "Subachoque", "Suesca", "Supatá", "Susa", "Sutatausa", "Tabio", "Tausa", "Tena", "Tenjo", "Tibacuy", "Tibirita", "Tocaima", "Tocancipá", "Topaipí", "Ubalá", "Ubaque", "Ubaté", "Une", "Útica", "Venecia", "Vergara", "Vianí", "Villagómez", "Villapinzón", "Villeta", "Viotá", "Yacopí", "Zipacón", "Zipaquirá"] },
  { nombre: "Guainía", codigo: "GUA", ciudades: ["Inírida"] },
  { nombre: "Guaviare", codigo: "GUV", ciudades: ["Calamar", "El Retorno", "Miraflores", "San José del Guaviare"] },
  { nombre: "Huila", codigo: "HUI", ciudades: ["Acevedo", "Agrado", "Aipe", "Algeciras", "Altamira", "Baraya", "Campoalegre", "Colombia", "El Pital", "Elías", "Garzón", "Gigante", "Guadalupe", "Hobo", "Íquira", "Isnos", "La Argentina", "La Plata", "Nátaga", "Neiva", "Oporapa", "Paicol", "Palermo", "Palestina", "Pitalito", "Rivera", "Saladoblanco", "San Agustín", "Santa María", "Suaza", "Tarqui", "Tello", "Teruel", "Tesalia", "Timaná", "Villavieja", "Yaguará"] },
  { nombre: "La Guajira", codigo: "LAG", ciudades: ["Albania", "Barrancas", "Dibulla", "Distracción", "El Molino", "Fonseca", "Hatonuevo", "La Jagua del Pilar", "Maicao", "Manaure", "Riohacha", "San Juan del Cesar", "Uribia", "Urumita", "Villanueva"] },
  { nombre: "Magdalena", codigo: "MAG", ciudades: ["Algarrobo", "Aracataca", "Ariguaní", "Cerro de San Antonio", "Chibolo", "Ciénaga", "Concordia", "El Banco", "El Piñón", "El Retén", "Fundación", "Guamal", "Nueva Granada", "Pedraza", "Pijiño del Carmen", "Pivijay", "Plato", "Pueblo Viejo", "Remolino", "Sabanas de San Ángel", "Salamina", "San Sebastián de Buenavista", "San Zenón", "Santa Ana", "Santa Bárbara de Pinto", "Santa Marta", "Sitionuevo", "Tenerife", "Zapayán", "Zona Bananera"] },
  { nombre: "Meta", codigo: "MET", ciudades: ["Acacías", "Barranca de Upía", "Cabuyaro", "Castilla la Nueva", "Cubarral", "Cumaral", "El Calvario", "El Castillo", "El Dorado", "Fuente de Oro", "Granada", "Guamal", "La Macarena", "La Uribe", "Lejanías", "Mapiripán", "Mesetas", "Puerto Concordia", "Puerto Gaitán", "Puerto Lleras", "Puerto López", "Puerto Rico", "Restrepo", "San Carlos de Guaroa", "San Juan de Arama", "San Juanito", "San Martín", "Villavicencio", "Vista Hermosa"] },
  { nombre: "Nariño", codigo: "NAR", ciudades: ["Aldana", "Ancuyá", "Arboleda", "Barbacoas", "Belén", "Buesaco", "Chachagüí", "Colón", "Consacá", "Contadero", "Córdoba", "Cuaspud", "Cumbal", "Cumbitara", "El Charco", "El Peñol", "El Rosario", "El Tablón", "El Tambo", "Francisco Pizarro", "Funes", "Guachucal", "Guaitarilla", "Gualmatán", "Iles", "Imués", "Ipiales", "La Cruz", "La Florida", "La Llanada", "La Tola", "La Unión", "Leiva", "Linares", "Los Andes", "Magüí Payán", "Mallama", "Mosquera", "Nariño", "Olaya Herrera", "Ospina", "Pasto", "Policarpa", "Potosí", "Providencia", "Puerres", "Pupiales", "Ricaurte", "Roberto Payán", "Samaniego", "San Bernardo", "San José de Albán", "San Lorenzo", "San Pablo", "San Pedro de Cartago", "Sandoná", "Santa Bárbara", "Santacruz", "Sapuyes", "Taminango", "Tangua", "Tumaco", "Túquerres", "Yacuanquer"] },
  { nombre: "Norte de Santander", codigo: "NSA", ciudades: ["Ábrego", "Arboledas", "Bochalema", "Bucarasica", "Cáchira", "Cácota", "Chinácota", "Chitagá", "Convención", "Cúcuta", "Cucutilla", "Duranía", "El Carmen", "El Tarra", "El Zulia", "Gramalote", "Hacarí", "Herrán", "La Esperanza", "La Playa de Belén", "Labateca", "Los Patios", "Lourdes", "Mutiscua", "Ocaña", "Pamplona", "Pamplonita", "Puerto Santander", "Ragonvalia", "Salazar de Las Palmas", "San Calixto", "San Cayetano", "Santiago", "Santo Domingo de Silos", "Sardinata", "Teorama", "Tibú", "Toledo", "Villa Caro", "Villa del Rosario"] },
  { nombre: "Putumayo", codigo: "PUT", ciudades: ["Colón", "Mocoa", "Orito", "Puerto Asís", "Puerto Caicedo", "Puerto Guzmán", "Puerto Leguízamo", "San Francisco", "San Miguel", "Santiago", "Sibundoy", "Valle del Guamuez", "Villagarzón"] },
  { nombre: "Quindío", codigo: "QUI", ciudades: ["Armenia", "Buenavista", "Calarcá", "Circasia", "Córdoba", "Filandia", "Génova", "La Tebaida", "Montenegro", "Pijao", "Quimbaya", "Salento"] },
  { nombre: "Risaralda", codigo: "RIS", ciudades: ["Apía", "Balboa", "Belén de Umbría", "Dosquebradas", "Guática", "La Celia", "La Virginia", "Marsella", "Mistrató", "Pereira", "Pueblo Rico", "Quinchía", "Santa Rosa de Cabal", "Santuario"] },
  { nombre: "San Andrés y Providencia", codigo: "SAP", ciudades: ["Providencia y Santa Catalina Islas", "San Andrés"] },
  { nombre: "Santander", codigo: "SAN", ciudades: ["Aguada", "Albania", "Aratoca", "Barbosa", "Barichara", "Barrancabermeja", "Betulia", "Bolívar", "Bucaramanga", "Cabrera", "California", "Capitanejo", "Carcasí", "Cepitá", "Cerrito", "Charalá", "Charta", "Chima", "Chipatá", "Cimitarra", "Concepción", "Confines", "Contratación", "Coromoro", "Curití", "El Carmen de Chucurí", "El Guacamayo", "El Peñón", "El Playón", "El Socorro", "Encino", "Enciso", "Florián", "Floridablanca", "Galán", "Gámbita", "Girón", "Guaca", "Guadalupe", "Guapotá", "Guavatá", "Güepsa", "Hato", "Jesús María", "Jordán", "La Belleza", "La Paz", "Landázuri", "Lebrija", "Los Santos", "Macaravita", "Málaga", "Matanza", "Mogotes", "Molagavita", "Ocamonte", "Oiba", "Onzaga", "Palmar", "Palmas del Socorro", "Páramo", "Piedecuesta", "Pinchote", "Puente Nacional", "Puerto Parra", "Puerto Wilches", "Rionegro", "Sabana de Torres", "San Andrés", "San Benito", "San Gil", "San Joaquín", "San José de Miranda", "San Miguel", "San Vicente de Chucurí", "Santa Bárbara", "Santa Helena del Opón", "Simacota", "Suaita", "Sucre", "Suratá", "Tona", "Valle de San José", "Vélez", "Vetas", "Villanueva", "Zapatoca"] },
  { nombre: "Sucre", codigo: "SUC", ciudades: ["Buenavista", "Caimito", "Chalán", "Colosó", "Corozal", "Coveñas", "El Roble", "Galeras", "Guaranda", "La Unión", "Los Palmitos", "Majagual", "Morroa", "Ovejas", "Sampués", "San Antonio de Palmito", "San Benito Abad", "San Juan de Betulia", "San Marcos", "San Onofre", "San Pedro", "Sincé", "Sincelejo", "Sucre", "Tolú", "Tolú Viejo"] },
  { nombre: "Tolima", codigo: "TOL", ciudades: ["Alpujarra", "Alvarado", "Ambalema", "Anzoátegui", "Armero", "Ataco", "Cajamarca", "Carmen de Apicalá", "Casabianca", "Chaparral", "Coello", "Coyaima", "Cunday", "Dolores", "El Espinal", "Falán", "Flandes", "Fresno", "Guamo", "Herveo", "Honda", "Ibagué", "Icononzo", "Lérida", "Líbano", "Mariquita", "Melgar", "Murillo", "Natagaima", "Ortega", "Palocabildo", "Piedras", "Planadas", "Prado", "Purificación", "Rioblanco", "Roncesvalles", "Rovira", "Saldaña", "San Antonio", "San Luis", "Santa Isabel", "Suárez", "Valle de San Juan", "Venadillo", "Villahermosa", "Villarrica"] },
  { nombre: "Valle del Cauca", codigo: "VAC", ciudades: ["Alcalá", "Andalucía", "Ansermanuevo", "Argelia", "Bolívar", "Buenaventura", "Buga", "Bugalagrande", "Caicedonia", "Cali", "Calima", "Candelaria", "Cartago", "Dagua", "El Águila", "El Cairo", "El Cerrito", "El Dovio", "Florida", "Ginebra", "Guacarí", "Jamundí", "La Cumbre", "La Unión", "La Victoria", "Obando", "Palmira", "Pradera", "Restrepo", "Riofrío", "Roldanillo", "San Pedro", "Sevilla", "Toro", "Trujillo", "Tuluá", "Ulloa", "Versalles", "Vijes", "Yotoco", "Yumbo", "Zarzal"] },
  { nombre: "Vaupés", codigo: "VAU", ciudades: ["Carurú", "Mitú", "Taraira"] },
  { nombre: "Vichada", codigo: "VID", ciudades: ["Cumaribo", "La Primavera", "Puerto Carreño", "Santa Rosalía"] },
];

export function departamento(nombre: string): Departamento | null {
  return DEPARTAMENTOS.find((d) => d.nombre === nombre) ?? null;
}

// ---------- Búsqueda para el campo de ciudad del pedido ----------

export type CiudadOpcion = { ciudad: string; departamento: string; codigo: string };

/** Minúsculas, sin tildes ni signos: "Bogotá D.C." → "bogota dc". "D.C.", "d.c" y "DC" quedan iguales. */
export function normalizar(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\bd c\b/g, "dc")
    .trim();
}

/** Cómo la gente escribe algunas ciudades → el nombre del DANE. */
const ALIAS: Record<string, string> = {
  bta: "bogota",
  "bogota dc": "bogota",
  cartagena: "cartagena de indias",
  "cartagena bolivar": "cartagena de indias",
  "san jose de cucuta": "cucuta",
  "santa fe de bogota": "bogota",
};

/**
 * Ciudades grandes: ganan los empates de la búsqueda (p. ej. "Armenia" muestra primero la del Quindío).
 * Las seis primeras son los botones rápidos del formulario (`corto` es lo que dice el botón).
 */
export const PRINCIPALES: { ciudad: string; codigo: string; corto?: string }[] = [
  { ciudad: "Bogotá", codigo: "DC", corto: "Bogotá" },
  { ciudad: "Medellín", codigo: "ANT", corto: "Medellín" },
  { ciudad: "Cali", codigo: "VAC", corto: "Cali" },
  { ciudad: "Barranquilla", codigo: "ATL", corto: "Barranquilla" },
  { ciudad: "Cartagena de Indias", codigo: "BOL", corto: "Cartagena" },
  { ciudad: "Bucaramanga", codigo: "SAN", corto: "Bucaramanga" },
  ...(
    [
      ["Cúcuta", "NSA"], ["Soacha", "CUN"], ["Soledad", "ATL"], ["Bello", "ANT"], ["Villavicencio", "MET"],
      ["Ibagué", "TOL"], ["Santa Marta", "MAG"], ["Valledupar", "CES"], ["Montería", "COR"], ["Pereira", "RIS"],
      ["Manizales", "CAL"], ["Pasto", "NAR"], ["Neiva", "HUI"], ["Palmira", "VAC"], ["Popayán", "CAU"],
      ["Buenaventura", "VAC"], ["Armenia", "QUI"], ["Sincelejo", "SUC"], ["Itagüí", "ANT"], ["Floridablanca", "SAN"],
      ["Riohacha", "LAG"], ["Envigado", "ANT"], ["Tuluá", "VAC"], ["Dosquebradas", "RIS"], ["Tunja", "BOY"],
      ["Girón", "SAN"], ["Piedecuesta", "SAN"], ["Florencia", "CAQ"], ["Yopal", "CAS"], ["Quibdó", "CHO"],
      ["Rionegro", "ANT"], ["Barrancabermeja", "SAN"], ["Cartago", "VAC"], ["Buga", "VAC"], ["Jamundí", "VAC"],
      ["Girardot", "CUN"], ["Zipaquirá", "CUN"], ["Chía", "CUN"], ["Fusagasugá", "CUN"], ["Facatativá", "CUN"],
      ["Sogamoso", "BOY"], ["Duitama", "BOY"], ["Apartadó", "ANT"], ["Ipiales", "NAR"], ["Tumaco", "NAR"],
      ["Maicao", "LAG"], ["Malambo", "ATL"], ["Arauca", "ARA"], ["San Andrés", "SAP"], ["Leticia", "AMA"],
      ["Mocoa", "PUT"], ["San José del Guaviare", "GUV"], ["Inírida", "GUA"], ["Mitú", "VAU"], ["Puerto Carreño", "VID"],
    ] as const
  ).map(([ciudad, codigo]) => ({ ciudad, codigo })),
];

/** "Medellín · Antioquia"; Bogotá va sola como "Bogotá D.C.". */
export function etiquetaCiudad(o: Pick<CiudadOpcion, "ciudad" | "departamento">) {
  return o.departamento === "Bogotá D.C." ? o.departamento : `${o.ciudad} · ${o.departamento}`;
}

type Entrada = { o: CiudadOpcion; n: string; completo: string; nd: string; rango: number };
let indice: Entrada[] | null = null;

function entradas(): Entrada[] {
  if (indice) return indice;
  const rango = new Map(PRINCIPALES.map((p, i) => [`${p.ciudad}|${p.codigo}`, i]));
  indice = DEPARTAMENTOS.flatMap((d) =>
    d.ciudades.map((c) => {
      const n = normalizar(c);
      const nd = normalizar(d.nombre);
      return { o: { ciudad: c, departamento: d.nombre, codigo: d.codigo }, n, nd, completo: `${n} ${nd}`, rango: rango.get(`${c}|${d.codigo}`) ?? 999 };
    }),
  );
  return indice;
}

/** Busca municipios sin importar tildes ni mayúsculas. Primero los que empiezan igual y las ciudades grandes. */
export function buscarCiudades(consulta: string, max = 8): CiudadOpcion[] {
  const n = normalizar(consulta);
  const q = ALIAS[n] ?? n;
  if (!q) return [];
  const encontrados: [number, Entrada][] = [];
  for (const e of entradas()) {
    let puntos: number;
    if (e.n === q || e.completo === q) puntos = 0;
    else if (e.n.startsWith(q)) puntos = 1;
    else if (e.completo.startsWith(q)) puntos = 1.5; // "medellin ant"
    else if (e.n.includes(` ${q}`)) puntos = 2;
    else if (e.n.includes(q)) puntos = 3;
    else if (e.nd.startsWith(q)) puntos = 4; // escribió el departamento
    else continue;
    encontrados.push([puntos, e]);
  }
  encontrados.sort((a, b) => a[0] - b[0] || a[1].rango - b[1].rango || a[1].n.length - b[1].n.length || a[1].n.localeCompare(b[1].n));
  return encontrados.slice(0, max).map(([, e]) => e.o);
}

/** Si lo escrito es el nombre exacto de un municipio (o de una ciudad grande con ese nombre), lo devuelve. */
export function ciudadExacta(consulta: string): CiudadOpcion | null {
  const n = normalizar(consulta);
  const q = ALIAS[n] ?? n;
  if (!q) return null;
  const corto = PRINCIPALES.find((p) => p.corto && normalizar(p.corto) === q);
  if (corto) return entradas().find((e) => e.o.ciudad === corto.ciudad && e.o.codigo === corto.codigo)?.o ?? null;
  const iguales = entradas().filter((e) => e.n === q || e.completo === q || normalizar(etiquetaCiudad(e.o)) === q);
  if (iguales.length === 1) return iguales[0].o;
  const grande = iguales.filter((e) => e.rango < 999).sort((a, b) => a.rango - b.rango)[0];
  return grande?.o ?? null;
}
