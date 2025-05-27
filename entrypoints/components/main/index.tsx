import { Translator } from "../translator";

export function Main({ name = "Extension" }) {
  return (
    <div className="w-[800px] h-[600px] overflow-y-auto">
      <Translator />
    </div>
  );
}
