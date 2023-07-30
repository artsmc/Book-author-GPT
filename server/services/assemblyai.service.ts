import { IOpenAICompletion, IOpenAICompletionDefault } from './../interfaces/openai.interface';
import { UtilService } from './util.service';
import axios from 'axios';

const assembly = axios.create({
  baseURL: 'https://api.assemblyai.com/v2',
  headers: {
    authorization: process.env.ASSEMBLY_AI,
    'content-type': 'application/json',
  },
});

class AssemblyAIService extends UtilService {

    public async TranscribeAudio(audioURL: string, multiple: boolean, speakerCount:number, token: string): Promise<any> {
        const dataObject = {
            audio_url: audioURL,
            speaker_labels: speakerCount > 0 ? multiple : true,
            speakers_expected: speakerCount > 0 ? Number(speakerCount) : undefined,
            auto_chapters: true,
            punctuate: true,
            format_text: true,
            disfluencies: true,
            webhook_url: `${process.env.WEBHOOK_BASE}/hook/transcript?authorization=${token}`
        }

        try {
            const res = await assembly.post(`/transcript`, dataObject);
            console.log(`Recieved a transcript: ${audioURL}\n ${res.data.id}`);
            return res.data;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    public async Transcript(transcriptID: string): Promise<any> {
        try {
            const res = await assembly.get(`/transcript/${transcriptID}`);
            const utterances = res.data.utterances || {};
            const words = res.data.words || [];

            const transcript = {
                status: res.data.status,
                text: res.data.text,
                id: res.data.id,
                trimmedTranscript: this.AssemblyChapterSumary(res.data.chapters),
                headlineOptions: this.AssemblyChapterHeadlines(res.data.chapters),
                utterances: words.length ? utterances : {
                    '0': {
                        ...res.data,
                        speaker: 'A',
                        start: words.length ? words[0].start : null,
                        end: words.length ? words[words.length - 1].end : null
                    }
                }
            };
            return transcript;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    private AssemblyChapterSumary(chapters): string {
        return chapters?.map(chapter => chapter.summary).join('') || '';
    }

    private AssemblyChapterHeadlines(chapters): string[] {
        return chapters?.map(chapter => chapter.headline) || [];
    }
}

export const assemblyAIService = new AssemblyAIService();