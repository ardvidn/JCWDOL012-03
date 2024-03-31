import prisma from '@/prisma';
import { Request, Response } from 'express';
import { jwtDecode } from 'jwt-decode';

export interface jwtPayload {
  id: number;
  role: string;
}

const GetSalesReportMonthlyByProduct = async (req: Request, res: Response) => {
  try {
    // const getCookies = req.cookies['user-token'];
    // const cookiesToDecode = jwtDecode<jwtPayload>(getCookies);

    // if (!cookiesToDecode || cookiesToDecode.role !== 'superadmin') {
    //   return res.status(401).json({
    //     code: 401,
    //     message: "you're not authorized",
    //   });
    // }

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

    const getOrderData = await prisma.order.findMany({
      where: {
        storeId: parseInt(storeId),
        createdAt: {
          gte: new Date(formattedDateStart),
          lte: new Date(formattedDateEnd),
        },
        orderItems: {
          some: {
            productId: parseInt(productId),
          },
        },
      },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                categories: true,
              },
            },
          },
        },
      },
    });

    if (getOrderData.length === 0) {
      return res.status(400).json({
        code: 400,
        message: 'no report within date range or product',
      });
    }

    return res.status(200).json({
      code: 200,
      message: 'report successfully retrieved',
      data: getOrderData,
      test1: formattedDateStart,
      test2: formattedDateEnd,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: 'internal server error',
    });
  }
};

export default GetSalesReportMonthlyByProduct;
