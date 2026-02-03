'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Language, Translations, getTranslations } from './translations';

interface I18nContextValue {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: Translations;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }): React.JSX.Element {
    const [language, setLanguage] = useState<Language>('pt');
    const [t, setT] = useState<Translations>(translations.pt);

    useEffect(() => {
        const savedLang = localStorage.getItem('ikigai-language') as Language | null;
        if (savedLang && (savedLang === 'pt' || savedLang === 'en')) {
            setLanguage(savedLang);
            setT(getTranslations(savedLang));
        } else {
            const browserLang = navigator.language.startsWith('en') ? 'en' : 'pt';
            setLanguage(browserLang);
            setT(getTranslations(browserLang));
        }
    }, []);

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        setT(getTranslations(lang));
        localStorage.setItem('ikigai-language', lang);
    };

    const value: I18nContextValue = { language, setLanguage: handleSetLanguage, t };

    return React.createElement(
        I18nContext.Provider,
        { value },
        children
    );
}

export function useI18n(): I18nContextValue {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error('useI18n must be used within an I18nProvider');
    }
    return context;
}

export { translations, getTranslations };
export type { Language, Translations };
