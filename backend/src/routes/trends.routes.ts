import { Router } from 'express'
import { trendsController } from '../controllers/trends.controller'
import { validateTrendFilters } from '../middleware/validateTrendFilters'

const router = Router()

router.get('/', validateTrendFilters, trendsController.getTrends)

router.get('/:trendId', trendsController.getTrendDetails)

router.get('/categories/list', trendsController.getCategories)

export default router

