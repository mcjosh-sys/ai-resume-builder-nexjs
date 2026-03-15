import { Prettify } from ".";

export type BaseProps<T extends Record<string, any> = {}> = Prettify<{
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    disabled?: boolean;
} & T>