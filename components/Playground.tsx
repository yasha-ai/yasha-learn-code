import { Sandpack } from "@codesandbox/sandpack-react";

interface PlaygroundProps {
  template?: "react" | "react-ts" | "vanilla" | "vanilla-ts" | "static" | "vite" | "vite-react" | "vite-react-ts";
  files?: Record<string, string | { code: string; active?: boolean; hidden?: boolean }>;
  options?: any;
}

export const Playground = ({ template = "vite-react", files = {}, options = {} }: PlaygroundProps) => {
  return (
    <div className="sandpack-container my-6 border border-white/10 rounded-lg overflow-hidden">
      <Sandpack
        template={template}
        theme="dark"
        files={files}
        options={{
          showNavigator: true,
          showLineNumbers: true,
          showInlineErrors: true,
          wrapContent: true,
          editorHeight: 400,
          ...options,
        }}
      />
    </div>
  );
};
