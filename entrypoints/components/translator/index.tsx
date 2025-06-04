import { useState, useEffect } from "react";
import {
  BookOpenCheck,
  Copy,
  Rocket,
  Save,
} from "lucide-react";
import {
  translateText,
  TranslationResult,
} from "../../services/translationService";
import {
  saveTranslation,
  getTranslationHistory,
} from "../../services/storageService";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { getSourceLanguages, getTargetLanguages } from "@/lib/constants";

import Selector from "../selector";

export function Translator() {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState("auto");
  const [targetLanguage, setTargetLanguage] = useState("en");
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<TranslationResult[]>([]);

  // Get language options
  const sourceLanguages = getSourceLanguages();
  const targetLanguages = getTargetLanguages();

  // Load translation history on component mount
  useEffect(() => {
    const loadHistory = async () => {
      const translationHistory = await getTranslationHistory();
      setHistory(translationHistory);
    };

    loadHistory();
  }, []);

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      setError("Please enter text to translate");
      return;
    }

    setError("");
    setIsTranslating(true);

    try {
      const result = await translateText(
        inputText,
        targetLanguage,
        sourceLanguage
      );
      setTranslatedText(result.translatedText);

      // Save translation to history
      await saveTranslation(result);

      // Update history state
      setHistory([result, ...history]);
    } catch (error) {
      setError("Translation failed. Please try again.");
      console.error(error);
    } finally {
      setIsTranslating(false);
    }
  };

  const swapLanguages = () => {
    if (sourceLanguage !== "auto") {
      const temp = sourceLanguage;
      setSourceLanguage(targetLanguage);
      setTargetLanguage(temp);
    }
  };

  return (
    <div className="p-4 flex flex-col gap-3">
      <div className="flex justify-between gap-2">
        <div className="w-1/2">
          <Selector
            onValueChange={(value) => setSourceLanguage(value)}
            value={sourceLanguage}
            options={sourceLanguages.map((lang) => ({
              value: lang.code,
              label: lang.name,
            }))}
            placeholder="Detect Language"
            className="w-full text-sm"
          />
        </div>

        <button
          onClick={swapLanguages}
          disabled={sourceLanguage === "auto"}
          className="text-xl text-muted-foreground hover:text-foreground cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ⇄
        </button>

        <div className="w-1/2">
          <Selector
            onValueChange={(value) => setTargetLanguage(value)}
            value={targetLanguage}
            options={targetLanguages.map((lang) => ({
              value: lang.code,
              label: lang.name,
            }))}
            placeholder="Target Language"
            className="w-full text-sm"
          />
        </div>
      </div>

      <div>
        <Textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter text to translate"
          className="w-full min-h-30"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleTranslate();
            }
          }}
        />
      </div>

      <div className="flex justify-between items-center gap-6">
        <span className="text-muted-foreground text-xs">{`${inputText.length} / 1000`}</span>

        <div className="flex items-center gap-1">
          <span className="text-muted-foreground text-xs">
            {`Press <Enter> to submit, <Shift+Enter> for a new line.`}
          </span>
          <Button
            size="sm"
            onClick={handleTranslate}
            disabled={isTranslating || !inputText.trim()}
          >
            <Rocket className="size-4" />
            {isTranslating ? "Translating..." : "Translate"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="text-destructive text-sm p-2 bg-destructive/10 rounded-md">
          {error}
        </div>
      )}

      <div className="flex gap-4 items-center">
        <div className="h-[1px] bg-border w-full my-4"></div>
        <div className="text-muted-foreground flex items-center justify-center gap-1 shrink-0">
          <span className="text-xs">Translated</span>
          <BookOpenCheck className="size-3 text-green-400" />
        </div>
        <div className="h-[1px] bg-border w-full my-4"></div>
      </div>

      <div className="flex flex-col gap-1">
        <section className="text-sm p-2 bg-muted rounded-md min-h-[60px]">
          {translatedText || "Translation will appear here..."}
        </section>
        <div className="flex justify-end items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="hover:bg-transparent cursor-pointer"
            onClick={() => {
              if (translatedText) {
                navigator.clipboard.writeText(translatedText);
              }
            }}
            disabled={!translatedText}
          >
            <Copy className="size-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="hover:bg-transparent cursor-pointer"
            onClick={() => {
              if (translatedText) {
                saveTranslation({
                  originalText: inputText,
                  translatedText,
                  sourceLanguage,
                  targetLanguage,
                  timestamp: Date.now(),
                });
              }
            }}
            disabled={!translatedText}
          >
            <Save className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
