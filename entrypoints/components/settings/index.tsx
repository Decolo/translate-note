import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "../../../components/ui/input";
import { setApiKey, clearApiKey, isApiKeyConfigured } from "../../services/translationService";
import { Settings as SettingsIcon, Key, ExternalLink, Shield, AlertCircle } from "lucide-react";
import { Select } from "@/components/ui/select";
import ModelSelector from "../model-selector";

export function Settings() {
  const [apiKey, setApiKeyState] = useState("");
  const [isConfigured, setIsConfigured] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [error, setError] = useState("");


  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      setError("Please enter a valid API key");
      return;
    }

    // Basic validation for OpenRouter API key format
    if (!apiKey.startsWith('sk-or-v1-')) {
      setError("Please enter a valid OpenRouter API key (should start with 'sk-or-v1-')");
      return;
    }

    setError("");
    setIsSaving(true);
    try {
      await setApiKey(apiKey.trim());
      setIsConfigured(true);
      setApiKeyState("");
      setShowApiKey(false);
    } catch (error) {
      setError("Failed to save API key. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearApiKey = async () => {
    if (confirm("Are you sure you want to remove your API key? You won't be able to use translation features until you add a new one.")) {
      try {
        await clearApiKey();
        setIsConfigured(false);
        setError("");
      } catch (error) {
        setError("Failed to remove API key. Please try again.");
      }
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <SettingsIcon className="size-3" />
        <h2 className="text-xs font-semibold">Settings</h2>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-3">
          <ModelSelector />
          
          {isConfigured ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                <Shield className="size-4 text-green-600" />
                <p className="text-sm text-green-700 dark:text-green-400">
                  API key is configured and ready to use
                </p>
              </div>
              <Button 
                onClick={handleClearApiKey}
                variant="destructive"
                size="sm"
                className="w-full"
              >
                Remove API Key
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    type={showApiKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setApiKeyState(e.target.value);
                      setError("");
                    }}
                    placeholder="sk-or-v1-..."
                    className="w-full pr-20"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-8 px-2 text-xs"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? "Hide" : "Show"}
                  </Button>
                </div>
                
                {error && (
                  <div className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                    <AlertCircle className="size-4 text-red-600" />
                    <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                  </div>
                )}
                
                <Button 
                  onClick={handleSaveApiKey}
                  disabled={isSaving || !apiKey.trim()}
                  size="sm"
                  className="w-full"
                >
                  {isSaving ? "Saving..." : "Save API Key"}
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <Shield className="size-4" />
            Security & Privacy
          </h3>
          <div className="text-xs text-muted-foreground space-y-2">
            <p>• Your API key is stored locally in your browser and never shared</p>
            <p>• You maintain full control over your API usage and costs</p>
            <p>• Remove your API key anytime to stop all requests</p>
          </div>
        </div>
        
      </div>
    </div>
  );
} 