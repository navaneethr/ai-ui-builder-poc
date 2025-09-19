"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  generateComponentFromPrompt,
  validateComponentConfig,
} from "@/utils/component-generator";
import StatCard from "./StatCard";
import BasicTable from "./BasicTable";
import BarChartComponent from "./BarChart";
import { ComponentConfig } from "@/prompts/component-mapping";
import { CachedComponent } from "@/types";

const STORAGE_KEY = "generated-components";

export default function ComponentGenerator() {
  const [userPrompt, setUserPrompt] = useState("");
  const [generatedComponents, setGeneratedComponents] = useState<
    CachedComponent[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load components from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setGeneratedComponents(parsed);
      } catch (error) {
        console.error("Failed to parse saved components:", error);
      }
    }
  }, []);

  // Save components to localStorage whenever the array changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(generatedComponents));
  }, [generatedComponents]);

  const handleGenerate = async () => {
    if (!userPrompt.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const config = await generateComponentFromPrompt(
        userPrompt,
        generatedComponents
      );

      if (validateComponentConfig(config)) {
        const newComponent: CachedComponent = {
          ...config,
          id: Date.now().toString(),
          prompt: userPrompt,
          timestamp: Date.now(),
        };

        setGeneratedComponents((prev) => {
          return [...prev, newComponent];
        });
        setUserPrompt(""); // Clear the input after successful generation
      } else {
        setError("Invalid component configuration received");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate component"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    setGeneratedComponents((prev) => prev.filter((comp) => comp.id !== id));
  };

  const handleClearAll = () => {
    setGeneratedComponents([]);
  };

  const renderComponent = (componentConfig: ComponentConfig) => {
    const { component, props } = componentConfig;

    switch (component) {
      case "StatCard":
        return (
          <StatCard
            title={props.title || ""}
            value={props.value || ""}
            className={props.className}
          />
        );
      case "BasicTable":
        return (
          <BasicTable
            data={props.data || []}
            columns={props.columns || []}
            className={props.className}
          />
        );
      case "BarChart":
        return (
          <BarChartComponent
            data={props.data || []}
            config={props.config || {}}
            title={props.title}
            description={props.description}
            className={props.className}
          />
        );
      default:
        return <div>Unknown component type</div>;
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <Card className="gap-2">
        <CardHeader className="pb-0 mb-0">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500 font-medium">
              {generatedComponents.length} components generated
            </span>
            {generatedComponents.length > 0 && (
              <Button variant="outline" size="sm" onClick={handleClearAll}>
                Clear All
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="relative">
            <Textarea
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="Describe what you want to display, please be very specific and instructive (e.g., 'Show XYZ Company revenue of $24M')"
              className="flex-1 min-h-[80px] max-h-[200px] resize-none pr-12"
              rows={4}
              disabled={isLoading}
              onKeyPress={(e) => {
                if (
                  e.key === "Enter" &&
                  !e.shiftKey &&
                  !isLoading &&
                  userPrompt.trim()
                ) {
                  e.preventDefault();
                  handleGenerate();
                }
              }}
            />
            <Button
              size="sm"
              className="absolute bottom-2 right-2 h-8 w-8 p-0"
              onClick={handleGenerate}
              disabled={isLoading || !userPrompt.trim()}
            >
              {isLoading ? "..." : "→"}
            </Button>
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}
        </CardContent>
      </Card>
      {generatedComponents.length > 0 && (
        <div className="space-y-4 flex flex-wrap gap-4">
          {generatedComponents.map((component, index) => (
            <div key={index}>{renderComponent(component)}</div>
          ))}
        </div>
      )}
    </div>
  );
}
