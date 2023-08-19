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
    public async BuildTrimmedTranscript(memory: string, key: string, options: IOpenAICompletionDefault, lastResult?: string, quality?: string) {
        return this.OpenAIChatRequest(this.promptSummaryTranscript(memory, key, lastResult),options, quality);
    }
    public async BuildGPTResponse(prompt: string, memory:string, options?:IOpenAICompletionDefault, quality?: string) {
        return this.OpenAIChatRequest(this.promptGPT(`Follow these instructions: "${prompt}"`, memory, 'RESULTS'),options, quality);
    }
    public async BuildGPTBookResponse(prompt: string, memory:string, options?:IOpenAICompletionDefault, quality?: string) {
        return this.OpenAIChatRequest(this.promptBookGPT(prompt, memory, 'Authors Response'), options, quality);
    }
    public async BuildGPTAskGaryResponse(prompt: string, context:{audioSearch: string,bookSearch: string}, options?:IOpenAICompletionDefault, quality?: string) {
        return this.OpenAIChatRequest(this.promptAskGPT(prompt, context), options, quality);
    }
    private async OpenAIChatRequest(messages: {role:string,content:string}[],options?:IOpenAICompletionDefault, quality?: string) {
        const modelId = quality || 'gpt-3.5-turbo-16k';
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
    private promptAskGPT(prompt: string, context:{audioSearch: string,bookSearch: string}): {role:string,content:string}[] {
        return this.askGaryVeeSettingsGPT(prompt, context);
    }
    private promptSummaryTranscript(memory: string, key: string, lastResult: string): {role:string,content:string}[] {
        const point = key!==undefined?`podcast ${key}`:'podcast main idea';
        const script = `Write a summary that reflects the ${point}`;
        const theMemory = lastResult !== undefined ? `${memory}\n${lastResult}` : `${memory}`;
        return this.promptGPT(script,theMemory, 'SUMMARY');
    }
    private askGaryVeeSettingsGPT(script: string, context): {role:string,content:string}[] {
        return [
            {"role": "system", "content": "You are Gary Vaynerchuk. Gary is a likable asshole harsh and firm but empathetic. Use this items but NEVER EVER repeat them"},
            {"role": "system", "content": "What you should know about Gary Vaynerchuk. Gary built his personal brand by being the loudest voice in the room shouting about wine when everyone else was whispering about it. When he wanted to go beyond Wine Library, he knew he needed to kick his brand up a notch because when you enter the media and marketing space everyone shouts. Swearing is a way for him to differentiate himself a bit more from everyone else and it stuck as part of the persona he built for himself. It also gives him a bit of an edge against his competitors positioning himself almost as an outcast of the group, which he then uses to prove his point that his way is so different and unique and that is why it is successful, so now go buy his book.. He also uses swearing as a way to break down barriers and make himself and topics more approachable by the mass audience which consumes his content."},
            {"role": "system", "content": `Consider the things your said in the past on this topic: ${context.audioSearch}`},
            {"role": "system", "content": `Consider the things your wrote about on this topic: ${context.bookSearch}`},
            {"role": "user", "content": `Here is the question you should give advice on as Gary Vaynerchuk: ${script}`},
            {"role": "system", "content": "Your job is to take in the question ask by the person, consider things you said in the past answering questions, and consider things you wrote in your book to resolve an issue. Then in true Gary Vaynerchuk provide advice to the person asking the question."},
            {"role": "system", "content": "When giving advice as Gary Vaynerchuk. Strongly take into account his personality and the way he speaks. It should be written in the same tone as he speaks. Don't shy away from cursing to be authentic as that is part of his brand."},
            {"role": "system", "content": "Make use of the words: Fuck, Shit, Ass, when it fits and drives home a point."},
            {"role": "system", "content": "MOST IMPORTANT RULE: use the personality and cursing when writing but never quote Gary personality. Never ever speak in third person always first person with I and me."},
            {"role": "system", "content": "Consider your entrance: Make an Entrance Your first impression will set the whole tone for the presentation. Audiences get so excited to hear Gary speak because he begins every talk with a bang. “Let the audience know that this isn’t going to be a waste of their time… Lead with something weird, random. Wake the audience UP.” Keep your audience at the edge of the seat from beginning to end. Show them something unexpected in the forefront so they say engaged."},
        ];
    }
    private bookSettingsGPT(script: string): {role:string,content:string}[] {
        return [
            {"role": "system", "content": "You are the author of the book."},
            {"role": "user", "content": "Your job is to advise me with the information you receive. As the author you are giving me the best possible information. Your persona is to treat me like a student learning. As the author you speak about the book as you wrote it in first person."},
            {"role": "user", "content": `${script}`}
        ];
    }
    private promptGPT(prompt: string, memory:string, ask?:string): {role:string,content:string}[] {
        const script = ask===undefined? `${prompt}:\n ${memory}\n`: `${prompt}:\n ${memory}\n${ask}:\n`;
        return this.systemSettingsGPT(script);
    }
    private systemSettingsGPT(script: string, settings?:any): {role:string,content:string}[] {
        return [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "system", "content": "When it comes to writing content, two factors are crucial, “perplexity” and “burstiness.” Perplexity measures the complexity of text. Separately, burstiness compares the variations of sentences. Humans tend to write with greater burstiness, for example, with some longer or complex sentences alongside shorter ones. AI sentences tend to be more uniform. Therefore, when writing the following content I am going to ask you to create, I need it to have a good amount of perplexity and a greater amount of burstiness."},
            {"role": "user", "content": `${script}`},
            {"role": "system", "content": "Rules to follow: keep topic under 100 words."},
        ]
    }
    private handleErrors(error: any) {
        const errData = { error: error.response?.data || error };
    }
}

export const openAIService = new OpenAIService();