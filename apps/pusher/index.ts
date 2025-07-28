import { prismaClient } from "store/client";
import { xAddBulk } from "redis-be/client";

async function main() {
  const websites = await prismaClient.website.findMany({
    select: {
      url: true,
      id: true,
    },
  });

  console.log(`Fetched ${websites.length} websites from DB.`);

  await xAddBulk(websites);
  console.log('Added all websites to Redis stream.');
}

// // Run once now
main().catch(console.error);


setInterval(() => {
  main().catch(console.error);
}, 3 * 60 * 1000);
