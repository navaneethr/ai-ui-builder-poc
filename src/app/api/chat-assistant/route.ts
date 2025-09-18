import { OpenAI } from "openai";
import { NextRequest, NextResponse } from "next/server";
import { createChatAssistantPrompt } from "@/prompts/chat-assistant";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { message, componentData } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const prompt = createChatAssistantPrompt(message, componentData || []);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: prompt,
        },
      ],
      max_tokens: 500,
      temperature: 0.3, // Lower temperature for more focused, factual responses
    });

    const assistantMessage = completion.choices[0]?.message?.content;

    if (!assistantMessage) {
      return NextResponse.json(
        { error: "No response from OpenAI" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: assistantMessage,
    });
  } catch (error) {
    console.error("Chat assistant API error:", error);
    return NextResponse.json(
      { error: "Failed to get response from assistant" },
      { status: 500 }
    );
  }
}
