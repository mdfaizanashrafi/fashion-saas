import { Request, Response, NextFunction } from 'express'
import { trendsService } from '../services/trends.service'
import { TrendFilters } from '../types/trends.types'
import { ApiError } from '../utils/ApiError'

class TrendsController {
  async getTrends(req: Request, res: Response, next: NextFunction) {
    try {
      const allowedAgeGroups = new Set(['18-25', '26-35', '36-50', '50+'])
      const allowedSeasons = new Set(['spring', 'summer', 'fall', 'winter'])
      const ageGroupRaw = (req.query.ageGroup as string | undefined) || null
      const seasonRaw = (req.query.season as string | undefined) || null
      const timeRangeRaw = (req.query.timeRange as string | undefined) || '30days'

      const filters: TrendFilters = {
        ageGroup: ageGroupRaw && allowedAgeGroups.has(ageGroupRaw) ? (ageGroupRaw as TrendFilters['ageGroup']) : null,
        season: seasonRaw && allowedSeasons.has(seasonRaw) ? (seasonRaw as TrendFilters['season']) : null,
        category: ((req.query.category as string | undefined) || null),
        timeRange: (['30days', '90days', '1year'].includes(timeRangeRaw) ? timeRangeRaw : '30days') as TrendFilters['timeRange'],
      }

      const trendData = await trendsService.getTrendData(filters)
      
      res.json(trendData)
    } catch (error) {
      next(error)
    }
  }

  async getTrendDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const { trendId } = req.params
      
      const trendDetails = await trendsService.getTrendDetails(trendId)
      
      if (!trendDetails) {
        throw new ApiError('Trend not found', 404)
      }

      res.json(trendDetails)
    } catch (error) {
      next(error)
    }
  }

  async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await trendsService.getCategories()
      res.json(categories)
    } catch (error) {
      next(error)
    }
  }
}

export const trendsController = new TrendsController()

