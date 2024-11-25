import { MongoClient, Db } from "mongodb";
import "dotenv/config";

class MongoDB {
  private static instance: MongoDB;
  private client: MongoClient;
  private db: Db | null = null;

  private constructor() {
    const uri =
      process.env.MONGO_CONNECTION_STRING || "your-default-mongodb-uri";
    this.client = new MongoClient(uri);
  }

  public static async getInstance(): Promise<MongoDB> {
    if (!MongoDB.instance) {
      MongoDB.instance = new MongoDB();
      await MongoDB.instance.connect();
    }
    return MongoDB.instance;
  }

  private async connect(): Promise<void> {
    await this.client.connect();
    this.db = this.client.db(process.env.DB_NAME || "your-default-db-name");
  }

  public getDb(): Db | null {
    if (this.db) {
      return this.db; // Return the db if it's initialized
    }
    return null; // Return null if db is not initialized
  }

  public async close(): Promise<void> {
    await this.client.close();
  }
}

export default MongoDB;

export async function getMongoDBInstance(): Promise<Db | null> {
  const mongoDB = await MongoDB.getInstance();
  return mongoDB.getDb(); // Corrected logic
}
