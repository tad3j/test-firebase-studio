
import {suggestShippingProvider} from '@/ai/flows/suggest-shipping-provider';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {useState} from 'react';

export default function SuggestShippingPage() {
  const [destination, setDestination] = useState('');
  const [shippingSuggestion, setShippingSuggestion] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSuggestShipping = async () => {
    setLoading(true);
    try {
      const suggestion = await suggestShippingProvider({destination});
      setShippingSuggestion(suggestion);
    } catch (error) {
      console.error('Failed to get shipping suggestion', error);
      setShippingSuggestion({
        provider: 'Unknown',
        cost: 0,
        estimatedDeliveryTime: 0,
        reason: 'Failed to fetch suggestion',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Suggest Shipping Provider</CardTitle>
          <CardDescription>Enter the destination to get a shipping suggestion.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="destination">Destination</Label>
            <Input
              id="destination"
              type="text"
              placeholder="Enter destination address"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>
          <Button onClick={handleSuggestShipping} disabled={loading}>
            {loading ? 'Suggesting...' : 'Suggest Shipping Provider'}
          </Button>

          {shippingSuggestion && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold">Shipping Suggestion:</h3>
              <p>
                <strong>Provider:</strong> {shippingSuggestion.provider}
              </p>
              <p>
                <strong>Cost:</strong> ${shippingSuggestion.cost}
              </p>
              <p>
                <strong>Estimated Delivery Time:</strong> {shippingSuggestion.estimatedDeliveryTime} days
              </p>
              <p>
                <strong>Reason:</strong> {shippingSuggestion.reason}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
