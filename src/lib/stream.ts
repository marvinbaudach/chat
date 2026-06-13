import Anthropic from '@anthropic-ai/sdk';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface StreamHandlers {
  onToken: (token: string) => void;
  onDone: () => void;
  onError: (message: string) => void;
}

export const CHAT_MODEL = 'claude-sonnet-4-6';

/**
 * Streams a chat completion and returns an abort function synchronously, so the
 * caller can cancel an in-flight request. The stream is consumed in the
 * background; aborting rejects the underlying fetch, which we swallow.
 */
export function streamChat(
  apiKey: string,
  messages: Message[],
  { onToken, onDone, onError }: StreamHandlers,
): () => void {
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
  const controller = new AbortController();

  (async () => {
    try {
      const stream = client.messages.stream(
        { model: CHAT_MODEL, max_tokens: 2048, messages },
        { signal: controller.signal },
      );

      for await (const event of stream) {
        if (
          event.type === 'content_block_delta' &&
          event.delta.type === 'text_delta'
        ) {
          onToken(event.delta.text);
        }
      }
      onDone();
    } catch (e: unknown) {
      if (controller.signal.aborted) return;
      onError(e instanceof Error ? e.message : String(e));
    }
  })();

  return () => controller.abort();
}
