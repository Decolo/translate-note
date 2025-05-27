import { TranslationResult } from "./translationService";

const HISTORY_KEY = "translation_history";

export async function saveTranslation(translation: TranslationResult): Promise<void> {
  try {
    // Get existing history
    const history = await getTranslationHistory();
    
    // Add new translation to history
    const updatedHistory = [translation, ...history];
    
    // Save updated history using WXT storage
    await browser.storage.local.set({ [HISTORY_KEY]: updatedHistory });
  } catch (error) {
    console.error("Error saving translation:", error);
    throw new Error("Failed to save translation");
  }
}

export async function getTranslationHistory(): Promise<TranslationResult[]> {
  try {
    const result = await browser.storage.local.get(HISTORY_KEY);
    return result[HISTORY_KEY] || [];
  } catch (error) {
    console.error("Error getting translation history:", error);
    return [];
  }
}

export async function clearTranslationHistory(): Promise<void> {
  try {
    await browser.storage.local.set({ [HISTORY_KEY]: [] });
  } catch (error) {
    console.error("Error clearing translation history:", error);
    throw new Error("Failed to clear translation history");
  }
}

export async function deleteTranslation(timestamp: number): Promise<void> {
  try {
    const history = await getTranslationHistory();
    const updatedHistory = history.filter(item => item.timestamp !== timestamp);
    await browser.storage.local.set({ [HISTORY_KEY]: updatedHistory });
  } catch (error) {
    console.error("Error deleting translation:", error);
    throw new Error("Failed to delete translation");
  }
}
