import { MongoClient } from "mongodb";

const uri = process.env.DATABASE_URI || process.env.DATABASE_URL;
const options = {
  connectTimeoutMS: 30000,
  serverSelectionTimeoutMS: 30000,
};

let client;
let clientPromise;

if (!uri) {
  console.warn("MongoDB connection warning: DATABASE_URI is not defined in environment variables.");
}

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so the MongoClient is not repeated on hot reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, avoid global variables
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
