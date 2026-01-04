import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "List Your Gym on 1on1 - Earn from Hourly Space Bookings",
  description: "Maximize your gym's revenue by listing spaces for personal trainers to book by the hour. Free to list, easy to manage, flexible pricing. Join UK gym owners on 1on1.",
  alternates: {
    canonical: "https://1on1.fitness/gym-owners",
  },
  openGraph: {
    title: "List Your Gym on 1on1 - Earn from Hourly Space Bookings",
    description: "Maximize your gym's revenue by listing spaces for personal trainers to book by the hour.",
    type: "website",
    locale: "en_GB",
  },
};

export default function GymOwnersPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32 px-4 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            List Your Gym. Earn from Unused Hours.
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Join UK gym owners who are monetizing their spaces with hourly bookings from personal trainers.
            Free to list, easy to manage, you set the rates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/auth/sign-up">List Your Gym Free</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8">
              <Link href="/how-it-works">How It Works</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="w-full py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why List on 1on1?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Maximize Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Turn unused hours into income. Personal trainers need flexible space for client
                  sessions. Fill your quiet hours with hourly bookings.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>You Control Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Set your own hourly rates in tokens. Adjust for peak/off-peak hours. No
                  commission on bookings - just a simple listing platform.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Easy Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Manage booking requests, set availability, and communicate with coaches from
                  your dashboard. Simple, straightforward tools.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Free to List</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  No upfront costs, no monthly fees. List your gym spaces for free and only
                  deal with trainers who book.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Professional Coaches</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  All personal trainers on 1on1 are verified and insured. Work with qualified
                  professionals who respect your facility.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>CCTV & Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Highlight your security features like CCTV. Trainers and clients value safe,
                  well-maintained spaces. Show what makes your gym professional.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="w-full py-16 px-4 bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            How It Works for Gym Owners
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <CardTitle>Sign Up</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Create your gym owner account. It's free and takes just a few minutes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <CardTitle>List Your Spaces</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Add your gym details, spaces, amenities, and set your hourly rates in tokens.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <CardTitle>Receive Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Personal trainers find your spaces and request bookings. Review and approve.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold">4</span>
                </div>
                <CardTitle>Earn Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Get paid for your spaces. Track bookings and earnings from your dashboard.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What to List */}
      <section className="w-full py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            What Can You List?
          </h2>
          <p className="text-lg text-muted-foreground text-center mb-12">
            Any fitness space that personal trainers can use for 1-to-1 sessions:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <p className="font-medium mb-2">Strength & Conditioning Areas</p>
              <p className="text-sm text-muted-foreground">
                Free weights, racks, platforms - ideal for strength coaches
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="font-medium mb-2">Boxing & Combat Spaces</p>
              <p className="text-sm text-muted-foreground">
                Boxing rings, bags, matted areas for combat sports training
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="font-medium mb-2">Functional Training Zones</p>
              <p className="text-sm text-muted-foreground">
                Open floor space for bodyweight, TRX, kettlebells
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="font-medium mb-2">Studio Spaces</p>
              <p className="text-sm text-muted-foreground">
                Quiet spaces for yoga, pilates, mobility work
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full py-20 px-4 bg-primary/5">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Monetize Your Space?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join gym owners across the UK who are earning from hourly bookings.
          </p>
          <Button asChild size="lg">
            <Link href="/auth/sign-up">List Your Gym Free</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

