export const CHAT_ASSISTANT_PROMPT = `You are a data assistant that ONLY answers questions based on the provided component data. You must:

1. ONLY use information from the component data provided below
2. NEVER provide information from external sources or general knowledge
3. If the answer is not in the data, say "I don't have that information in the available data"
4. Be precise and factual based only on the data
5. Reference specific data points when answering

## Available Component Data
{componentData}

## Instructions
- Answer questions ONLY using the data above
- If asked about something not in the data, politely decline
- Be helpful but stay within the data boundaries
- Provide specific numbers, names, and values from the data when available

User Question: {userMessage}

Answer based ONLY on the component data provided above:`;

export function createChatAssistantPrompt(
  userMessage: string,
  componentData: any[] = []
): string {
  const dataText =
    componentData.length > 0
      ? componentData
          .map(
            (comp, index) =>
              `Component ${index + 1} (${comp.component}):\n` +
              `Prompt: "${comp.prompt}"\n` +
              `Data: ${JSON.stringify(comp.props, null, 2)}\n`
          )
          .join("\n")
      : "No component data available.";

  return CHAT_ASSISTANT_PROMPT.replace(/\{componentData\}/g, dataText).replace(
    /\{userMessage\}/g,
    userMessage
  );
}
