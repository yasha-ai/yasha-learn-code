import { Sandpack } from "@codesandbox/sandpack-react";
import { useEffect, useState } from "react";

interface PlaygroundProps {
  template?: "react" | "react-ts" | "vanilla" | "vanilla-ts" | "static" | "vite" | "vite-react" | "vite-react-ts";
  files?: Record<string, string | { code: string; active?: boolean; hidden?: boolean }>;
  options?: any;
  dependencies?: Record<string, string>;
  html?: string;
  css?: string;
  js?: string;
}

export const Playground = ({
  template = "vite-react",
  files = {},
  options = {},
  dependencies = {},
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
  // 3. TypeScript files → use vite-react (Babel, NOT vite-react-ts which uses NodeBox/SharedArrayBuffer)
  //    vite-react-ts requires Cross-Origin Isolation headers (COOP/COEP) for SharedArrayBuffer.
  //    Without those headers NodeBox fails and shows "Open on CodeSandbox" fallback.
  //    vite-react with Babel handles .tsx/.ts files fine without NodeBox.
  // 4. Otherwise → use specified template
  let autoTemplate = template;
  if (html || css || js) {
    autoTemplate = 'static';
  } else if (hasOnlyHtml || (hasInlineScript && !fileKeys.some(f => f.endsWith('.js') || f.endsWith('.ts')))) {
    autoTemplate = 'static';
  } else if (hasTsFiles && (template === 'react' || template === 'vite-react')) {
    // Use vite-react (Babel) instead of vite-react-ts (NodeBox) to avoid SharedArrayBuffer requirement
    autoTemplate = 'vite-react';
  } else if (!hasTsFiles && template === 'react') {
    autoTemplate = 'vite-react';
  }

  const finalTemplate = autoTemplate;
  const finalFiles = fileKeys.length > 0 ? convertedFiles : files;

  // Auto-detect active file: prefer /App.tsx > /App.jsx > /App.js > first file
  // This prevents Sandpack from defaulting to its own App.jsx when we provide App.tsx
  const activeFile = (() => {
    const keys = Object.keys(finalFiles);
    if (keys.length === 0) return undefined;
    // Check if any file is explicitly marked as active
    const explicitActive = keys.find(k => {
      const v = finalFiles[k];
      return typeof v === 'object' && v !== null && (v as any).active === true;
    });
    if (explicitActive) return explicitActive;
    // Auto-pick: prefer tsx > jsx > js > first
    const preferred = ['/App.tsx', '/App.jsx', '/App.js', '/index.tsx', '/index.jsx', '/index.js', '/index.html'];
    for (const p of preferred) {
      if (keys.includes(p)) return p;
    }
    return keys[0];
  })();
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
        customSetup={Object.keys(dependencies).length > 0 ? { dependencies } : undefined}
        options={{
          showNavigator: true,
          showLineNumbers: true,
          showInlineErrors: true,
          wrapContent: false,
          editorHeight: 450,
          activeFile: activeFile,
          ...options,
        }}
      />
    </div>
  );
};
