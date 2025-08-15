import { createClient } from "redis";
// export const client = createClient();


export const client = createClient({
  username: 'bearer',
  password: 'bearerOP@123',
  socket: {
    host: 'redis-11186.c212.ap-south-1-1.ec2.redns.redis-cloud.com',
    port: 11186
  }
});
client.on("error", (err) => console.log("Redis Client Error", err));
await client.connect();


type WebsiteEvent = { url: string, id: string }
type MessageType = {
  id: string,
  message: {
    url: string,
    id: string
  }
}

const STREAM_NAME = "avadhi:website";

async function xAdd({ url, id }: WebsiteEvent) {
  try {
    console.log(`Adding to stream: url=${url}, id=${id}`);
    const entryId = await client.xAdd(STREAM_NAME, '*', { url, id });
    console.log(`Added entry ID: ${entryId}`);
  } catch (err) {
    console.error(`Error adding to stream:`, err);
    throw err;
  }
}




export async function xAddBulk(websites: WebsiteEvent[]) {
  await Promise.all(
    websites.map(website => xAdd({
      url: website.url,
      id: website.id,
    }))
  );
}



export async function xReadGroup(consumerGroup: string, workerId: string): Promise<MessageType[] | undefined> {
  const res = await client.xReadGroup(
    consumerGroup, workerId, {
    key: STREAM_NAME,
    id: '>'
  }, {
    'COUNT': 50
  }
  );

  
  //@ts-ignore
  let messages: MessageType[] | undefined = res?.[0]?.messages;


  // console.log(messages?.length,'in redis be');
  return messages;
}

async function xAck(consumerGroup: string, eventId: string) {
  await client.xAck(STREAM_NAME, consumerGroup, eventId)
}

export async function xAckBulk(consumerGroup: string, eventIds: string[]) {
  eventIds.map(eventId => xAck(consumerGroup, eventId));
}