import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "1on1 - Find Personal Trainers & Book Gym Space in the UK",
  description: "Connect with qualified personal trainers, book gym spaces by the hour, and grow your fitness business. UK's marketplace for coaches, clients, and gym owners.",
  alternates: {
    canonical: "https://1on1.fitness",
  },
  openGraph: {
    title: "1on1 - Find Personal Trainers & Book Gym Space in the UK",
    description: "Connect with qualified personal trainers, book gym spaces by the hour, and grow your fitness business.",
    type: "website",
    locale: "en_GB",
    siteName: "1on1",
  },
};

export default function HomePage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "1on1",
        url: "https://1on1.fitness",
        logo: "https://1on1.fitness/logo.png",
        description: "UK marketplace connecting personal trainers, clients, and gym owners",
      },
      {
        "@type": "WebSite",
        name: "1on1",
        url: "https://1on1.fitness",
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "How does 1on1 work?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "1on1 connects personal trainers with clients and gym spaces. Clients browse qualified coaches, coaches book gym space by the hour, and gym owners list their facilities. Everything is managed through our token-based system.",
            },
          },
          {
            "@type": "Question",
            name: "What are tokens?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Tokens are 1on1's currency for booking sessions. Coaches set their hourly rate in tokens, and gym spaces are priced in tokens per hour. This flexible system allows transparent pricing across the platform.",
            },
          },
          {
            "@type": "Question",
            name: "How do I find a personal trainer?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Browse our directory of qualified coaches, filter by specialty (strength training, weight loss, boxing, etc.), location, and availability. View profiles, read reviews, and request sessions directly.",
            },
          },
          {
            "@type": "Question",
            name: "Can coaches book gym space through 1on1?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes! Coaches can browse available gym spaces, check hourly availability, and book spaces for their client sessions. Gym owners set their rates and manage booking requests.",
            },
          },
          {
            "@type": "Question",
            name: "How do I list my gym on 1on1?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Sign up as a gym owner, add your facility details, list your spaces with amenities and hourly rates, and manage booking requests from coaches. It's free to list.",
            },
          },
          {
            "@type": "Question",
            name: "Is 1on1 available throughout the UK?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, 1on1 is a UK-wide marketplace. Search by postcode to find coaches and gym spaces in your area.",
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="flex flex-col min-h-screen">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 px-4 bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto max-w-6xl text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Find Your Perfect Coach.<br />Book Gym Space by the Hour.
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              The UK's marketplace connecting personal trainers, clients, and gym owners.
              Book sessions, grow your business, and train on your terms.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8">
                <Link href="/coaches">Find a Coach</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8">
                <Link href="/gym-owners">List Your Gym</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              How 1on1 Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold">1</span>
                  </div>
                  <CardTitle>For Clients</CardTitle>
                  <CardDescription>Find your ideal coach</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Browse qualified personal trainers, filter by specialty and location,
                    read reviews, and request 1-to-1 sessions. Train with certified coaches
                    who match your goals.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold">2</span>
                  </div>
                  <CardTitle>For Coaches</CardTitle>
                  <CardDescription>Grow your business</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Create your profile, set your rates, and connect with clients.
                    Book gym spaces by the hour for your sessions. Manage everything
                    from one platform.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold">3</span>
              </div>
                  <CardTitle>For Gym Owners</CardTitle>
                  <CardDescription>Maximize your space</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    List your gym spaces and earn from hourly bookings. Set your own
                    rates, manage availability, and fill unused capacity with personal
                    trainers who need space.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="w-full py-16 px-4 bg-muted/20">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Why Choose 1on1?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Qualified Coaches</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Every personal trainer on 1on1 is verified with qualifications,
                    insurance, and experience. Train with confidence knowing your
                    coach is certified.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Flexible Booking</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Book gym spaces by the hour, not month-long contracts. Perfect for
                    personal trainers who need flexible access without long-term commitments.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Transparent Pricing</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Our token-based system makes pricing clear and consistent. No hidden
                    fees, no surprises. Set your own rates as a coach or gym owner.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>UK-Wide Coverage</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Find coaches and gym spaces across the UK. Search by postcode to
                    discover training options in your local area or while travelling.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Easy Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Manage bookings, availability, and communications all in one place.
                    Simple dashboards for clients, coaches, and gym owners.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Build Your Business</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    For coaches: grow your client base. For gym owners: monetize unused
                    capacity. 1on1 helps fitness professionals succeed.
                  </p>
                </CardContent>
              </Card>
            </div>
        </div>
        </section>

        {/* Training Categories */}
        <section className="w-full py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Popular Training Categories
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                "Boxing & Combat Sports",
                "Strength Training",
                "Weight Loss",
                "Yoga & Flexibility",
                "Functional Fitness",
                "Olympic Lifting",
                "Bodybuilding",
                "Sports Performance",
              ].map((category) => (
                <Link
                  key={category}
                  href="/coaches"
                  className="p-6 border rounded-lg hover:border-primary transition-colors text-center"
                >
                  <p className="font-medium">{category}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full py-16 px-4 bg-muted/20">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">How does 1on1 work?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    1on1 connects personal trainers with clients and gym spaces. Clients browse
                    qualified coaches, coaches book gym space by the hour, and gym owners list
                    their facilities. Everything is managed through our token-based system.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What are tokens?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Tokens are 1on1's currency for booking sessions. Coaches set their hourly rate
                    in tokens, and gym spaces are priced in tokens per hour. This flexible system
                    allows transparent pricing across the platform.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">How do I find a personal trainer?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Browse our directory of qualified coaches, filter by specialty (strength training,
                    weight loss, boxing, etc.), location, and availability. View profiles, read reviews,
                    and request sessions directly.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Can coaches book gym space through 1on1?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Yes! Coaches can browse available gym spaces, check hourly availability, and book
                    spaces for their client sessions. Gym owners set their rates and manage booking requests.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">How do I list my gym on 1on1?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Sign up as a gym owner, add your facility details, list your spaces with amenities
                    and hourly rates, and manage booking requests from coaches. It's free to list.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Is 1on1 available throughout the UK?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Yes, 1on1 is a UK-wide marketplace. Search by postcode to find coaches and gym
                    spaces in your area.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="w-full py-20 px-4 bg-primary/5">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join 1on1 today and connect with the UK's fitness community.
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
    </>
  );
}
