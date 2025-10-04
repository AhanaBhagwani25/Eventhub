import { Card, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Calendar, MapPin, Users, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

interface EventCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  location: string;
  startDate: string;
  price: number;
  availableSeats: number;
  categoryName?: string;
  featured?: boolean;
}

export const EventCard = ({
  id,
  title,
  description,
  imageUrl,
  location,
  startDate,
  price,
  availableSeats,
  categoryName,
  featured,
}: EventCardProps) => {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-large hover:-translate-y-1">
      <div className="relative h-48 overflow-hidden bg-muted">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="h-full w-full bg-gradient-primary flex items-center justify-center">
            <Calendar className="h-16 w-16 text-white/30" />
          </div>
        )}
        {featured && (
          <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground">
            Featured
          </Badge>
        )}
        {categoryName && (
          <Badge className="absolute top-3 left-3 bg-background/90 backdrop-blur">
            {categoryName}
          </Badge>
        )}
      </div>
      
      <CardContent className="p-5">
        <h3 className="font-bold text-xl mb-2 line-clamp-1">{title}</h3>
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{description}</p>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(startDate), "PPP")}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{location}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{availableSeats} seats left</span>
            </div>
            <div className="flex items-center gap-1 font-semibold text-primary">
              <DollarSign className="h-4 w-4" />
              <span>{price === 0 ? "Free" : price}</span>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-5 pt-0">
        <Link to={`/events/${id}`} className="w-full">
          <Button variant="hero" className="w-full">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
