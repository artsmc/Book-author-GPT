
export interface IOpenAICompletion {
  prompt: string;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  best_of?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stop: string[];
  user: string;
}
export interface IOpenAICompletionDefault {
  model?: string;
  prompt?: string;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  best_of?: number;
  frequency_penalty?: number;
  stop?: string[];
  presence_penalty?: number;
}
export interface IFileResponse {
  id: string;
  object: string;
  bytes: number;
  created_at: number;
  filename: string;
  purpose: string;
}
