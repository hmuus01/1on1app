import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing - How 1on1 Tokens Work",
  description: "Understand 1on1's token-based pricing system. Transparent rates for personal trainers, gym spaces, and clients. No hidden fees.",
  alternates: {
    canonical: "https://1on1.fitness/pricing",
  },
  openGraph: {
    title: "Pricing - How 1on1 Tokens Work",
    description: "Understand 1on1's token-based pricing system. Transparent rates for personal trainers, gym spaces, and clients.",
    type: "website",
    locale: "en_GB",
  },
};

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="w-full py-20 px-4 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-muted-foreground">
            1on1 uses a token-based system for flexible, clear pricing across the platform.
          </p>
        </div>
      </section>

      {/* Token System */}
      <section className="w-full py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            How Tokens Work
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>For Coaches</CardTitle>
                <CardDescription>Set your own rates</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  You decide your hourly rate in tokens. Typical ranges:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Entry-level coaches: 40-60 tokens/hour</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Experienced coaches: 60-100 tokens/hour</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Specialist coaches: 100+ tokens/hour</span>
                  </li>
                </ul>
                <p className="text-sm text-muted-foreground mt-4">
                  Adjust your rates anytime based on demand and your expertise.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>For Gym Owners</CardTitle>
                <CardDescription>Price your spaces</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Set hourly rates for your spaces. Typical ranges:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Basic space: 15-25 tokens/hour</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Premium equipment: 25-40 tokens/hour</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Specialist areas: 40+ tokens/hour</span>
                  </li>
                </ul>
                <p className="text-sm text-muted-foreground mt-4">
                  Free to list. No commission. You keep what you earn.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>For Clients</CardTitle>
                <CardDescription>Clear, upfront pricing</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  See coach rates before booking. Budget with tokens:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>View hourly rates in tokens</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Compare coaches easily</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>No hidden fees or surprises</span>
                  </li>
                </ul>
                <p className="text-sm text-muted-foreground mt-4">
                  Future updates will include token packages and payment integration.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Platform Fees */}
      <section className="w-full py-16 px-4 bg-muted/20">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-8">
            Platform Fees
          </h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">For Clients</h3>
                  <p className="text-sm text-muted-foreground">
                    Free to browse and request sessions. Pay only the coach's token rate.
                    (Future: small convenience fee on token purchases)
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">For Coaches</h3>
                  <p className="text-sm text-muted-foreground">
                    Free to create profile and receive requests. Set your rates, keep your earnings.
                    (Future: small platform fee on completed sessions)
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">For Gym Owners</h3>
                  <p className="text-sm text-muted-foreground">
                    Free to list your gym. No monthly fees, no commission. Keep 100% of your
                    booking revenue.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Example Costs */}
      <section className="w-full py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Example Scenarios
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Client Books a Coach</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p className="flex justify-between">
                    <span>Coach rate:</span>
                    <span className="font-medium">70 tokens/hour</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Session duration:</span>
                    <span className="font-medium">1 hour</span>
                  </p>
                  <hr className="my-2" />
                  <p className="flex justify-between font-semibold">
                    <span>Total cost:</span>
                    <span>70 tokens</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Coach Books Gym Space</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p className="flex justify-between">
                    <span>Gym space rate:</span>
                    <span className="font-medium">25 tokens/hour</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Booking duration:</span>
                    <span className="font-medium">2 hours</span>
                  </p>
                  <hr className="my-2" />
                  <p className="flex justify-between font-semibold">
                    <span>Total cost:</span>
                    <span>50 tokens</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="w-full py-16 px-4 bg-muted/20">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Pricing FAQs
          </h2>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How do I buy tokens?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Token purchasing is coming soon. For now, tokens are used to display and compare
                  pricing. Future updates will include secure payment integration.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I change my rates?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Yes! Coaches and gym owners can update their token rates anytime from their
                  dashboard. Changes apply to new bookings.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Are there any hidden fees?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  No. The platform is currently free to use for all roles. When payment processing
                  is added, any fees will be clearly displayed before transactions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join 1on1 and start connecting with the UK fitness community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/auth/sign-up">Sign Up Free</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/how-it-works">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

