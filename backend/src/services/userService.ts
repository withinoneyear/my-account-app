import { User, SafeUser, getUserById, updateUser, UserUpdateData } from "../database";

export type SensitiveData = Pick<User, 'email' | 'phone_number' | 'bank_name' | 'bsb' | 'account_name' | 'account_number'>;

export type BasicUser = Omit<SafeUser, typeof SensitiveFields[number]>;

export const SensitiveFields = ['email', 'phone_number', 'bank_name', 'bsb', 'account_name', 'account_number'] as const;


export function getSensitiveData(user: SafeUser): SensitiveData {
  return SensitiveFields.reduce((acc, field) => {
    acc[field] = user[field]!;
    return acc;
  }, {} as SensitiveData);    
}

export function stripSensitiveData(user: Partial<SafeUser>): Partial<BasicUser> {
    return SensitiveFields.reduce((acc, field) => {
    delete acc[field];
    return acc;
  }, user);
}


export async function getUserBasic(userId: number): Promise<Partial<BasicUser> | null> {
      const user = await getUserById(userId);
      return user ? stripSensitiveData(user) : null;
}

export async function updateUserBasic(userId: number, basicUser: BasicUser) {
    const user = await updateUser(userId!, basicUser as UserUpdateData);
    return user ? stripSensitiveData(user) : null;
}

export async function getUserSensitive(userId: number): Promise<SensitiveData | null> {
    const user = await getUserById(userId);
    return user ? getSensitiveData(user) : null;
}

export async function updateUserSensitive(userId: number, sensitiveData: SensitiveData) {
    const user = await updateUser(userId!, sensitiveData as UserUpdateData);
    return user ? getSensitiveData(user) : null;
}