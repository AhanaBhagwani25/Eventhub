import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/EventCard";
import { Link } from "react-router-dom";
import { Calendar, Users, Shield, Sparkles, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import heroImage from "@/assets/hero-events.jpg";

const Index = () => {
  const { data: featuredEvents, isLoading } = useQuery({
    queryKey: ["featured-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          categories (name)
        `)
        .eq("featured", true)
        .eq("status", "upcoming")
        .order("start_date", { ascending: true })
        .limit(3);

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Discover Amazing
                <span className="block bg-gradient-primary bg-clip-text text-transparent">
                  Events Near You
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg">
                Join thousands of people discovering and booking incredible events.
                From concerts to conferences, find your next experience here.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/events">
                  <Button variant="hero" size="lg" className="gap-2">
                    Explore Events
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button variant="outline" size="lg">
                    Create Account
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative animate-scale-in">
              <div className="absolute inset-0 bg-gradient-primary opacity-20 blur-3xl rounded-full" />
              <img
                src={heroImage}
                alt="Events"
                className="relative rounded-2xl shadow-large w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose EventHub</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The easiest way to discover, book, and manage your event experiences
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Calendar,
                title: "Easy Booking",
                description: "Book your tickets in seconds with our streamlined checkout process",
              },
              {
                icon: Shield,
                title: "Secure Payments",
                description: "Your transactions are protected with industry-standard security",
              },
              {
                icon: Users,
                title: "Curated Events",
                description: "Discover hand-picked events tailored to your interests",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-xl border border-border hover:border-primary transition-colors animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-xl mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      {featuredEvents && featuredEvents.length > 0 && (
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-5 w-5 text-accent" />
                  <span className="text-accent font-semibold">Featured</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">Upcoming Events</h2>
              </div>
              <Link to="/events">
                <Button variant="outline">View All</Button>
              </Link>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-96 rounded-xl bg-muted animate-pulse" />
                ))
              ) : (
                featuredEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    id={event.id}
                    title={event.title}
                    description={event.description}
                    imageUrl={event.image_url}
                    location={event.location}
                    startDate={event.start_date}
                    price={event.price}
                    availableSeats={event.available_seats}
                    categoryName={event.categories?.name}
                    featured={event.featured}
                  />
                ))
              )}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Join EventHub today and never miss out on amazing experiences
          </p>
          <Link to="/auth">
            <Button variant="accent" size="lg" className="gap-2">
              Get Started Free
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 font-bold text-xl mb-4">
                <Calendar className="h-6 w-6 text-primary" />
                <span className="bg-gradient-primary bg-clip-text text-transparent">EventHub</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Your gateway to amazing events and unforgettable experiences.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Explore</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/events" className="hover:text-primary">Browse Events</Link></li>
                <li><Link to="/auth" className="hover:text-primary">Sign Up</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Help Center</a></li>
                <li><a href="#" className="hover:text-primary">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>&copy; 2025 EventHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
