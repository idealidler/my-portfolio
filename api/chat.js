// File: /api/chat.js

import { GoogleGenerativeAI } from "@google/generative-ai";

// IMPORTANT: Make sure you have installed the Google AI SDK
// Run: npm install @google/generative-ai

export const config = {
  runtime: 'edge', // Use the Vercel Edge Runtime for best streaming performance
};

export default async function handler(req) {

  console.log('API Key found by server:', process.env.GEMINI_API_KEY);
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const { messages, docContent } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API key not configured' }), { status: 500 });
    }

    if (!messages || !docContent) {
      return new Response(JSON.stringify({ error: 'Missing messages or document content' }), { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Construct the full prompt for Gemini
    const userQuery = messages[messages.length - 1].content;
    //const fullPrompt = `You are an AI assistant that answers questions strictly based on the following document. Do not use external knowledge. Document: ${docContent}\n\nQuestion: ${userQuery}`;
    // For concise, professional answers
    const fullPrompt = `
    You are a professional AI assistant providing information about Akshay.
    Your role is to answer questions strictly based on the provided document. Do not use external knowledge.

    **Your response style must follow these rules:**
    1.  **Be Concise:** Keep your answers as brief and to-the-point as possible.
    2.  **Use Bullet Points:** Whenever the answer involves a list or multiple steps, you MUST use bullet points for clarity.
    3.  **Professional Tone:** Maintain a formal and professional tone throughout your response.

    **Document:**
    ${docContent}

    ---

    **Question:**
    ${userQuery}
    `;
    const result = await model.generateContentStream(fullPrompt);

    // Create a new stream to send back to the client
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        for await (const chunk of result.stream) {
          const text = chunk.text();
          // We are wrapping the text in the Ollama-like JSON structure
          // so you don't have to change your frontend streaming logic too much.
          const formattedChunk = JSON.stringify({
            message: {
              content: text,
            },
          });
          controller.enqueue(encoder.encode(formattedChunk + '\n'));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Error in chat API:", error);
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: error.message }), { status: 500 });
  }
}