import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';
import { Message } from '@/types/chat';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages are required and must be an array' },
        { status: 400 }
      );
    }

    const lastMessage = messages[messages.length - 1].content.toLowerCase();

    // Check for any identity-related questions
    if (lastMessage.includes('who are you') || 
        lastMessage.includes('what are you') || 
        lastMessage.includes('tell me about yourself') ||
        lastMessage.includes('introduce yourself') ||
        lastMessage.includes('what is your name') ||
        lastMessage.includes('what should i call you') ||
        lastMessage === 'who?' ||
        lastMessage === 'you') {
      return NextResponse.json({ 
        message: "I'm an AI created by OpenAI, designed to assist with a wide range of information and services." 
      });
    }

    console.log('API Key available:', !!process.env.OPENAI_API_KEY);
    console.log('Using model: gpt-4-turbo-preview');
    console.log('Messages:', messages);
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: messages.map((message: Message) => ({
        role: message.role,
        content: message.content,
      })),
    });

    console.log('API Response:', {
      model: completion.model,
      usage: completion.usage,
      finish_reason: completion.choices[0]?.finish_reason,
      content_length: completion.choices[0]?.message?.content?.length
    });

    const responseMessage = completion.choices[0]?.message?.content;

    if (!responseMessage) {
      throw new Error('No response from OpenAI');
    }

    return NextResponse.json({ message: responseMessage });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 