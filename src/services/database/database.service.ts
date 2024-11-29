import { Db, ObjectId } from "mongodb";
import { Singleton } from "../../lib/singleton";
import { getMongoDBInstance } from "../../mongo/instance";

@Singleton
class DATABASE_SERVICE {
  private db: Db | null = null;

  public initialize = async () => {
    this.db = await getMongoDBInstance();
  };

  public async get_single_document(
    id: string | ObjectId,
    collection_name: string,
    key_against: string
  ) {
    try {
      await this.initialize();
      const query = {
        [key_against]: id,
      };
      const topic = this.db?.collection(collection_name).findOne(query);
      return topic;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  public insert_document = async (data: any, collection_name: string) => {
    try {
      await this.initialize();
      const topic = await this.db?.collection(collection_name).insertOne(data);
      return topic;
    } catch (error: any) {
      throw new Error(error);
    }
  };
  public async update_document(
    id: string,
    data: any,
    collection_name: string,
    key_against: string,
    key_to_update: string
  ) {
    try {
      await this.initialize();
      const topic = this.db
        ?.collection(collection_name)
        .updateOne({ [key_against]: id }, { $push: { [key_to_update]: data } });
      return topic;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  public async get_all_documents_of_collection(collection_name: string) {
    try {
      await this.initialize();
      const topics = this.db?.collection(collection_name).find({}).toArray();
      return topics;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  public async get_documents_except(id_array: []) {
    await this.initialize();
    const ques_sets = await this.db
      ?.collection("sets")
      .find({ _id: { $nin: id_array } })
      .limit(5)
      .toArray();
    console.log(ques_sets);
    return ques_sets;
  }
}

export default new DATABASE_SERVICE();
