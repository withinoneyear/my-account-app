import { useCallback, useEffect, useState } from "react";
import config from "../config";

let sessionExpiry = 0;


function isInValidSession() {
    return sessionExpiry > 0 && sessionExpiry > Date.now();
}


export function useSensitiveSession(warnBeforeExpiry: () => void, onExpiryFunc?: () => void) {
    const [_, set] = useState({});

    const onWarn = useCallback(() => {
        warnBeforeExpiry();
    }, [warnBeforeExpiry]);

    const onExpiry = useCallback(() => {
        sessionExpiry = 0;
        document.dispatchEvent(new Event("session"));
        onExpiryFunc?.();
    }, [onExpiryFunc]);


    useEffect(() => {
        const updateSession = () => set({});
        document.addEventListener("session", updateSession);
        return () => document.removeEventListener("session", updateSession);
    }, [set]);


    return {
        isValid: isInValidSession(),
        startSession: () => {
            sessionExpiry = Date.now() + config.sessionExpiry;
            document.dispatchEvent(new Event("session"));
            setTimeout(onWarn, config.warnBeforeExpiry);
            setTimeout(onExpiry, config.sessionExpiry);
        },
    };
}