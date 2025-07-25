import { useCallback, useState } from "react";
import { useSensitiveSession } from "./sensitiveSession";
import { apiService } from "../services/api";

export const withSenstive = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => (props) => {
    const onWarn = useCallback(() => {
        console.log(`Warn before expiry`);
    }, []);

    const onExpiry = useCallback(() => {
        console.log(`Session expired`)
    }, []);


    const { isValid, startSession: activeSession } = useSensitiveSession(onWarn, onExpiry);


    const unlock = useCallback(async () => {
        const {code} = await apiService.getVerificationCode();
        console.log(`Code is ${code}`);
        const enteredCode = window.prompt("Enter code");
        if (enteredCode === code) {
            await apiService.verifyCode(code);
            activeSession();
        }
    }, [activeSession]);

    if (!isValid) {
        return <div className="lock" onClick={unlock}>Locked</div>
    }

    return <Component {...props} />
};