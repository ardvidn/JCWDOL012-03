import GetSalesReportMonthly from '@/controllers/salesReport/getSalesReportMonthly';
import GetSalesReportMonthlyByCategory from '@/controllers/salesReport/getSalesReportMonthlyByCategory';
import GetSalesReportMonthlyByProduct from '@/controllers/salesReport/getSalesReportMonthlyByProduct';
import { Router } from 'express';

const salesReportRouter = Router();

salesReportRouter.get('/monthlyReport/:storeId', GetSalesReportMonthly);
salesReportRouter.get(
  '/monthlyReportByCategory/:storeId',
  GetSalesReportMonthlyByCategory,
);
salesReportRouter.get(
  '/monthlyReportByProduct/:storeId',
  GetSalesReportMonthlyByProduct,
);

export default salesReportRouter;
