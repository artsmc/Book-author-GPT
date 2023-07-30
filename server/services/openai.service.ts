import { IFileResponse, IOpenAICompletion, IOpenAICompletionDefault } from './../interfaces/openai.interface';
import { UtilService } from './util.service';
import axios from 'axios';
import * as FormData from 'form-data';
import { Configuration, OpenAIApi } from 'openai';

const APIKey = process.env.OPEN_AI_KEY;
const configuration = new Configuration({ apiKey: APIKey });
const openai = new OpenAIApi(configuration);

const openAi = axios.create({
    baseURL: 'https://api.openai.com/v1/',
    headers: {
        Authorization: `Bearer ${APIKey}`,
        'content-type': 'application/json',
    },
});

class OpenAIService extends UtilService {

    constructor() {
        super();
    }

    public async EmbedVector(id: string, content: string | string[], index?: number) {
        try {
            const vector = await this.convertToVector(content);
            return {
                vector: vector.embedding,
                namspace: id,
                metadata: index || null
            };
        } catch (error) {
            this.handleErrors(error);
        }
    }

    public async SearchFile(query: string, file: string, quality?: string) {
        try {
            const ready = await openai.createSearch('ada', { file, query });
            return ready.data;
        } catch (error) {
            this.handleErrors(error);
        }
    }

    public async BuildGPTBookResponse(prompt: string, memory:string, options?:IOpenAICompletionDefault, quality?: string) {
        return this.OpenAIChatRequest(this.promptBookGPT(prompt, memory, 'Authors Response'), options, quality);
    }

    private async OpenAIChatRequest(messages: {role:string,content:string}[],options?:IOpenAICompletionDefault, quality?: string) {
        const modelId = quality || 'gpt-3.5-turbo';
        const settings: IOpenAICompletionDefault = { model: modelId };

        try {
            const result = await openAi.post(`/chat/completions`, {
                ...this.extendDefaults(options, settings),
                messages
            });
            return result.data;
        } catch (error) {
            this.handleErrors(error);
        }
    }
    private async convertToVector(content): Promise<any> {
        try {
            const ready = await openai.createEmbedding({
                model: 'text-embedding-ada-002',
                input: content
            });
            return ready.data.data[0];
        } catch (error) {
            this.handleErrors(error);
        }
    }
    private promptBookGPT(prompt: string, memory:string, ask?:string): {role:string,content:string}[] {
        const script = ask ? `${prompt}:\n ${memory}\n${ask}:\n`: `${prompt}:\n ${memory}\n`;
        return this.bookSettingsGPT(script);
    }
    private bookSettingsGPT(script: string): {role:string,content:string}[] {
        return [
            {"role": "system", "content": "You are the author of the book."},
            {"role": "user", "content": "Your job is to advise me with the information you receive. As the author you are giving me the best possible information. Your persona is to treat me like a student learning. As the author you speak about the book as you wrote it in first person."},
            {"role": "user", "content": `${script}`}
        ];
    }

    private handleErrors(error: any) {
        const errData = { error: error.response?.data || error };
    }
}

export const openAIService = new OpenAIService();