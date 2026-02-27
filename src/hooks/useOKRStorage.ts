import type { OKRData } from '../types/okr';
import { sampleData } from '../data/sampleData';

const STORAGE_KEY = 'treekr-data';

export function saveData(data: OKRData): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
        console.warn('Failed to save OKR data to localStorage:', e);
    }
}

export function loadData(): OKRData {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            return JSON.parse(raw) as OKRData;
        }
    } catch (e) {
        console.warn('Failed to load OKR data from localStorage:', e);
    }
    return sampleData;
}

export function clearData(): void {
    localStorage.removeItem(STORAGE_KEY);
}
