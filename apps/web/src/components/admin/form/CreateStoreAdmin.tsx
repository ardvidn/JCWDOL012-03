'use client';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Card } from '@/components/ui/card';

interface CreateStoreAdminFormProps {
  sessionCookie: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const formSchema = z.object({
  name: z.string().min(4, { message: 'Minimal harus terdiri dari 4 karakter' }),
  username: z.string(),
  email: z.string().email(),
  password: z
    .string()
    .min(6, { message: 'Password minimal terdiri dari 6 karakter' }),
  phone: z.string(),
  storeId: z.number().min(1, { message: 'Store ID harus diisi' }),
});

export default function CreateStoreAdminForm({
  sessionCookie,
  onSuccess,
  onCancel,
}: CreateStoreAdminFormProps) {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
  });

  const handleCancelClick = () => {
    onCancel();
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userToken = sessionCookie;
      await axios.post(
        'http://localhost:8000/api/admin/create-store-admin',
        JSON.stringify(values),
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`,
          },
        },
      );
      onSuccess();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form {...form}>
      <Card className="p-4">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>Nama</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Nama" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>Username</FormLabel>

                <FormControl>
                  <Input type="text" placeholder="Username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>Email</FormLabel>

                <FormControl>
                  <Input type="email" placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>Password</FormLabel>

                <FormControl>
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>

                <FormControl>
                  <Input type="text" placeholder="Phone" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="storeId"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>Store ID</FormLabel>

                <FormControl>
                  <Input type="text" placeholder="Store ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2 mt-4">
            <Button variant="outline" type="submit" className="my-1">
              Buat Store Admin
            </Button>
            <Button variant="outline" onClick={handleCancelClick}>
              Batal
            </Button>
          </div>
        </form>
      </Card>
    </Form>
  );
}
