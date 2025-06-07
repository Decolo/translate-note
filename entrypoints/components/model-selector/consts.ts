export interface ModelOption {
  id: string;
  provider: string;
  models: string[];
  url: string;
  isFree: boolean;
}

export enum Enum_LLM_Provider {
  GLM = "GLM",
  GPT = "GPT",
  Claude = "Claude",
  Gemini = "Gemini",
  DeepSeek = "DeepSeek",
}
export const DEAFULT_AVAILABLE_MODELS: Record<Enum_LLM_Provider, ModelOption> =
  {
    [Enum_LLM_Provider.GLM]: {
      id: "glm-4-9b-chat",
      provider: "GLM",
      models: ["glm-4-9b-chat"],
      url: "https://api.siliconflow.cn/v1",
      isFree: true,
    },
    [Enum_LLM_Provider.DeepSeek]: {
      id: "deepseek",
      provider: "DeepSeek",
      models: ["deepseek-v3"],
      url: "https://api.deepseek.com",
      isFree: false,
    },
    [Enum_LLM_Provider.GPT]: {
      id: "gpt",
      provider: "GPT",
      models: ["gpt-4.1", "gpt-4o"],
      url: "https://api.openai.com/v1",
      isFree: false,
    },
    [Enum_LLM_Provider.Claude]: {
      id: "claude",
      provider: "Claude",
      models: ["claude-sonnet-4-20250514", "claude-3-5-sonnet-20241022"],
      url: "https://api.anthropic.com/v1/",
      isFree: false,
    },
    [Enum_LLM_Provider.Gemini]: {
      id: "gemini",
      provider: "Gemini",
      models: ["gemini-2.5-pro-preview-05-06", "gemini-2.0-flash"],
      url: "https://generativelanguage.googleapis.com/v1beta/openai/",
      isFree: false,
    },
  };
