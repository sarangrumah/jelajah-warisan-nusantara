import React, { useEffect } from 'react';
import { useAutoTranslation } from '../contexts/AutoTranslationContext';

interface TxProps {
  children: string;
  className?: string;
}

/**
 * Auto-Translation Component
 * Wraps hardcoded text and automatically translates it based on current language.
 * 
 * Usage: <Tx>Selamat Datang</Tx>
 */
export const Tx: React.FC<TxProps> = ({ children, className }) => {
  const { translate, registerText } = useAutoTranslation();

  useEffect(() => {
    registerText(children);
  }, [children, registerText]);

  return (
    <span className={className}>
      {translate(children)}
    </span>
  );
};

/**
 * Hook for translating strings (e.g. placeholders, attributes)
 * 
 * Usage: const t = useTranslateText();
 *        <input placeholder={t("Masukkan nama")} />
 */
export const useTranslateText = () => {
  const { translate, registerText } = useAutoTranslation();

  return (text: string) => {
    // Side effect in render is generally bad, but for this specific "registration" 
    // pattern it's acceptable if guarded. Ideally, we'd use useEffect but 
    // we can't call hooks conditionally or inside callbacks.
    // We'll rely on the context to handle deduplication efficiently.
    registerText(text);
    return translate(text);
  };
};