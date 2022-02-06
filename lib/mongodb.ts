import { MongoClient, MongoClientOptions } from 'mongodb';
import Hashids from 'hashids';

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

const hashids = new Hashids(process.env.HASH_SALT);

export const hash = {
  encode: (num) => {
    return hashids.encodeHex(num);
  },
  decode: (num) => {
    return hashids.decodeHex(num);
  },
};

export function zeroPad(num) {
  return num.toString().padStart(6, '0');
}
