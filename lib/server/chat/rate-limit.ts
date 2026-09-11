import { parseRateLimitEnvironment } from "@/lib/server/config/env";
import { requestLimits } from "@/lib/server/config/limits";

type RateLimitResult =
  | { allowed: true; backend: "memory" | "redis" }
  | { allowed: false; backend: "memory" | "redis"; retryAfterSeconds: number; reason: string };

type MemoryCounter = {
  count: number;
  resetAt: number;
};

const memoryCounters = new Map<string, MemoryCounter>();

function now() {
  return Date.now();
}

function memoryIncrement(key: string, windowMs: number) {
  const currentTime = now();
  const existing = memoryCounters.get(key);

  if (!existing || existing.resetAt <= currentTime) {
    const counter = { count: 1, resetAt: currentTime + windowMs };
    memoryCounters.set(key, counter);
    return counter;
  }

  existing.count += 1;
  return existing;
}

function retryAfterSeconds(resetAt: number) {
  return Math.max(1, Math.ceil((resetAt - now()) / 1000));
}

async function redisIncrement(
  url: string,
  token: string,
  key: string,
  windowSeconds: number,
) {
  const response = await fetch(`${url}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      ["INCR", key],
      ["EXPIRE", key, windowSeconds, "NX"],
    ]),
  });

  if (!response.ok) {
    throw new Error("Redis rate-limit request failed.");
  }

  const payload = (await response.json()) as [{ result?: number }];
  return Number(payload[0]?.result ?? 1);
}

function rateLimitIdentifier(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();
  const connectingIp = request.headers.get("cf-connecting-ip")?.trim();

  return forwardedFor || realIp || connectingIp || "unknown";
}

export async function enforceChatRateLimit(request: Request): Promise<RateLimitResult> {
  const identifier = rateLimitIdentifier(request);
  const minuteWindowSeconds = 60;
  const dayWindowSeconds = 24 * 60 * 60;

  let redisConfig: ReturnType<typeof parseRateLimitEnvironment>;
  try {
    redisConfig = parseRateLimitEnvironment();
  } catch {
    redisConfig = {};
  }

  if (redisConfig.UPSTASH_REDIS_REST_URL && redisConfig.UPSTASH_REDIS_REST_TOKEN) {
    const minuteKey = `akshaygpt:chat:${identifier}:minute`;
    const dayKey = `akshaygpt:chat:${identifier}:day`;
    const [minuteCount, dayCount] = await Promise.all([
      redisIncrement(
        redisConfig.UPSTASH_REDIS_REST_URL,
        redisConfig.UPSTASH_REDIS_REST_TOKEN,
        minuteKey,
        minuteWindowSeconds,
      ),
      redisIncrement(
        redisConfig.UPSTASH_REDIS_REST_URL,
        redisConfig.UPSTASH_REDIS_REST_TOKEN,
        dayKey,
        dayWindowSeconds,
      ),
    ]);

    if (minuteCount > requestLimits.chat.maxRequestsPerMinute) {
      return {
        allowed: false,
        backend: "redis",
        retryAfterSeconds: minuteWindowSeconds,
        reason: "Too many chat requests. Please try again in a minute.",
      };
    }

    if (dayCount > requestLimits.chat.maxRequestsPerDay) {
      return {
        allowed: false,
        backend: "redis",
        retryAfterSeconds: dayWindowSeconds,
        reason: "Daily AkshayGPT request limit reached. Please try again tomorrow.",
      };
    }

    return { allowed: true, backend: "redis" };
  }

  const minuteCounter = memoryIncrement(`minute:${identifier}`, minuteWindowSeconds * 1000);
  const dayCounter = memoryIncrement(`day:${identifier}`, dayWindowSeconds * 1000);

  if (minuteCounter.count > requestLimits.chat.maxRequestsPerMinute) {
    return {
      allowed: false,
      backend: "memory",
      retryAfterSeconds: retryAfterSeconds(minuteCounter.resetAt),
      reason: "Too many chat requests. Please try again in a minute.",
    };
  }

  if (dayCounter.count > requestLimits.chat.maxRequestsPerDay) {
    return {
      allowed: false,
      backend: "memory",
      retryAfterSeconds: retryAfterSeconds(dayCounter.resetAt),
      reason: "Daily AkshayGPT request limit reached. Please try again tomorrow.",
    };
  }

  return { allowed: true, backend: "memory" };
}

