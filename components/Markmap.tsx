'use client';

import { useEffect, useRef } from 'react';
import { Transformer } from 'markmap-lib';
import { Markmap, loadCSS, loadJS } from 'markmap-view';

interface MarkmapProps {
  content: string;
}

export default function MarkmapComponent({ content }: MarkmapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const markmapRef = useRef<Markmap | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const transformer = new Transformer();
    const { root, features } = transformer.transform(content);

    // Load required assets
    const { styles, scripts } = transformer.getUsedAssets(features);
    if (styles) loadCSS(styles);
    if (scripts) loadJS(scripts);

    // Create or update markmap
    if (!markmapRef.current) {
      markmapRef.current = Markmap.create(svgRef.current, {
        colorFreezeLevel: 2,
        duration: 500,
        initialExpandLevel: -1,  // Expand all levels
        fitRatio: 0.95,          // Use 95% of available space
      });
    }

    markmapRef.current.setData(root);
    markmapRef.current.fit();
  }, [content]);

  return (
    <div className="w-full h-[85vh] min-h-[700px] bg-[#0a0e1a] rounded-lg border border-emerald-800/30 overflow-hidden">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
}
