import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Crear usuario de prueba
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Usuario de Prueba',
    },
  });

  console.log('✅ Usuario creado:', user.email);

  // Crear hábitos de prueba
  const habits = await Promise.all([
    prisma.habit.upsert({
      where: { id: 'habit-1' },
      update: {},
      create: {
        id: 'habit-1',
        name: 'Ejercicio diario',
        frequency: 'daily',
        userId: user.id,
        goal: 30,
        // reminderAt: new Date(), // Opcional, puedes poner una fecha si quieres
      },
    }),
    prisma.habit.upsert({
      where: { id: 'habit-2' },
      update: {},
      create: {
        id: 'habit-2',
        name: 'Leer',
        frequency: 'daily',
        userId: user.id,
        goal: 20,
        // reminderAt: new Date(),
      },
    }),
    prisma.habit.upsert({
      where: { id: 'habit-3' },
      update: {},
      create: {
        id: 'habit-3',
        name: 'Meditar',
        frequency: 'daily',
        userId: user.id,
        goal: 10,
        // reminderAt: new Date(),
      },
    }),
  ]);

  console.log('✅ Hábitos creados:', habits.length);

  // Crear algunos logs de hábitos
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  await Promise.all([
    prisma.habitLog.upsert({
      where: { id: 'log-1' },
      update: {},
      create: {
        id: 'log-1',
        habitId: 'habit-1',
        userId: user.id,
        date: today,
        note: 'Ejercicio completado exitosamente',
        mood: 'energetic',
        energyLevel: 8,
      },
    }),
    prisma.habitLog.upsert({
      where: { id: 'log-2' },
      update: {},
      create: {
        id: 'log-2',
        habitId: 'habit-2',
        userId: user.id,
        date: today,
        note: 'Leí 25 páginas hoy',
        mood: 'focused',
        energyLevel: 7,
      },
    }),
    prisma.habitLog.upsert({
      where: { id: 'log-3' },
      update: {},
      create: {
        id: 'log-3',
        habitId: 'habit-1',
        userId: user.id,
        date: yesterday,
        note: 'Entrenamiento intenso',
        mood: 'motivated',
        energyLevel: 9,
      },
    }),
  ]);

  console.log('✅ Logs de hábitos creados');

  console.log('🎉 Seed completado exitosamente!');
  console.log('📧 Email de prueba: test@example.com');
  console.log('🔑 Contraseña: password123');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 