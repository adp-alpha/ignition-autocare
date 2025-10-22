// lib/cache.ts

interface CacheEntry<T> {
    data: T;
    timestamp: number;
    ttl: number; // Time to live in milliseconds
}

class BookingCache {
    private cache: Map<string, CacheEntry<any>>;

    constructor() {
        this.cache = new Map();
    }

    set<T>(key: string, data: T, ttlSeconds: number = 300): void {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            ttl: ttlSeconds * 1000,
        });
    }

    get<T>(key: string): T | null {
        const entry = this.cache.get(key);

        if (!entry) return null;

        // Check if cache has expired
        if (Date.now() - entry.timestamp > entry.ttl) {
            this.cache.delete(key);
            return null;
        }

        return entry.data as T;
    }

    delete(key: string): void {
        this.cache.delete(key);
    }

    clear(): void {
        this.cache.clear();
    }

    // Clear all keys matching a pattern
    clearPattern(pattern: string): void {
        for (const key of this.cache.keys()) {
            if (key.includes(pattern)) {
                this.cache.delete(key);
            }
        }
    }
}

// Singleton instance
export const bookingCache = new BookingCache();

// Cache key generators
export const CACHE_KEYS = {
    slotConfig: () => 'slot-configuration',
    unavailableSlot: (date: Date, startTime: string, endTime: string) =>
        `unavailable-slot:${date.toISOString()}:${startTime}:${endTime}`,
    closedDay: (date: Date) => `closed-day:${date.toISOString().split('T')[0]}`,
    slotCapacity: (date: Date, startTime: string, endTime: string) =>
        `capacity:${date.toISOString().split('T')[0]}:${startTime}:${endTime}`,
    availableSlots: (date: string) => `available-slots:${date}`,
};

// Cache TTL (time to live) in seconds
export const CACHE_TTL = {
    slotConfig: 3600, // 1 hour - rarely changes
    unavailableSlot: 300, // 5 minutes
    closedDay: 3600, // 1 hour
    slotCapacity: 60, // 1 minute - needs to be fresh
    availableSlots: 120, // 2 minutes
};
