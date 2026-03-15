"use client"

import React from "react";

export function useHtmlTheme() {
    const [theme, setTheme] = React.useState<'light' | 'dark'>('light');

    React.useEffect(() => {
        const root = document.documentElement;

        const getTheme = () =>
            root.classList.contains("dark") ? "dark" : "light";

        setTheme(getTheme());

        const observer = new MutationObserver(() => {
            setTheme(getTheme());
        });

        observer.observe(root, { attributeFilter: ["class"] });

        return () => observer.disconnect();
    }, []);

    return theme;
}
