import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Crear usuario demo
  const hashedPassword = await bcrypt.hash('demo123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'demo@lifehub.com' },
    update: {},
    create: {
      email: 'demo@lifehub.com',
      password: hashedPassword,
      name: 'Usuario Demo',
      timezone: 'America/Mexico_City',
      theme: 'light',
      language: 'es'
    },
  });

  // Crear hábito diario
  const habit = await prisma.habit.upsert({
    where: { 
      id: 'demo-habit-1'
    },
    update: {},
    create: {
      id: 'demo-habit-1',
      userId: user.id,
      name: 'Beber agua',
      frequency: 'daily',
      reminderAt: new Date('2024-01-01T08:00:00Z'),
      goal: 8, // 8 vasos de agua
    },
  });

  console.log('✅ Usuario demo creado:', user.email);
  console.log('✅ Hábito demo creado:', habit.name);
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 