import { createClient } from "redis";
import { PHASE_PRODUCTION_BUILD } from "next/constants.js";
import { CacheHandler } from "@fortedigital/nextjs-cache-handler";
import createLruHandler from "@fortedigital/nextjs-cache-handler/local-lru";
import createRedisHandler from "@fortedigital/nextjs-cache-handler/redis-strings";
import createCompositeHandler from "@fortedigital/nextjs-cache-handler/composite";

function log(...args) {
  console.log("[CacheHandler]", new Date().toISOString(), ...args);
}

// Log immediately when module is loaded to confirm cache handler is being used

CacheHandler.onCreation(() => {
  log("onCreation called", {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PHASE: process.env.NEXT_PHASE,
    REDIS_URL: process.env.REDIS_URL ? `${process.env.REDIS_URL.substring(0, 20)}...` : "not set",
    hasGlobalConfig: !!global.cacheHandlerConfig,
    hasGlobalPromise: !!global.cacheHandlerConfigPromise,
  });
  // Important - It's recommended to use global scope to ensure only one Redis connection is made
  // This ensures only one instance get created
  if (global.cacheHandlerConfig) {
    log("Returning existing global.cacheHandlerConfig");
    return global.cacheHandlerConfig;
  }

  // Important - It's recommended to use global scope to ensure only one Redis connection is made
  // This ensures new instances are not created in a race condition
  if (global.cacheHandlerConfigPromise) {
    log("Returning existing global.cacheHandlerConfigPromise");
    return global.cacheHandlerConfigPromise;
  }

  // You may need to ignore Redis locally, remove this block otherwise
  if (process.env.NODE_ENV === "development") {
    log("Development mode - using LRU cache only");
    const lruCache = createLruHandler();
    return { handlers: [lruCache] };
  }

  // Main promise initializing the handler
  log("Initializing new cache handler configuration...");
  global.cacheHandlerConfigPromise = (async () => {
    let redisClient = null;

    if (PHASE_PRODUCTION_BUILD !== process.env.NEXT_PHASE) {
      log("Not in production build phase, attempting Redis connection");
      const settings = {
        url: process.env.REDIS_URL,
        pingInterval: 10000,
      };

      // This is optional and needed only if you use access keys
      if (process.env.REDIS_ACCESS_KEY) {
        settings.password = process.env.REDIS_ACCESS_KEY;
        log("Using Redis access key");
      }

      try {
        log("Creating Redis client with URL:", process.env.REDIS_URL ? `${process.env.REDIS_URL.substring(0, 30)}...` : "not set");
        redisClient = createClient(settings);
        redisClient.on("error", (e) => {
          log("Redis error event:", e.message);
          if (typeof process.env.NEXT_PRIVATE_DEBUG_CACHE !== "undefined") {
            console.warn("Redis error", e);
          }
          global.cacheHandlerConfig = null;
          global.cacheHandlerConfigPromise = null;
        });
        redisClient.on("connect", () => {
          log("Redis 'connect' event fired");
        });
        redisClient.on("ready", () => {
          log("Redis 'ready' event fired - connection is ready for commands");
        });
        redisClient.on("reconnecting", () => {
          log("Redis 'reconnecting' event fired");
        });
      } catch (error) {
        log("Failed to create Redis client:", error.message);
        console.warn("Failed to create Redis client:", error);
      }
    } else {
      log("Skipping Redis - in production build phase");
    }

    if (redisClient) {
      try {
        log("Calling redisClient.connect()...");
        console.info("Connecting Redis client...");
        await redisClient.connect();
        log("Redis client connected successfully, isReady:", redisClient.isReady);
        console.info("Redis client connected.");
      } catch (error) {
        log("Failed to connect Redis client:", error.message);
        console.warn("Failed to connect Redis client:", error);
        await redisClient
          .disconnect()
          .catch(() => {
            log("Failed to quit Redis client after connection failure");
            console.warn(
              "Failed to quit the Redis client after failing to connect."
            );
          });
      }
    } else {
      log("No Redis client created");
    }

    const lruCache = createLruHandler();
    log("LRU cache handler created");

    if (!redisClient?.isReady) {
      log("Redis not ready, falling back to LRU only. isReady:", redisClient?.isReady);
      console.error("Failed to initialize caching layer.");
      global.cacheHandlerConfigPromise = null;
      global.cacheHandlerConfig = { handlers: [lruCache] };
      return global.cacheHandlerConfig;
    }

    log("Creating Redis cache handler with keyPrefix: nextjs:");
    const redisCacheHandler = createRedisHandler({
      client: redisClient,
      keyPrefix: "nextjs:",
    });

    global.cacheHandlerConfigPromise = null;

    // This example uses composite handler to switch from Redis to LRU cache if tags contains `memory-cache` tag.
    // You can skip composite and use Redis or LRU only.
    log("Creating composite handler (LRU + Redis)");
    global.cacheHandlerConfig = {
      handlers: [
        createCompositeHandler({
          handlers: [lruCache, redisCacheHandler],
          setStrategy: (ctx) => {
            const useMemory = ctx?.tags.includes("memory-cache");
            log("setStrategy called, tags:", ctx?.tags, "-> using:", useMemory ? "LRU (0)" : "Redis (1)");
            return useMemory ? 0 : 1;
          },
        }),
      ],
    };

    log("Cache handler configuration complete - using Redis + LRU composite");
    return global.cacheHandlerConfig;
  })();

  return global.cacheHandlerConfigPromise;
});

export default CacheHandler;