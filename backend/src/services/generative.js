import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HF_TOKEN);
const MODEL = 'meta-llama/Llama-3.3-70B-Instruct';

export async function generateMessage(prompt) {
  if (!process.env.HF_TOKEN) throw new Error('HF_TOKEN is missing in environment variables');
  
  const response = await hf.chatCompletion({
    model: MODEL,
    messages: [
      { role: 'system', content: 'You are a helpful AI assistant for a flatmate finder platform. Help users craft friendly, professional, and engaging messages.' },
      { role: 'user', content: prompt }
    ],
    max_tokens: 200,
  });

  return response.choices[0]?.message?.content?.trim() || "Sorry, I couldn't generate a response.";
}
