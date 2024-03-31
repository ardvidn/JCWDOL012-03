import prisma from '@/prisma';
import { Request, Response } from 'express';

const GetStockSummary = async (req: Request, res: Response) => {
  try {
    const { storeId } = req.params;
    const { dateStart, dateEnd } = req.body;

    // dateStart Format
    const dateStartFormat: string = dateStart;
    const [yearStart, monthStart, dayStart]: number[] = dateStartFormat
      .split('-')
      .map(Number);

    const newStartDate = new Date(yearStart, monthStart - 1, dayStart);

    const formattedDateStart = newStartDate.toISOString();

    // dateEnd Format
    const dateEndFormat: string = dateEnd;
    const [yearEnd, monthEnd, dayEnd]: number[] = dateEndFormat
      .split('-')
      .map(Number);

    const newEndDate = new Date(yearEnd, monthEnd - 1, dayEnd);
    newEndDate.setHours(23, 59, 59, 999);

    const formattedDateEnd = newEndDate.toISOString();

    const stockSummary = await prisma.stockJournal.groupBy({
      by: ['productId'],
      where: {
        product: {
          storeId: parseInt(storeId),
        },
        createdAt: {
          gte: new Date(formattedDateStart),
          lt: new Date(formattedDateEnd),
        },
      },
      _sum: {
        quantityBefore: true,
        quantityAfter: true,
      },
      _count: true,
    });

    return res.status(200).json({
      code: 200,
      message: 'Stock summary retrieved successfully.',
      data: stockSummary,
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      code: 500,
      message: 'Internal server error.',
    });
  }
};

const GetStockDetail = async (req: Request, res: Response) => {
  try {
    const { storeId } = req.params;
    const { dateStart, dateEnd, productId } = req.body;
    // dateStart Format
    const dateStartFormat: string = dateStart;
    const [yearStart, monthStart, dayStart]: number[] = dateStartFormat
      .split('-')
      .map(Number);

    const newStartDate = new Date(yearStart, monthStart - 1, dayStart);

    const formattedDateStart = newStartDate.toISOString();

    // dateEnd Format
    const dateEndFormat: string = dateEnd;
    const [yearEnd, monthEnd, dayEnd]: number[] = dateEndFormat
      .split('-')
      .map(Number);

    const newEndDate = new Date(yearEnd, monthEnd - 1, dayEnd);
    newEndDate.setHours(23, 59, 59, 999);

    const formattedDateEnd = newEndDate.toISOString();

    const stockDetail = await prisma.stockJournal.findMany({
      where: {
        productId: parseInt(productId),
        product: {
          storeId: parseInt(storeId),
        },
        createdAt: {
          gte: new Date(formattedDateStart),
          lt: new Date(formattedDateEnd),
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return res.status(200).json({
      code: 200,
      message: 'Stock detail retrieved successfully.',
      data: stockDetail,
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      code: 500,
      message: 'Internal server error.',
    });
  }
};

export { GetStockSummary, GetStockDetail };
