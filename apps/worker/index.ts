const WORKER_ID = Bun.env.WORKER_ID!
const REGION_ID = Bun.env.REGION_ID!

import { xAckBulk, xReadGroup } from "redis-be/client";
import { prismaClient } from "store/client";
import axios from "axios";

if (!REGION_ID) {
    throw new Error("Region not provided");
}

if (!WORKER_ID) {
    throw new Error("Region not provided");
}

async function main() {
    while(1) {
        const response = await xReadGroup(REGION_ID, WORKER_ID);

        if (!response) {
            continue;
        }

        let promises = response.map(({message}) => fetchWebsite(message.url, message.id))
        await Promise.all(promises);
        console.log(promises.length);

        xAckBulk(REGION_ID, response.map(({id}) => id));
    }
}


async function ensureRegionExists(regionId: string) {
  try {
    const existingRegion = await prismaClient.region.findUnique({
      where: { id: regionId },
    });

    if (!existingRegion) {
      console.log(`Creating region: ${regionId}`);
      await prismaClient.region.create({
        data: {
          id: regionId,
          name: regionId,
        },
      });
    }
  } catch (error: any) {
    // Handle unique constraint violation (region already exists)
    if (error.code === 'P2002' && error.meta?.target?.includes('id')) {
      console.log(`Region ${regionId} already exists, continuing...`);
      return;
    }
    // Re-throw other errors
    throw error;
  }
}

async function fetchWebsite(url: string, websiteId: string) {
  return new Promise<void>(async (resolve, reject) => {
    try {
      // Ensure the region exists before creating website tick
      await ensureRegionExists(REGION_ID);
      
      const startTime = Date.now();
      axios.get(url)
          .then(async (response) => { 
              const endTime = Date.now();
              console.log(response,'response');
              const websiteTick = await prismaClient.websiteTick.create({
                  data: {
                      response_time_ms: endTime - startTime,
                      status: "UP",
                      status_code: response.status,
                      status_text: response.statusText,
                      region_id: REGION_ID,
                      website_id: websiteId
                  }
              })
              console.log(websiteTick,'Tick created in worker');
              resolve()
          })
          .catch(async (error) => {
              const endTime = Date.now();
              // console.log('Error in fetchWebsite',error);
              
                const websiteTick = await prismaClient.websiteTick.create({
                  data: {
                      response_time_ms: endTime - startTime,
                      status: "DOWN",
                      status_code: 500,
                      status_text: "Internal Server Error",
                      region_id: REGION_ID,
                      website_id: websiteId,
                      error_message: error.message

                  }
              })
              console.log(websiteTick,'Tick created in worker');
              resolve()
          })
    } catch (error) {
      console.error("Error in fetchWebsite:", error);
      reject(error);
    }
  })
}

main();