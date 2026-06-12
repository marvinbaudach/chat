import Anthropic from '@anthropic-ai/sdk';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export async function streamChat(
  apiKey: string,
  messages: Message[],
  onToken: (token: string) => void,
  onDone: () => void,
  onError: (err: string) => void,
): Promise<() => void> {
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

  let aborted = false;
  const abort = () => { aborted = true; };

  try {
    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      messages,
    });

    for await (const event of stream) {
      if (aborted) break;
      if (
        event.type === 'content_block_delta' &&
        event.delta.type === 'text_delta'
      ) {
        onToken(event.delta.text);
      }
    }
    if (!aborted) onDone();
  } catch (e: unknown) {
    if (!aborted) {
      const msg = e instanceof Error ? e.message : String(e);
      onError(msg);
    }
  }

  return abort;
}
