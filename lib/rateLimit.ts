import { NextRequest, NextResponse } from 'next/server'

interface RateLimitConfig {
  interval: number // Time window in ms
  maxRequests: number // Max requests per interval
}

const defaultConfig: RateLimitConfig = {
  interval: 60 * 1000, // 1 minute
  maxRequests: 10,
}

// In-memory store (for production, use Redis or similar)
const requestStore = new Map<string, { count: number; resetTime: number }>()

function cleanup() {
  const now = Date.now()
  for (const [key, value] of requestStore.entries()) {
    if (value.resetTime < now) {
      requestStore.delete(key)
    }
  }
}

// Cleanup every 5 minutes
setInterval(cleanup, 5 * 60 * 1000)

export function rateLimit(
  request: NextRequest,
  config: Partial<RateLimitConfig> = {}
): { success: boolean; remaining: number; reset: number } {
  const { interval, maxRequests } = { ...defaultConfig, ...config }
  
  // Get client identifier (IP address or user ID)
  const identifier = 
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    'unknown'
  
  const now = Date.now()
  const record = requestStore.get(identifier)
  
  if (!record || record.resetTime < now) {
    // New window
    requestStore.set(identifier, {
      count: 1,
      resetTime: now + interval,
    })
    return {
      success: true,
      remaining: maxRequests - 1,
      reset: Math.ceil(interval / 1000),
    }
  }
  
  if (record.count >= maxRequests) {
    // Rate limited
    return {
      success: false,
      remaining: 0,
      reset: Math.ceil((record.resetTime - now) / 1000),
    }
  }
  
  // Increment counter
  record.count++
  requestStore.set(identifier, record)
  
  return {
    success: true,
    remaining: maxRequests - record.count,
    reset: Math.ceil((record.resetTime - now) / 1000),
  }
}

export function createRateLimitResponse(resetSeconds: number): NextResponse {
  return NextResponse.json(
    {
      error: 'Too Many Requests',
      message: 'Rate limit exceeded. Please try again later.',
      retryAfter: resetSeconds,
    },
    {
      status: 429,
      headers: {
        'Retry-After': resetSeconds.toString(),
        'X-RateLimit-Limit': '10',
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': (Date.now() + resetSeconds * 1000).toString(),
      },
    }
  )
}
