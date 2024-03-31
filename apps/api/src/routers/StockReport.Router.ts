import {
  GetStockDetail,
  GetStockSummary,
} from '@/controllers/StockReport/stockRpoertController';
import { Router } from 'express';

const stockReportRouter = Router();

stockReportRouter.get('/allProuctPerMonth/:storeId', GetStockSummary);
stockReportRouter.get('/productDetailPerMonth/:storeId', GetStockDetail);

export default stockReportRouter;
