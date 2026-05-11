import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const admin = await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: 'admin123',
    },
  });
  console.log(`✅ Admin created: ${admin.username}`);

  // Create site settings
  const settings = await prisma.siteSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      phone: '+598 99 123 456',
      email: 'contacto@boconchini.com',
      instagram: '@boconchini.uy',
      facebook: 'Boconchini Uruguay',
    },
  });
  console.log(`✅ Site settings created`);

  // Create cheeses
  const cheeses = [
    {
      name: 'Mozzarella Fiordilatte',
      slug: 'mozzarella-fiordilatte',
      description: 'Nuestra mozzarella artesanal elaborada con leche de vaca fresca. Textura suave y elástica con un sabor delicado y lácteo. Ideal para pizzas, ensaladas y caprese.',
      origin: 'La Mozzarella Fiordilatte tiene sus orígenes en la región de Campania, al sur de Italia, donde los monjes benedictinos la elaboraban por primera vez en el siglo XII. El nombre "Fiordilatte" significa "flor de leche" en italiano, haciendo referencia a la crema natural de la leche fresca de vaca. Esta tradición artesanal fue traída a Uruguay por inmigrantes italianos a fines del siglo XIX, conservando la técnica de "pasta filata" que la hace única en el mundo.',
      elaboration: `1. Recepción de leche fresca de vaca (control de calidad y temperatura a 4°C)
2. Pasteurización lenta a 65°C durante 30 minutos
3. Inoculación con cultivos lácticos naturales seleccionados
4. Adición de cuajo natural para la coagulación (35-40 minutos)
5. Corte de la cuajada en cubos de 2cm y reposo
6. Desuerado parcial y cocción a 38-42°C
7. Hilado artesanal (pasta filata) en agua caliente a 80°C
8. Moldeado a mano en forma de bolas o trenzas
9. Enfriado en agua fría con salmuera al 2%
10. Almacenamiento en suero lácteo a 4°C para conservar frescura`,
      nutrition: 'Calorías: 250 kcal | Proteínas: 18g | Grasas totales: 18g | Grasas saturadas: 11g | Carbohidratos: 1.5g | Azúcares: 0.5g | Sodio: 400mg | Calcio: 350mg | Colesterol: 50mg',
      price: '$450',
      imageUrl: '/mozzarella.webp',
      order: 1,
    },
    {
      name: 'Burrata Premium',
      slug: 'burrata-premium',
      description: 'La reina de los quesos frescos italianos. Corteza de mozzarella fina que envuelve una crema suave y sedosa de stracciatella. Una experiencia gourmet incomparable.',
      origin: 'La Burrata nació en Puglia, Italia, alrededor de los años 1920 en la ciudad de Andria. Según la historia, un quesero llamado Lorenzo Bianchino inventó este queso para aprovechar los retazos de mozzarella, mezclándolos con crema fresca. El nombre "Burrata" proviene del italiano "burro" (mantequilla), por su interior cremoso y rico. Hoy es considerada una de las joyas de la gastronomía italiana, protegida con denominación de origen IGP.',
      elaboration: `1. Selección de leche entera de vaca de máxima calidad
2. Pasteurización a 72°C durante 15 segundos (método HTST)
3. Maduración con fermentos lácticos thermofílicos por 4 horas
4. Coagulación con cuajo de ternera y corte fino de la cuajada
5. Hilado de la pasta exterior en agua a 85°C hasta obtener elasticidad
6. Preparación del relleno "stracciatella": hilado fino desmenuzado + crema fresca
7. Moldeado manual: se forma una bolsa con la mozzarella y se rellena
8. Cierre artesanal con un lazo (la característica "coronita" de la burrata)
9. Enfriado rápido en salmuera fría
10. Empaque individual y consumo recomendado dentro de las 48 horas`,
      nutrition: 'Calorías: 290 kcal | Proteínas: 14g | Grasas totales: 24g | Grasas saturadas: 15g | Carbohidratos: 1g | Azúcares: 0.5g | Sodio: 350mg | Calcio: 200mg | Colesterol: 80mg',
      price: '$520',
      imageUrl: '/burrata.webp',
      order: 2,
    },
    {
      name: 'Mascarpone Exclusivo',
      slug: 'mascarpone-exclusivo',
      description: 'Queso crema italiano de textura sedosa y sabor delicado. El ingrediente perfecto para tiramisú, postres gourmet o para disfrutar untado en pan fresco.',
      origin: 'El Mascarpone es originario de la región de Lombardía, en el norte de Italia, específicamente del área entre Milán y Lodi. Sus primeros registros datan del siglo XVI, aunque se popularizó en el siglo XX como ingrediente estrella del Tiramisú. El nombre podría derivar de "mascarpa", un término lombardo que designa un producto láctico similar al requesón, o del español "mascada" (masticada), refiriéndose a su textura cremosa.',
      elaboration: `1. Selección de crema de leche (nata) con mínimo 40% de materia grasa
2. Estandarización de la crema a 45% de grasa láctea
3. Calentamiento suave a 85-90°C sin hervir
4. Adición de ácido cítrico o tartárico natural para la coagulación
5. Coagulación lenta durante 30-40 minutos
6. Desuerado natural por gravedad en telas de musselina
7. Enfriado a 4°C durante 12-24 horas (maduración)
8. Salado ligero a gusto (opcional, según uso)
9. Envasado al vacío o en envases herméticos
10. Almacenamiento refrigerado a 2-4°C, vida útil de 15-20 días`,
      nutrition: 'Calorías: 330 kcal | Proteínas: 5g | Grasas totales: 35g | Grasas saturadas: 21g | Carbohidratos: 2g | Azúcares: 2g | Sodio: 80mg | Calcio: 120mg | Colesterol: 110mg',
      price: '$480',
      imageUrl: '/mascarpone.webp',
      order: 3,
    },
  ];

  for (const cheese of cheeses) {
    const created = await prisma.cheese.upsert({
      where: { slug: cheese.slug },
      update: {},
      create: cheese,
    });
    console.log(`✅ Cheese created: ${created.name}`);
  }

  console.log('\n🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
