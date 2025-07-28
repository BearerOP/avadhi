import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create default regions
  const regions = [
    { name: "us-east-1", id: "us-east-1" },
    { name: "us-west-1", id: "us-west-1" },
    { name: "eu-west-1", id: "eu-west-1" },
    { name: "ap-southeast-1", id: "ap-southeast-1" },
  ];

  for (const region of regions) {
    try {
      await prisma.region.create({
        data: region,
      });
      console.log(`✅ Created region: ${region.name} (${region.id})`);
    } catch (error: any) {
      // Handle unique constraint violation (region already exists)
      if (error.code === 'P2002' && error.meta?.target?.includes('id')) {
        console.log(`⏭️  Region already exists: ${region.name} (${region.id})`);
      } else {
        console.error(`❌ Error creating region ${region.name}:`, error);
        throw error;
      }
    }
  }

  console.log("🎉 Database seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 