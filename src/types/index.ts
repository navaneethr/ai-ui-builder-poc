import { ComponentConfig } from "@/prompts/component-mapping";

export interface CachedComponent extends ComponentConfig {
  id: string;
  prompt: string;
  timestamp: number;
}
