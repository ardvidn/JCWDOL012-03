'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '../ui/input';

interface AssignStoreProps {
  sessionCookie?: string;
  adminId: number;
}

interface Store {
  id: number;
  name: string;
}

export function AssignStore({ sessionCookie, adminId }: AssignStoreProps) {
  const [selectedStore, setSelectedStore] = useState({ id: 0, name: '' });
  const [stores, setStores] = useState<Store[]>([]);

  const handleSelectStore = (store: Store) => {
    setSelectedStore(store);
  };

  useEffect(() => {
    console.log('Selected store:', selectedStore);
  }, [selectedStore, adminId]);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8000/api/admin/store-list',
          {
            headers: {
              Authorization: `Bearer ${sessionCookie}`,
            },
          },
        );
        setStores(response.data.data);
      } catch (error) {
        console.error('Error fetching stores:', error);
      }
    };
    fetchStores();
  }, [sessionCookie]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    if (/^\d*$/.test(inputValue)) {
      setSelectedStore({
        id: parseInt(inputValue) || 0,
        name: '',
      });
    }
  };

  const assignStore = async () => {
    if (!selectedStore) return;
    try {
      await axios.put(
        'http://localhost:8000/api/admin/assign-store-admin',
        {
          userId: adminId,
          storeId: selectedStore.id,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionCookie}`,
          },
        },
      );
      console.log('Store assigned successfully!');
    } catch (error) {
      console.error('Error assigning store:', error);
    }
  };

  return (
    <div className="flex gap-4">
      <Input
        type="text"
        value={selectedStore ? selectedStore.id : ''}
        placeholder="Masukkan ID Toko"
        onChange={handleInputChange}
      />
      <Button variant="outline" onClick={assignStore}>
        Assign
      </Button>
    </div>
  );
}
