import { Router } from 'express';
import authRouter from '@/router/auth.router';
import registerRouter from './register.router';
<<<<<<< HEAD
import profileRouter from './profile.router';
import adminRouter from './admin.router';
// import userRouter from '@/router/user.router';
=======
// import userRouter from '@/router/user.router';
// import transactionRouter from '@/router/transaction.router';
// import analyticsRouter from '@/router/analytics.router';
>>>>>>> adb62195e206f27bd7b7bd45023f2bbd77c803f1

const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/register', registerRouter);
<<<<<<< HEAD
apiRouter.use('/profile', profileRouter);
apiRouter.use('/admin', adminRouter);
=======
>>>>>>> adb62195e206f27bd7b7bd45023f2bbd77c803f1
// apiRouter.use('/user', userRouter);
// apiRouter.use('/transaction', transactionRouter);
// apiRouter.use('/analytics', analyticsRouter);

export default apiRouter;
