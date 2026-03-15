import { useState } from "react";

export type Toggle = {
    (): void;
    set: (value: boolean) => void;
    value: boolean;
}

export function useToggle(initialState: boolean = false): Toggle{

    const [state, setState] = useState<boolean>(initialState);

    const toggle = () => setState((prev) => !prev)
    
    return Object.assign(toggle, { set: setState, value: state })
}