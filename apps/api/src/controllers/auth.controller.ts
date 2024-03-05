import prisma from '@/prisma';
import dayjs from 'dayjs';
import { Request, Response } from 'express';
import { generateReferral } from '@/utils/referral';
import { compare, hash } from '@/utils/bcrypt';
import { generateToken } from '@/utils/jwt';
import { authorizationUrl } from '@/middleware/socialAuth.middleware';
import { oauth2 } from 'googleapis/build/src/apis/oauth2';
import { oAuth2Client } from '@/config';
import { google } from 'googleapis';
import ejs from 'ejs';
import path from 'path';
import sendMail from '../utils/sendMail';
import generateActivationLink from '@/utils/verificationLink';

export interface registrationPayload {
  email: string;
}

export interface inputPayload {
  name: string;
  username: string;
  email: string;
  password: string;
  refCode?: string | undefined;
}

export interface signinPayload {
  email: string;
  password: string;
}

// export interface socialAuthPayLoad {
//   name: string;
//   email: string;
//   avatar: string;
// }

export const signupUser = async (req: Request, res: Response) => {
  try {
    const { name, username, email, password, refCode }: inputPayload = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    // check username and email
    if (user?.username === username) {
      return res.status(400).send({
        code: 400,
        success: false,
        message: 'Username sudah terpakai, silakan ganti yang lain',
      });
    }

    if (user?.email === email) {
      return res.status(400).send({
        code: 400,
        success: false,
        message: 'Email sudah terpakai, silakan login ke akun anda',
      });
    }

    // generator referral code
    const referral = generateReferral(username);
    // expire date
    const expireDate = dayjs().add(90, 'days').toDate();
    // hash password
    const hashedPassword = hash(password);

    if (!refCode) {
      const createUser = await prisma.user.create({
        data: {
          name,
          username,
          email,
          password: hashedPassword,
          // referral,
        },
      });

      return res.status(200).json({
        code: 200,
        success: true,
        message: `Register berhasil`,
        data: {
          ...createUser,
          password: null,
        },
      });
    }

    // referral is entered by user
    if (refCode) {
      const userReferral = await prisma.user.findFirst({
        where: {
          // referral: refCode,
        },
        select: {
          id: true,
        },
      });

      if (!userReferral) {
        return res.status(400).json({
          code: 400,
          success: false,
          message: `Referral code ${refCode} tidak ditemukan`,
        });
      }

      const referralTransaction = await prisma.$transaction(async (prisma) => {
        const createUser = await prisma.user.create({
          data: {
            name,
            username,
            email,
            password: hashedPassword,
            // referral,
          },
        });

        // const createVoucher = await prisma.voucher.create({
        //   data: {
        //     userId: createUser?.id,
        //     // expireDate,
        //   },
        // });
        // return { createUser, createVoucher };
      });

      return res.status(200).json({
        code: 200,
        success: true,
        message: `Register User dengan menggunakan Referral code ${refCode} berhasil`,
        data: {
          // ...referralTransaction.createUser,
          // password: null,
          // voucher: referralTransaction.createVoucher,
        },
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 500,
      success: false,
      message: 'Internal server error',
    });
  }
};

export const socialAuth = (req: Request, res: Response) => {
  return res.redirect(authorizationUrl);
};

export const signinUser = async (req: Request, res: Response) => {
  try {
    const { email, password }: signinPayload = req.body;

    const userWithEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!userWithEmail) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: 'Email atau Password salah',
      });
    }

    const isValidPassword = compare(password, userWithEmail.password);

    if (!isValidPassword) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: 'Email atau Password salah',
      });
    }

    const jwtToken: string = generateToken({
      id: userWithEmail.id,
      username: userWithEmail.username,
      email: userWithEmail.email,
      role: userWithEmail.role,
    });

    res.cookie('user-token', jwtToken, {
      secure: false,
      httpOnly: true,
      expires: dayjs().add(7, 'days').toDate(),
    });

    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Berhasil Sign In',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 500,
      success: false,
      message: 'Error internal server',
    });
  }
};

export const socialAuthCallback = async (req: Request, res: Response) => {
  try {
    const { code } = req.query;

    const { tokens } = await oAuth2Client.getToken(code as string);

    const oauth2 = google.oauth2({
      auth: oAuth2Client,
      version: 'v2',
    });

    const { data } = await oauth2.userinfo.get();

    if (!data.email || !data.name || !data.picture) {
      return res.json({
        data: data,
      });
    }

    let user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          avatar: data.picture,
          username: data.name,
          password: 'defaultPassword',
        },
      });
    }

    const payload = {
      id: user?.id,
      name: user?.name,
      email: user?.email,
      avatar: user?.avatar,
    };

    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Register berhasil',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 500,
      success: false,
      message: 'Internal server error',
    });
  }
};

export const signoutUser = async (req: Request, res: Response) => {
  try {
    res.clearCookie('user-token');
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Sign Out berhasil',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 500,
      success: false,
      message: 'Error internal server',
    });
  }
};

export const getSessionUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const parsedId = parseInt(id);

    const user = await prisma.user.findUnique({
      where: {
        id: parsedId,
      },
      include: {
        // Nanti diisi
      },
    });

    if (!user) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'User tidak ditemukan',
      });
    }

    return res.status(200).json({
      code: 200,
      success: true,
      data: {
        ...user,
        password: null,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 500,
      success: false,
      message: 'Error internal server',
    });
  }
};