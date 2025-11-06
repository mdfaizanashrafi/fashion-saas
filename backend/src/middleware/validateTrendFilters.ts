import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { ApiError } from '../utils/ApiError'

const trendFiltersSchema = z.object({
  ageGroup: z.enum(['18-25', '26-35', '36-50', '50+']).nullable().optional(),
  season: z.enum(['spring', 'summer', 'fall', 'winter']).nullable().optional(),
  category: z.string().nullable().optional(),
  timeRange: z.enum(['30days', '90days', '1year']).optional(),
})

export function validateTrendFilters(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const validated = trendFiltersSchema.parse({
      ageGroup: req.query.ageGroup as string | undefined,
      season: req.query.season as string | undefined,
      category: req.query.category as string | undefined,
      timeRange: req.query.timeRange as string | undefined,
    })

    // Assign validated values back to query
    Object.assign(req.query, validated)
    next()
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ApiError(
        `Invalid filter parameters: ${error.errors.map(e => e.message).join(', ')}`,
        400,
        'INVALID_FILTERS'
      )
    }
    next(error)
  }
}

