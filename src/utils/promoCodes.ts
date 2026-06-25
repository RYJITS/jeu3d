import { collection, addDoc, serverTimestamp, type FieldValue } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Generates a random alphanumeric string of a given length
 */
const generateRandomString = (length: number): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

/**
 * Generates a full promo code string based on the credits
 * Format: SKYIA-{CREDITS}-{XXXX}-{XXXX}-{XXXX}
 */
export const generatePromoCode = (credits: number): string => {
    const part1 = generateRandomString(4);
    const part2 = generateRandomString(4);
    const part3 = generateRandomString(4);
    return `SKYIA-${credits}-${part1}-${part2}-${part3}`;
};

export interface PromoCodeData {
    code: string;
    credits: number;
    playerName: string;
    score: number;
    level: number;
    createdAt: FieldValue;
    active: boolean;
    currentUses: number;
    maxUses: number;
}

/**
 * Saves the generated promo code to the 'promo_codes' collection in Firestore
 */
export const savePromoCodeToFirebase = async (
    code: string,
    credits: number,
    playerName: string,
    score: number,
    level: number
): Promise<boolean> => {
    // The configuration is now hardcoded so we no longer need to check for env variables.
    try {
        const promoCodesRef = collection(db, "promo_codes");
        await addDoc(promoCodesRef, {
            code,
            credits,
            playerName: playerName || 'Anonymous',
            score: Math.floor(score),
            level,
            createdAt: serverTimestamp(),
            active: true,
            currentUses: 0,
            maxUses: 1
        } as PromoCodeData);

        console.log("Promo code successfully saved to Firebase:", code);
        return true;
    } catch (error) {
        console.error("Error saving promo code to Firebase:", error);
        return false;
    }
};
