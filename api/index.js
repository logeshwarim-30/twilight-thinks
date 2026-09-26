import { app } from '../server/src/server.js';
import { connectDB } from '../server/src/config/db.js';
import { store } from '../server/src/services/dataStore.js';

let isInitialized = false;

export default async function handler(req, res) {
  if (!isInitialized) {
    try {
      const isMongoConnected = await connectDB();
      await store.initialize(isMongoConnected);
      isInitialized = true;
    } catch (err) {
      console.error('[Vercel Serverless Init Error]', err);
    }
  }
  return app(req, res);
}
