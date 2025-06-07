import { useState, useEffect } from "react";
import { Translator } from "../translator";
import { Settings } from "../settings";
import { isApiKeyConfigured } from "../../services/translationService";
import { Button } from "@/components/ui/button";
import { Languages, Settings as SettingsIcon, AlertCircle } from "lucide-react";

export function Main() {
  const [activeTab, setActiveTab] = useState<"translator" | "settings">(
    "translator"
  );
  const [hasApiKey, setHasApiKey] = useState(false);
  // const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   const checkApiKey = async () => {
  //     try {
  //       const configured = await isApiKeyConfigured();
  //       setHasApiKey(configured);

  //       // If no API key is configured, show settings first
  //       if (!configured) {
  //         setActiveTab("settings");
  //       }
  //     } catch (error) {
  //       console.error("Error checking API key:", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   checkApiKey();
  // }, []);

  // // Listen for API key changes
  // useEffect(() => {
  //   const handleStorageChange = async () => {
  //     const configured = await isApiKeyConfigured();
  //     setHasApiKey(configured);

  //     // If API key was just configured, switch to translator
  //     if (configured && activeTab === "settings") {
  //       setActiveTab("translator");
  //     }
  //   };

  //   // Listen for storage changes
  //   const interval = setInterval(handleStorageChange, 1000);
  //   return () => clearInterval(interval);
  // }, [activeTab]);

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header with navigation */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        {/* API Key Warning */}
        {/* {!hasApiKey && (
          <div className="px-4 pb-4">
            <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
              <AlertCircle className="size-4 text-amber-600" />
              <p className="text-sm text-amber-700 dark:text-amber-400">
                Please configure your OpenRouter API key in Settings to use the translator.
              </p>
            </div>
          </div>
        )} */}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === "translator" ? <Translator /> : <Settings />}
      </div>

      <div className="flex items-center gap-1 p-4">
        <Button
          variant={activeTab === "translator" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("translator")}
          // disabled={!hasApiKey}
          className="cursor-pointer"
        >
          <Languages className="size-4" />
        </Button>
        <Button
          variant={activeTab === "settings" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("settings")}
          className="cursor-pointer"
        >
          <SettingsIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
}
