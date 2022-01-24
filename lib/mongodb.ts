import { MongoClient, MongoClientOptions } from 'mongodb';
import * as fc from 'feistel-cipher';

const uri = process.env.MONGODB_URI;

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

const options: MongoClientOptions = {
  w: 'majority',
  retryWrites: true,
};

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;

const cipher = new fc.FPECipher(fc.SHA_256, process.env.CIPHER_SECRET, 128);

export const feistel = {
  encode: (id) => {
    return cipher.encrypt(id);
  },
  decode: (id) => {
    return cipher.decrypt(id);
  },
};
