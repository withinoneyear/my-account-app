import React, { useContext } from "react";

const SensitiveContext = React.createContext({
    isValid: false,
    startSession: () => {},
});

export const SensitiveProvider = SensitiveContext.Provider;

export const useSensitive = () => useContext(SensitiveContext);