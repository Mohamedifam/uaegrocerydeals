import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const prices = await prisma.price.findMany();
  console.log('Prices in DB:', prices.length);
  
  if (prices.length > 0) {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    await prisma.price.updateMany({
      data: {
        validFrom: today,
        validTo: nextWeek,
        active: true,
      }
    });
    console.log('Updated prices to be active today.');
  } else {
    console.log('No prices found to update.');
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
