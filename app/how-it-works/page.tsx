import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How 1on1 Works - UK Fitness Marketplace Guide",
  description: "Learn how 1on1 connects personal trainers, clients, and gym owners. Understand tokens, bookings, and how to use the platform for all three roles.",
  alternates: {
    canonical: "https://1on1.fitness/how-it-works",
  },
  openGraph: {
    title: "How 1on1 Works - UK Fitness Marketplace Guide",
    description: "Learn how 1on1 connects personal trainers, clients, and gym owners.",
    type: "website",
    locale: "en_GB",
  },
};

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="w-full py-20 px-4 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            How 1on1 Works
          </h1>
          <p className="text-xl text-muted-foreground">
            The UK's marketplace connecting personal trainers, clients, and gym owners.
            Here's how it works for everyone.
          </p>
        </div>
      </section>

      {/* For Clients */}
      <section className="w-full py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-8">For Clients</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Find qualified personal trainers who match your fitness goals and train on your terms.
          </p>
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <span className="text-xl font-bold">1</span>
                </div>
                <CardTitle className="text-lg">Browse Coaches</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Search by location, specialty (boxing, strength, weight loss), and availability.
                  Read profiles and reviews.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <span className="text-xl font-bold">2</span>
                </div>
                <CardTitle className="text-lg">Request Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  See coach rates in tokens per hour. Request 1-to-1 sessions with your preferred
                  dates and times.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <span className="text-xl font-bold">3</span>
                </div>
                <CardTitle className="text-lg">Confirm & Train</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Coach approves your session. You'll receive confirmation with location details
                  and session info.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <span className="text-xl font-bold">4</span>
                </div>
                <CardTitle className="text-lg">Track Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  View your session history, message your coach, and book follow-up sessions.
                  Leave reviews.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* For Coaches */}
      <section className="w-full py-16 px-4 bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-8">For Coaches</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Build your client base and book gym spaces flexibly - all from one platform.
          </p>
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <span className="text-xl font-bold">1</span>
                </div>
                <CardTitle className="text-lg">Create Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Set up your coach profile with qualifications, specialties, experience, and
                  your hourly rate in tokens.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <span className="text-xl font-bold">2</span>
                </div>
                <CardTitle className="text-lg">Receive Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Clients find you and request sessions. Review requests and approve sessions
                  that fit your schedule.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <span className="text-xl font-bold">3</span>
                </div>
                <CardTitle className="text-lg">Book Gym Space</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Browse available gym spaces by location. Book by the hour for your client
                  sessions. Pay in tokens.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <span className="text-xl font-bold">4</span>
                </div>
                <CardTitle className="text-lg">Grow Business</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Build your reputation with reviews. Manage all clients and bookings from your
                  coach dashboard.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* For Gym Owners */}
      <section className="w-full py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-8">For Gym Owners</h2>
          <p className="text-lg text-muted-foreground mb-8">
            List your spaces and earn from hourly bookings by personal trainers.
          </p>
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <span className="text-xl font-bold">1</span>
                </div>
                <CardTitle className="text-lg">List Spaces</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Add your gym with photos, amenities, and equipment. List individual spaces
                  (strength area, boxing ring, studio).
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <span className="text-xl font-bold">2</span>
                </div>
                <CardTitle className="text-lg">Set Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Choose your hourly rate in tokens for each space. Set availability and rules.
                  Update anytime.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <span className="text-xl font-bold">3</span>
                </div>
                <CardTitle className="text-lg">Approve Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Coaches request to book your spaces. Review and approve booking requests
                  from your dashboard.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <span className="text-xl font-bold">4</span>
                </div>
                <CardTitle className="text-lg">Earn Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Get paid for approved bookings. Track your earnings and booking history.
                  No upfront costs.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Tokens Explained */}
      <section className="w-full py-16 px-4 bg-muted/20">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-8">
            Understanding Tokens
          </h2>
          <Card>
            <CardHeader>
              <CardTitle>What are tokens?</CardTitle>
              <CardDescription>1on1's flexible pricing currency</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Tokens are 1on1's internal currency that makes pricing transparent and flexible
                across the platform.
              </p>
              <div className="space-y-2">
                <p className="font-medium">For Coaches:</p>
                <p className="text-sm text-muted-foreground">
                  Set your hourly rate in tokens (e.g., 50 tokens/hour). Clients know exactly
                  what to expect. You can adjust your rates based on your experience and demand.
                </p>
              </div>
              <div className="space-y-2">
                <p className="font-medium">For Gym Owners:</p>
                <p className="text-sm text-muted-foreground">
                  Price your spaces in tokens per hour (e.g., 20 tokens/hour). Simple, consistent
                  pricing that coaches can budget for.
                </p>
              </div>
              <div className="space-y-2">
                <p className="font-medium">For Clients:</p>
                <p className="text-sm text-muted-foreground">
                  See coach rates in tokens. Compare pricing easily. Future payment integration
                  will make token purchases seamless.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Join 1on1?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Choose your role and get started today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/coaches">Find a Coach</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/auth/sign-up">Sign Up as Coach</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/gym-owners">List Your Gym</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

