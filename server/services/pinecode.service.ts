
import { VectorOperationsApi } from "@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch";
import { pinecone } from "../_config/config";
import { openAIService } from "./openai.service";
import { UtilService } from "./util.service";

class Pinecone extends UtilService {
    async index(): Promise<VectorOperationsApi> {
        await pinecone.init({
            apiKey: process.env.PINECONE_VAL,
            environment: process.env.PINECONE_ENV
        });
        return pinecone.Index(process.env.PINECONE_INDEX);
    }
    insert(tid, content, index, size) {
        return new Promise((resolve, reject) => {
            openAIService.EmbedVector(tid, content, index).then(async embed => {
                const id = this.token();
                (await this.index()).upsert({
                    upsertRequest: { 
                        vectors: [{
                            id,
                            'values': embed.vector,
                            'metadata': { 'transcript': embed.namspace, index, size },
                        }],
                        namespace: embed.namspace
                    }
                })
                    .then(ready => resolve({ id, ready }))
                    .catch(error => {
                        console.log(error.data);
                        reject(error.data);
                    });
            }).catch(error => {
                console.log({ error });
                reject({ error });
            });
        });
    }
    insertBook(tid, content, index, size, chapter) {
        return new Promise((resolve, reject) => {
            openAIService.EmbedVector(tid, content, index).then(async embed => {
                const id = this.token();
                (await this.index()).upsert({
                    upsertRequest: { 
                        namespace: tid.toString(),
                        vectors: [{
                            id,
                            'values': embed.vector,
                            'metadata': { 'book': embed.namspace, index, size, chapter },
                        }],
                    }
                    
                })
                    .then(ready => resolve({ id, ready }))
                    .catch(error => {
                        console.log(error.data);
                        reject(error.data);
                    });
            }).catch(error => {
                console.log({ error });
                reject({ error });
            });
        });
    }
    update(id, tid, content, index, size) {
        return new Promise((resolve, reject) => {
            openAIService.EmbedVector(tid, content, index).then(async embed => {
                (await this.index()).update({
                    updateRequest: {
                        id,
                        namespace: embed.namspace,
                        setMetadata: { 'transcript': embed.namspace, index, size },
                        values: embed.vector
                    }
                })
                    .then(ready => resolve(ready))
                    .catch(error => {
                        console.log(error.data);
                        reject(error.data);
                    });
            }).catch(error => {
                console.log({ error });
                reject({ error });
            });
        });
    }
    query(tid, content, querySize) {
        return new Promise((resolve, reject) => {
            openAIService.EmbedVector(tid, content).then(async embed => {
                (await this.index()).query({
                    queryRequest: {
                        namespace: embed.namspace,
                        includeMetadata: true,
                        topK: querySize||4000,
                        vector: embed.vector
                    }
                }).then(ready => resolve(ready.matches))
                    .catch(error => {
                        console.log(error);
                        reject({ error });
                    });
            });
        });
    }
    delete(ids: string[], tid: string) {
        return new Promise(async (resolve, reject) => {
            (await this.index()).delete1({
                ids, deleteAll: false, namespace:tid
            }).then(ready => resolve(ready))
                .catch(error => {
                    console.log(error);
                    reject({ error });
                });
        });
    }
    deleteIndex(tid: string) {
        return new Promise(async (resolve, reject) => {
            (await this.index()).delete1({ids:[], deleteAll: true, namespace:tid}).then(ready => resolve(ready))
                .catch(error => {
                    console.log(error);
                    reject({ error });
                });
        });
    }
}
export const pineconeService = new Pinecone();