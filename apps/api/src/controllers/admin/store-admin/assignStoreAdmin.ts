import prisma from '@/prisma';
import { Request, Response } from 'express';
import { jwtDecode } from 'jwt-decode';

export interface jwtPayload {
  id: number;
  role: string;
}

export const assignStoreAdmin = async (req: Request, res: Response) => {
  try {
    const getCookies = req.cookies['user-token'];
    const cookiesToDecode = jwtDecode<jwtPayload>(getCookies);
    if (!cookiesToDecode || cookiesToDecode.role !== 'superadmin') {
      return res.status(401).json({
        code: 401,
        message: "you're not authorized",
      });
    }
    
    const { userId, storeId } = req.body;
    console.log(userId, storeId);

    if (userId === undefined || userId === null || storeId === undefined || storeId === null) {
      return res.status(400).json({
        code: 400,
        message: 'userId and storeId are required',
      });
    }

    const existingStoreAdmin = await prisma.storeAdmin.findUnique({
      where: {
        userId: Number(userId), // Menggunakan userId dari req.body
      },
    });

    if (!existingStoreAdmin) {
      return res.status(404).json({
        code: 404,
        message: 'Store admin not found',
      });
    }

    const existingStore = await prisma.store.findUnique({
      where: {
        id: Number(storeId),
      },
    });

    if (!existingStore) {
      return res.status(404).json({
        code: 404,
        message: 'Store not found',
      });
    }

    const updatedStoreAdmin = await prisma.storeAdmin.update({
      where: {
        userId: Number(userId), // Menggunakan userId dari req.body
      },
      data: {
        storeId: Number(storeId),
      },
    });

    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Store admin assigned successfully',
      data: updatedStoreAdmin,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: 'Internal server error',
    });
  }
};