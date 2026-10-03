import { getDb } from './db/index';
import { images } from './db/schema';
import { eq } from 'drizzle-orm';

async function test() {
  try {
    const db = getDb();
    const res = await db.select().from(images).limit(1);
    console.log('Success:', res);
  } catch(e) {
    console.error('Error:', e);
  }
}
test();
