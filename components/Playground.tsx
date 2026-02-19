import { Sandpack } from "@codesandbox/sandpack-react";
import { useEffect, useState } from "react";

interface PlaygroundProps {
  template?: "react" | "react-ts" | "vanilla" | "vanilla-ts" | "static" | "vite" | "vite-react" | "vite-react-ts";
  files?: Record<string, string | { code: string; active?: boolean; hidden?: boolean }>;
  options?: any;
  // Старый формат (для обратной совместимости)
  html?: string;
  css?: string;
  js?: string;
}

export const Playground = ({ 
  template = "vite-react", 
  files = {}, 
  options = {},
  html,
  css,
  js
}: PlaygroundProps) => {
  // Если используется старый формат (html/css/js), конвертируем в новый
  const convertedFiles = (html || css || js) ? {
    '/index.html': html || '<!DOCTYPE html><html><body><div id="root"></div></body></html>',
    ...(css ? { '/styles.css': css } : {}),
    ...(js ? { '/index.js': js } : {}),
  } : files;
  
  const finalTemplate = (html || css || js) ? 'static' : template;
  const finalFiles = Object.keys(convertedFiles).length > 0 ? convertedFiles : files;
  const [isSecure, setIsSecure] = useState(true);

  useEffect(() => {
    // Sandpack требует Secure Context (HTTPS или localhost) для работы с Service Workers и Web Crypto API
    if (typeof window !== 'undefined' && window.isSecureContext === false) {
      setIsSecure(false);
    }
  }, []);

  if (!isSecure) {
    return (
      <div className="my-6 border border-red-500/50 rounded-lg overflow-hidden bg-red-900/20 p-6 text-red-200">
        <h3 className="text-lg font-bold mb-2 flex items-center">
          <span className="mr-2">🔒</span> Требуется HTTPS
        </h3>
        <p className="mb-2">
          Интерактивная песочница не может работать через незащищенное соединение (HTTP), так как браузеры блокируют необходимые API (Web Crypto).
        </p>
        <p className="text-sm opacity-80">
          Пожалуйста, откройте этот сайт через <code>https://</code> или запустите локально на <code>localhost</code>.
        </p>
      </div>
    );
  }

  return (
    <div className="sandpack-container my-6 border border-white/10 rounded-lg overflow-hidden">
      <Sandpack
        template={finalTemplate}
        theme="dark"
        files={finalFiles}
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
