import { assignStoreAdmin } from '@/controllers/admin/store-admin/assignStoreAdmin';
import { createStoreAdmin } from '@/controllers/admin/store-admin/createStoreAdmin';
import { getStoreAdminList } from '@/controllers/admin/store-admin/getStoreAdminList';
import { createStore } from '@/controllers/admin/store/createStore';
import { getStoreById } from '@/controllers/admin/store/getStoreById';
import { getStoreList } from '@/controllers/admin/store/getStoreList';
import authenticationMiddleware from '@/middleware/auth.middleware';
import { Router } from 'express';
// import { getStoreAdminList } from '@/controllers/admin/store-admin/getStoreAdminList';

const adminRouter: Router = Router();

adminRouter.post('/create-store', authenticationMiddleware, createStore);
adminRouter.get('/store-list', getStoreList);
adminRouter.get('/store/:id', getStoreById);
adminRouter.post('/create-store-admin', createStoreAdmin);
adminRouter.put('/assign-store-admin', assignStoreAdmin);
adminRouter.get('/store-admin-list', getStoreAdminList);

export default adminRouter;
