// @ts-nocheck
'use server';
/**
 * @fileOverview This file defines a Genkit flow for suggesting the optimal shipping provider (DPD or Pošta Slovenije)
 * based on cost, delivery time, and destination.
 *
 * - suggestShippingProvider - A function that takes destination as input and returns the suggested shipping provider.
 * - SuggestShippingProviderInput - The input type for the suggestShippingProvider function.
 * - SuggestShippingProviderOutput - The return type for the suggestShippingProvider function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import {getDpdShippingRates, getPostaSlovenijeShippingRates} from '@/services/dpd';

const SuggestShippingProviderInputSchema = z.object({
  destination: z.string().describe('The destination address for the shipment.'),
});
export type SuggestShippingProviderInput = z.infer<typeof SuggestShippingProviderInputSchema>;

const SuggestShippingProviderOutputSchema = z.object({
  provider: z.enum(['DPD', 'Pošta Slovenije']).describe('The suggested shipping provider.'),
  cost: z.number().describe('The estimated cost of shipping with the suggested provider.'),
  estimatedDeliveryTime: z.number().describe('The estimated delivery time in days with the suggested provider.'),
  reason: z.string().describe('The reason for suggesting this provider.'),
});
export type SuggestShippingProviderOutput = z.infer<typeof SuggestShippingProviderOutputSchema>;

export async function suggestShippingProvider(input: SuggestShippingProviderInput): Promise<SuggestShippingProviderOutput> {
  return suggestShippingProviderFlow(input);
}

const suggestShippingProviderPrompt = ai.definePrompt({
  name: 'suggestShippingProviderPrompt',
  input: {
    schema: z.object({
      destination: z.string().describe('The destination address for the shipment.'),
      dpdCost: z.number().describe('The cost of shipping with DPD.'),
      dpdDeliveryTime: z.number().describe('The estimated delivery time with DPD.'),
      postaSlovenijeCost: z.number().describe('The cost of shipping with Pošta Slovenije.'),
      postaSlovenijeDeliveryTime: z.number().describe('The estimated delivery time with Pošta Slovenije.'),
    }),
  },
  output: {
    schema: z.object({
      provider: z.enum(['DPD', 'Pošta Slovenije']).describe('The suggested shipping provider.'),
      reason: z.string().describe('The reason for suggesting this provider.'),
    }),
  },
  prompt: `Given the following shipping options, suggest the best shipping provider based on cost and delivery time to {{{destination}}}. Provide a brief reason for your suggestion. 

DPD Cost: {{{dpdCost}}}
DPD Delivery Time: {{{dpdDeliveryTime}}} days

Pošta Slovenije Cost: {{{postaSlovenijeCost}}}
Pošta Slovenije Delivery Time: {{{postaSlovenijeDeliveryTime}}} days

Consider both cost and delivery time when making your suggestion. If one provider is significantly cheaper or faster, that should be the primary factor.  If the cost is within a small margin, prefer the faster delivery time.
`,
});

const suggestShippingProviderFlow = ai.defineFlow<
  typeof SuggestShippingProviderInputSchema,
  typeof SuggestShippingProviderOutputSchema
>(
  {
    name: 'suggestShippingProviderFlow',
    inputSchema: SuggestShippingProviderInputSchema,
    outputSchema: SuggestShippingProviderOutputSchema,
  },
  async input => {
    const dpdRates = await getDpdShippingRates(input.destination);
    const postaSlovenijeRates = await getPostaSlovenijeShippingRates(input.destination);

    const promptResult = await suggestShippingProviderPrompt({
      destination: input.destination,
      dpdCost: dpdRates.cost,
      dpdDeliveryTime: dpdRates.estimatedDeliveryTime,
      postaSlovenijeCost: postaSlovenijeRates.cost,
      postaSlovenijeDeliveryTime: postaSlovenijeRates.estimatedDeliveryTime,
    });

    return {
      provider: promptResult.output!.provider,
      cost: promptResult.output!.provider === 'DPD' ? dpdRates.cost : postaSlovenijeRates.cost,
      estimatedDeliveryTime: promptResult.output!.provider === 'DPD' ? dpdRates.estimatedDeliveryTime : postaSlovenijeRates.estimatedDeliveryTime,
      reason: promptResult.output!.reason,
    };
  }
);

