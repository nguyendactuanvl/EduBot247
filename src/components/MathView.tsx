import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface MathViewProps {
  content: string;
  className?: string;
  inline?: boolean;
}

export function MathView({ content, className = '', inline = false }: MathViewProps) {
  if (inline) {
    return (
      <span className={`math-view inline-block align-middle ${className}`}>
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={{
            p: ({ children }) => <span className="inline">{children}</span>,
            strong: ({ children }) => <strong className="font-semibold text-slate-900 dark:text-slate-100">{children}</strong>
          }}
        >
          {content}
        </ReactMarkdown>
      </span>
    );
  }

  return (
    <div className={`math-view leading-relaxed ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
          ul: ({ children }) => <ul className="list-disc pl-5 mb-2 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-5 mb-2 space-y-1">{children}</ol>,
          li: ({ children }) => <li className="text-slate-700 dark:text-slate-300">{children}</li>,
          h4: ({ children }) => <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm mt-3 mb-1">{children}</h4>,
          strong: ({ children }) => <strong className="font-semibold text-slate-900 dark:text-slate-100">{children}</strong>
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

