export interface IAssemblyTranscript {
    acoustic_model: string;
    audio_duration: number;
    audio_url: string;
    confidence: number;
    dual_channel: null;
    format_text: boolean;
    id: string;
    language_model: string;
    punctuate: true;
    status: string;
    text: string;
    chapters: IAssemblyChapters[];
    utterances: {
        [order: string| number]: IAssemblyTranscriptUtterances
    }|null;
    webhook_status_code: number;
    webhook_url: string;
    words: IAssemblyTranscriptWords[];
}
export interface IAssemblyTranscriptUtterances {
    speaker: string;
    confidence: number;
    end: number;
    start: number;
    text: string;
    words: IAssemblyTranscriptWords[];
}
export interface IAssemblyTranscriptWords {
    confidence: number;
    end: number;
    start: number;
    text: string;
}
export interface IAssemblyChapters {
    headline: number;
    end: number;
    start: number;
    summary: string;
}
