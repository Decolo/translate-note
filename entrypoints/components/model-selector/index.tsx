import Selector from "../selector";
import {
  DEAFULT_AVAILABLE_MODELS,
  ModelOption,
  Enum_LLM_Provider,
} from "./consts";

const ModelSelector = () => {
  const [provider, setProvider] = useState<Enum_LLM_Provider>(
    Enum_LLM_Provider.GLM
  );
  const [model, setModel] = useState<string>(
    DEAFULT_AVAILABLE_MODELS[provider]["models"][0]
  );

  const providers = Object.keys(DEAFULT_AVAILABLE_MODELS);

  return (
    <div className="flex gap-2">
      <Selector
        value={provider}
        onChange={(value) => {
          setProvider(value as Enum_LLM_Provider);
          setModel(
            DEAFULT_AVAILABLE_MODELS[value as Enum_LLM_Provider]["models"][0]
          );
        }}
        options={providers.map((option) => {
          return {
            label: option,
            value: option,
          };
        })}
      />

      <Selector
        value={model}
        onChange={(value) => {
          setModel(value);
        }}
        options={DEAFULT_AVAILABLE_MODELS[provider]["models"]?.map((option) => {
          return {
            label: option,
            value: option,
          };
        })}
      />
    </div>
  );
};

export default ModelSelector;
