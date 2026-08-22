import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const SEED_PASSWORD = process.env.SEED_PASSWORD ?? 'ChangeMe123!';

const users = [
  { email: 'admin@hcm.local', role: 'admin' },
  { email: 'cirujano@hcm.local', role: 'cirujano' },
  { email: 'residente@hcm.local', role: 'residente' },
  { email: 'enfermeria@hcm.local', role: 'enfermeria' },
] as const;

async function main() {
  const passwordHash = await bcrypt.hash(SEED_PASSWORD, 10);

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: { role: user.role },
      create: { email: user.email, passwordHash, role: user.role },
    });
    console.log(`seed ok: ${user.email} (${user.role})`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
