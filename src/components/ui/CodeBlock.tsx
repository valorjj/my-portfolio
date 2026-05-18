import { useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Highlight, themes } from 'prism-react-renderer';
import styles from './CodeBlock.module.css';

export type CodeBlockProps = {
  code: string;
  language: string;
  caption?: string;
};

export function CodeBlock({ code, language, caption }: CodeBlockProps) {
  const [copied, setCopied] = useState<boolean>(false);
  const timerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    },
    [],
  );

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code.trim());
      setCopied(true);
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard API may be unavailable (insecure context, denied permission); silently no-op
    }
  }

  return (
    <div className={styles.block}>
      <div className={styles.head}>
        <span className={styles.lang}>{language}</span>
        {caption ? <span className={styles.caption}>{caption}</span> : null}
        <button
          type="button"
          className={`${styles.copy} ${copied ? styles.copyDone : ''}`}
          onClick={handleCopy}
          aria-label={copied ? 'Copied' : 'Copy code'}
        >
          {copied ? (
            <Check size={12} aria-hidden="true" />
          ) : (
            <Copy size={12} aria-hidden="true" />
          )}
          <span className={styles.copyLabel}>{copied ? 'copied' : 'copy'}</span>
        </button>
      </div>
      <Highlight code={code.trim()} language={language} theme={themes.vsDark}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={`${styles.pre} ${className}`}
            style={{ ...style, background: 'transparent' }}
          >
            <code>
              {tokens.map((line, i) => {
                const lineProps = getLineProps({ line });
                return (
                  <div key={i} {...lineProps} className={styles.line}>
                    <span className={styles.lineNo}>{String(i + 1).padStart(2, ' ')}</span>
                    <span className={styles.lineContent}>
                      {line.map((token, j) => (
                        <span key={j} {...getTokenProps({ token })} />
                      ))}
                    </span>
                  </div>
                );
              })}
            </code>
          </pre>
        )}
      </Highlight>
    </div>
  );
}
