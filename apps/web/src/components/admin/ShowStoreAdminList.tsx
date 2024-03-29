'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import CreateStoreAdmin from './form/CreateStoreAdmin';
import { AssignStore } from './AssignStore';

interface IStoreAdmin {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  StoreAdmin: {
    store: {
      name: string;
    };
  };
}

interface ShowStoreAdminListProps {
  sessionCookie?: string;
}

const ShowStoreAdminList: React.FC<ShowStoreAdminListProps> = ({
  sessionCookie,
}) => {
  const [storeAdmins, setStoreAdmins] = useState<IStoreAdmin[]>([]);
  const [showCreateStoreAdminForm, setShowCreateStoreAdminForm] =
    useState(false);
  const [showButton, setShowButton] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchStoreAdminList() {
      try {
        const response = await axios.get(
          'http://localhost:8000/api/admin/store-admin-list',
          {
            headers: {
              Authorization: `Bearer ${sessionCookie}`,
            },
          },
        );
        if (response.status === 200) {
          setStoreAdmins(response.data.data);
        } else {
          throw new Error('Failed to fetch store admin list');
        }
      } catch (error) {
        console.error('Error fetching store admin list:', error);
      }
    }

    fetchStoreAdminList();
  }, [sessionCookie]);

  const handleCreateStoreAdminClick = () => {
    setShowCreateStoreAdminForm(true);
    setShowButton(false);
  };

  const handleCancelCreateStoreAdmin = () => {
    setShowCreateStoreAdminForm(false);
    setShowButton(true);
  };

  const onSuccess = () => {
    router.refresh();
    router.push('/profile/admin/store-admin-list');
  };

  return (
    <>
      <Card className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>Nama</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Store</TableCell>
              <TableCell>Assign Store (Masukkan Store ID)</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(storeAdmins) &&
              storeAdmins.map((admin, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{admin.name}</TableCell>
                  <TableCell>{admin.username}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>{admin.phone}</TableCell>
                  <TableCell>{admin.StoreAdmin?.store?.name}</TableCell>
                  <TableCell>
                    <AssignStore sessionCookie={sessionCookie} adminId={admin.id}/>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Card>
      {showCreateStoreAdminForm && (
        <CreateStoreAdmin
          sessionCookie={sessionCookie || ''}
          onSuccess={onSuccess}
          onCancel={handleCancelCreateStoreAdmin}
        />
      )}
      <div>
        {showButton && (
          <Button variant="outline" onClick={handleCreateStoreAdminClick}>
            Buat Store Admin
          </Button>
        )}
      </div>
    </>
  );
};

export default ShowStoreAdminList;
