import {
  createComponentMappingPrompt,
  ComponentConfig,
} from "@/prompts/component-mapping";
import { CachedComponent } from "@/app/page";

export async function generateComponentFromPrompt(
  userPrompt: string,
  generatedComponents: CachedComponent[]
): Promise<ComponentConfig> {
  try {
    const prompt = createComponentMappingPrompt(
      userPrompt,
      generatedComponents
    );

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: prompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate component configuration");
    }

    const data = await response.json();

    // Clean the response message to remove any markdown formatting
    let cleanMessage = data.message.trim();

    // Remove markdown code blocks if present
    if (cleanMessage.startsWith("```json")) {
      cleanMessage = cleanMessage
        .replace(/^```json\s*/, "")
        .replace(/\s*```$/, "");
    } else if (cleanMessage.startsWith("```")) {
      cleanMessage = cleanMessage.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    const config = JSON.parse(cleanMessage);

    console.log("Generated config:", config);
    console.log("Config validation:", validateComponentConfig(config));

    return config;
  } catch (error) {
    console.error("Error generating component:", error);
    throw error;
  }
}

export function validateComponentConfig(
  config: any
): config is ComponentConfig {
  return (
    config &&
    typeof config === "object" &&
    (config.component === "StatCard" ||
      config.component === "BasicTable" ||
      config.component === "BarChart") &&
    config.props &&
    config.reasoning &&
    typeof config.reasoning === "string"
  );
}
