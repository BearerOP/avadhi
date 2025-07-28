const WORKER_ID = Bun.env.WORKER_ID
const REGION_ID = Bun.env.REGION_ID

async function main() {
  console.log(`Worker ${WORKER_ID} running in region ${REGION_ID}`);
  while (true) {
    console.log(`Worker ${WORKER_ID} running in region ${REGION_ID}`);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  
}

main();