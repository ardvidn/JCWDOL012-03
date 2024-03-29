import prisma from '@/prisma';
import { Request, Response } from 'express';
import { jwtDecode } from 'jwt-decode';

export interface jwtPayload {
  id: number;
  role: string;
}

const GetSalesReport = async (req: Request, res: Response) => {
  try {
    const { storeId } = req.params;
    const { dateStart, dateEnd } = req.body;

    const getOrderData = await prisma.order.findMany({
      where: {
        storeId: parseInt(storeId),
      },
      include: {
        user: true,
        orderItems: true,
      },
    });

    // const getCookies = req.cookies['user-token'];
    // const cookiesToDecode = jwtDecode<jwtPayload>(getCookies);

    // if (!cookiesToDecode || cookiesToDecode.role !== 'superadmin') {
    //   return res.status(401).json({
    //     code: 401,
    //     message: "you're not authorized",
    //   });
    // }
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: 'internal server error',
    });
  }
};
