'use client';

import {useState} from 'react';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Button} from '@/components/ui/button';
import {trackDpdPackage} from '@/services/dpd';
import {trackPostaSlovenijePackage} from '@/services/posta-slovenije';
import {Card, CardHeader, CardTitle, CardDescription, CardContent} from '@/components/ui/card';

export default function TrackPage() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingStatus, setTrackingStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = async () => {
    setLoading(true);
    setTrackingStatus(null);
    setError(null);

    try {
      let status = '';
      // Attempt to track with DPD first
      try {
        status = await trackDpdPackage(trackingNumber);
      } catch (dpdError: any) {
        // If DPD tracking fails, attempt with Pošta Slovenije
        try {
          status = await trackPostaSlovenijePackage(trackingNumber);
        } catch (postaError: any) {
          // If both fail, set an error message
          setError('Tracking number not found with either DPD or Pošta Slovenije.');
        }
      }

      if (status) {
        setTrackingStatus(status);
      }
    } catch (error: any) {
      setError('Failed to track package. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Track Your Shipment</CardTitle>
          <CardDescription>Enter your tracking number to view the current status.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="trackingNumber">Tracking Number</Label>
            <Input
              id="trackingNumber"
              type="text"
              placeholder="Enter tracking number"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
            />
          </div>
          <Button onClick={handleTrack} disabled={loading}>
            {loading ? 'Tracking...' : 'Track Shipment'}
          </Button>

          {error && <p className="text-red-500">{error}</p>}

          {trackingStatus && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold">Tracking Status:</h3>
              <p>{trackingStatus}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
