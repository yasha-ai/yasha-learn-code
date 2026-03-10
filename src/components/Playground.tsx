import { Sandpack } from "@codesandbox/sandpack-react";
import { useEffect, useState } from "react";

interface PlaygroundProps {
  template?: "react" | "react-ts" | "vanilla" | "vanilla-ts" | "static" | "vite" | "vite-react" | "vite-react-ts";
  files?: Record<string, string | { code: string; active?: boolean; hidden?: boolean }>;
  options?: any;
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
  const convertedFiles = (html || css || js) ? {
    '/index.html': (() => {
      const baseHtml = html || '<!DOCTYPE html><html><body><div id="root"></div></body></html>';
      if (css && !baseHtml.includes('styles.css')) {
        if (baseHtml.includes('<head>')) {
          return baseHtml.replace('<head>', '<head>\n  <link rel="stylesheet" href="styles.css">');
        }
        if (baseHtml.includes('<!DOCTYPE html>')) {
          return baseHtml.replace('<!DOCTYPE html>', '<!DOCTYPE html>\n<head>\n  <link rel="stylesheet" href="styles.css">\n</head>');
        }
        if (baseHtml.includes('<html>')) {
          return baseHtml.replace('<html>', '<html>\n<head>\n  <link rel="stylesheet" href="styles.css">\n</head>');
        }
      }
      return baseHtml;
    })(),
    ...(css ? { '/styles.css': css } : {}),
    ...(js ? { '/index.js': js } : {}),
  } : files;

  const fileKeys = Object.keys(convertedFiles);
  const hasTsFiles = fileKeys.some(f => f.endsWith('.tsx') || f.endsWith('.ts'));
  const hasOnlyHtml = fileKeys.length === 1 && fileKeys[0] === '/index.html';
  const htmlContent = typeof convertedFiles['/index.html'] === 'string' ? convertedFiles['/index.html'] : '';
  const hasInlineScript = htmlContent.includes('<script');

  // Auto-detect best template:
  // 1. Old format (html/css/js) → static
  // 2. Only index.html with inline scripts → static (vanilla would add conflicting default index.js)
  // 3. TypeScript files → upgrade to TS template
  // 4. Otherwise → use specified template
  let autoTemplate = template;
  if (html || css || js) {
    autoTemplate = 'static';
  } else if (hasOnlyHtml || (hasInlineScript && !fileKeys.some(f => f.endsWith('.js') || f.endsWith('.ts')))) {
    autoTemplate = 'static';
  } else if (hasTsFiles && template === 'react') {
    autoTemplate = 'react-ts';
  } else if (hasTsFiles && template === 'vite-react') {
    autoTemplate = 'vite-react-ts';
  }

  const finalTemplate = autoTemplate;
  const finalFiles = fileKeys.length > 0 ? convertedFiles : files;
  const [isSecure, setIsSecure] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined' && window.isSecureContext === false) {
      setIsSecure(false);
    }
  }, []);

  if (!mounted) {
    return <div style={{ height: 452, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, margin: '1.5rem 0' }} />;
  }

  if (!isSecure) {
    return (
      <div style={{ margin: '1.5rem 0', padding: '1.5rem', border: '1px solid rgba(239,68,68,0.5)', borderRadius: 8, background: 'rgba(127,29,29,0.2)', color: '#fca5a5' }}>
        <h3>🔒 Требуется HTTPS</h3>
        <p>Интерактивная песочница не может работать через незащищенное соединение (HTTP).</p>
      </div>
    );
  }

  return (
    <div style={{ margin: '1.5rem 0', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, overflow: 'hidden' }}>
      <Sandpack
        template={finalTemplate}
        theme="dark"
        files={finalFiles}
        options={{
          showNavigator: true,
          showLineNumbers: true,
          showInlineErrors: true,
          wrapContent: false,
          editorHeight: 450,
          ...options,
        }}
      />
    </div>
  );
};
