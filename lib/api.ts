import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, createRateLimitResponse } from './rateLimit'

export interface ApiError {
  message: string
  code?: string
  details?: unknown
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: ApiError
}

/**
 * Wrapper for API route handlers with built-in error handling and rate limiting
 */
export function createApiHandler<T>(
  handler: (request: NextRequest) => Promise<ApiResponse<T>>,
  options: {
    rateLimit?: boolean
    rateLimitConfig?: { interval?: number; maxRequests?: number }
    requireAuth?: boolean
  } = {}
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      // Rate limiting
      if (options.rateLimit !== false) {
        const limit = rateLimit(request, options.rateLimitConfig)
        if (!limit.success) {
          return createRateLimitResponse(limit.reset)
        }
      }

      // Execute handler
      const response = await handler(request)

      if (response.success) {
        return NextResponse.json(response)
      } else {
        return NextResponse.json(response, {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        })
      }
    } catch (error) {
      console.error('[API Error]', error)
      
      const apiError: ApiError = {
        message: error instanceof Error ? error.message : 'Internal server error',
        code: 'INTERNAL_ERROR',
      }

      return NextResponse.json(
        {
          success: false,
          error: apiError,
        },
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }
  }
}

/**
 * Validate required environment variables
 */
export function validateEnvVars(required: string[]): void {
  const missing = required.filter((key) => !process.env[key])
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    )
  }
}

/**
 * Parse JSON body with error handling
 */
export async function parseJsonBody<T>(request: NextRequest): Promise<T | null> {
  try {
    return await request.json()
  } catch {
    return null
  }
}
