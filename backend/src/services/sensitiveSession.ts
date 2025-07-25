import NodeCache from 'node-cache';

const SessionExpiryInSecond = 15 * 60;
const LockExpiryInSecond = 15 * 60;
const MaxAttempts = 3;



export interface SensitiveSession {
    userId: number;
    expiry: number;
    attempts: number;
    code: string;
    locked: false;
}

const myCache = new NodeCache( { stdTTL: 100, checkperiod: 120 } );

export function get(userId: number): SensitiveSession | undefined {
    return myCache.get(userId);
}

export function set(userId: number, sessionData: Partial<SensitiveSession>): SensitiveSession | undefined {
    const session = myCache.get(userId) || {};
    const newSession = { ...session, ...sessionData } as SensitiveSession;
    myCache.set(userId, newSession);
    return newSession;
}

export function create(userId: number, code?: string) {
    myCache.del(userId);
    const session =  {
        userId,
        expiry: Date.now() + SessionExpiryInSecond * 1000,
        attempts: 0,
        code: code ?? Math.floor(100000 + Math.random() * 900000).toString(),
        locked: false
    };
    myCache.set(userId, session);
    return session;
}

export function attempt(userId: number, code: string) {
    const session = get(userId) || { attempts: 0, locked: false, code: "" };
    if (session.locked) {
        return false;
    }
    if (session.code !== code) {
        const attempts = session.attempts + 1;
        if (attempts >= MaxAttempts) {
            lock(userId);
        } else {
            set(userId, { attempts: session.attempts + 1 });
        }
        return false;
    }
    
    return true;
}

export function lock(userId: number) {
    const session = get(userId) || {};
    myCache.set(userId, {
        userId,
        expiry: Date.now() + LockExpiryInSecond * 1000,
        attempts: 0,
        code: '',
        locked: true
    });
}

export function isSessionValid(userId: number) {
    const session = get(userId);
    if (!session) {
        return false;
    }
    if (session.locked) {
        return false;
    }
    if (session.expiry < Date.now()) {
        return false;
    }
    return true;
}