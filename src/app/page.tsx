
'use client';

import {SidebarProvider, Sidebar, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarGroup, SidebarGroupLabel} from '@/components/ui/sidebar';
import {Icons} from '@/components/icons';
import {Card, CardHeader, CardTitle, CardDescription, CardContent} from '@/components/ui/card';
import {Skeleton} from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';
import {getWmsOrders, getWmsInventory} from '@/services/wms';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [orders, setOrders] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersData = await getWmsOrders();
        const inventoryData = await getWmsInventory();
        setOrders(ordersData);
        setInventory(inventoryData);
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSuggestShipping = () => {
    router.push('/suggest-shipping');
  };

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <Icons.building2 className="mr-2 h-4 w-4" />
          <span>ShipSync</span>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#">
                    <Icons.home className="mr-2 h-4 w-4" />
                    <span>Home</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/track">
                    <Icons.package className="mr-2 h-4 w-4" />
                    <span>Track</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
          <Separator/>
          <SidebarGroup>
            <SidebarGroupLabel>Settings</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#">
                    <Icons.slidersHorizontal className="mr-2 h-4 w-4" />
                    <span>Preferences</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#">
                    <Icons.bell className="mr-2 h-4 w-4" />
                    <span>Notifications</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarContent>
        <div className="md:pl-64">
          <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
            <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Shipments</CardTitle>
                  <CardDescription>
                    {loading ? <Skeleton className="h-4 w-20"/> : `${orders.length} new shipments`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-8 w-full"/>
                  ) : (
                    <Alert>
                      <Icons.alertTriangle className="h-4 w-4"/>
                      <AlertTitle>Shipments Ready!</AlertTitle>
                      <AlertDescription>
                        You have {orders.length} shipments ready to be processed.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Total Inventory</CardTitle>
                  <CardDescription>Current stock levels</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-8 w-full"/>
                  ) : (
                    <div>
                      {inventory.map((item) => (
                        <div key={item.itemId} className="mb-2">
                          {item.itemId}: <Badge>{item.itemQuantity}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Shipping Provider</CardTitle>
                  <CardDescription>Optimize provider selection</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={handleSuggestShipping} className="w-full">
                    Suggest Shipping Provider
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarContent>
    </SidebarProvider>
  );
}
