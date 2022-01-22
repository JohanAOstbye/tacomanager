import { MongoClient } from 'mongodb';
import * as fc from 'feistel-cipher';

const cipher = new fc.FPECipher(fc.SHA_256, process.env.CIPHER_SECRET, 128);

const uri = process.env.MONGODB_URI;

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;

export const mongoDate = 'YYYY-MM-DD[T00:00:00.000Z]';

const feistel = {
  encode: (id) => {
    return cipher.encrypt(id);
  },
  decode: (id) => {
    return cipher.decrypt(id);
  },
};
