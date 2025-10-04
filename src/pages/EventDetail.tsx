import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, MapPin, Users, Clock, DollarSign, User } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [ticketCount, setTicketCount] = useState(1);
  const [isBooking, setIsBooking] = useState(false);

  const { data: event, isLoading } = useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          categories (name),
          profiles:organizer_id (full_name, email)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const handleBooking = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to book tickets",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (!event) return;

    if (ticketCount > event.available_seats) {
      toast({
        title: "Not Enough Seats",
        description: `Only ${event.available_seats} seats available`,
        variant: "destructive",
      });
      return;
    }

    setIsBooking(true);
    try {
      const totalAmount = event.price * ticketCount;
      
      const { data: booking, error } = await supabase
        .from("bookings")
        .insert({
          event_id: event.id,
          user_id: user.id,
          tickets_count: ticketCount,
          total_amount: totalAmount,
          status: "confirmed",
        })
        .select()
        .single();

      if (error) throw error;

      // Update available seats
      await supabase
        .from("events")
        .update({ available_seats: event.available_seats - ticketCount })
        .eq("id", event.id);

      toast({
        title: "Booking Confirmed!",
        description: "Your tickets have been booked successfully",
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Booking error:", error);
      toast({
        title: "Booking Failed",
        description: "There was an error processing your booking",
        variant: "destructive",
      });
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-96 bg-muted rounded-xl" />
            <div className="h-8 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">Event not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 animate-fade-in">
            {/* Event Image */}
            <div className="relative h-96 rounded-xl overflow-hidden bg-muted">
              {event.image_url ? (
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-gradient-primary flex items-center justify-center">
                  <Calendar className="h-24 w-24 text-white/30" />
                </div>
              )}
              {event.featured && (
                <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground">
                  Featured
                </Badge>
              )}
            </div>

            {/* Event Info */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                {event.categories && (
                  <Badge variant="outline">{event.categories.name}</Badge>
                )}
                <Badge variant={event.status === "upcoming" ? "default" : "secondary"}>
                  {event.status}
                </Badge>
              </div>
              <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
              <p className="text-muted-foreground text-lg whitespace-pre-line">
                {event.description}
              </p>
            </div>

            {/* Event Details */}
            <Card>
              <CardContent className="pt-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold">Date & Time</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(event.start_date), "PPP")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(event.start_date), "p")} - {format(new Date(event.end_date), "p")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold">Location</p>
                      <p className="text-sm text-muted-foreground">{event.venue_name || "TBA"}</p>
                      <p className="text-sm text-muted-foreground">{event.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold">Availability</p>
                      <p className="text-sm text-muted-foreground">
                        {event.available_seats} of {event.total_seats} seats available
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold">Organizer</p>
                      <p className="text-sm text-muted-foreground">
                        {event.profiles?.full_name || "EventHub"}
                      </p>
                    </div>
                  </div>
                </div>

                {event.tags && event.tags.length > 0 && (
                  <div className="mt-6 pt-6 border-t">
                    <p className="font-semibold mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1 animate-scale-in">
            <Card className="sticky top-20">
              <CardContent className="pt-6 space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Price per ticket</p>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-6 w-6 text-primary" />
                    <p className="text-3xl font-bold">
                      {event.price === 0 ? "Free" : event.price}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tickets">Number of Tickets</Label>
                  <Input
                    id="tickets"
                    type="number"
                    min="1"
                    max={event.available_seats}
                    value={ticketCount}
                    onChange={(e) => setTicketCount(Math.max(1, parseInt(e.target.value) || 1))}
                  />
                  <p className="text-sm text-muted-foreground">
                    Maximum {event.available_seats} tickets
                  </p>
                </div>

                {event.price > 0 && (
                  <div className="flex justify-between items-center py-4 border-t border-b">
                    <span className="font-semibold">Total Amount</span>
                    <span className="text-2xl font-bold text-primary">
                      ${(event.price * ticketCount).toFixed(2)}
                    </span>
                  </div>
                )}

                <Button
                  variant="hero"
                  size="lg"
                  className="w-full"
                  onClick={handleBooking}
                  disabled={isBooking || event.available_seats === 0}
                >
                  {isBooking ? "Processing..." : event.available_seats === 0 ? "Sold Out" : "Book Now"}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  By booking, you agree to our terms and conditions
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
