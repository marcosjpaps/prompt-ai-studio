export type Provider = 'openrouter'|'openai'|'groq'|'grok';
export function providerConfig(value: unknown, openaiModel='gpt-4.1-mini') {
  const provider:Provider = value==='openrouter'||value==='groq'||value==='grok' ? value : 'openai';
  const available = {
    openrouter: {endpoint:'https://openrouter.ai/api/v1/chat/completions', model:'openai/gpt-4o-mini'},
    openai: {endpoint:'https://api.openai.com/v1/chat/completions', model:openaiModel},
    groq: {endpoint:'https://api.groq.com/openai/v1/chat/completions', model:'qwen/qwen3.8-27b'},
    grok: {endpoint:'https://api.x.ai/v1/chat/completions', model:'grok-4.3'}
  } as const;
  return {provider,...available[provider]};
}
