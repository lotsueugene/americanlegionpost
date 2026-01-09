import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, Users, Building, Star, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/layout/Layout";
import heroImage from "@/assets/hero-flag.jpg";

const features = [
  {
    icon: Users,
    title: "Join Our Family",
    description: "Become a member and join thousands of veterans dedicated to serving our community.",
    link: "/contact",
  },
  {
    icon: Calendar,
    title: "Events & Activities",
    description: "From community outreach to social gatherings, there's always something happening.",
    link: "/calendar",
  },
  {
    icon: Building,
    title: "Hall Rentals",
    description: "Host your next event at our spacious hall, perfect for any occasion.",
    link: "/hall-rentals",
  },
];

const Index = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [allEvents, setAllEvents] = useState<any[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Fetch events from Google Sheets CSV
  useEffect(() => {
    fetch(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vRS7HO8nlnTebUouAj1iUIaGRCj77ntYr7486A05BfxyPYJSZPeD0Ohxc_hKaYkElPaQ4Xkldp4gopI/pub?output=csv"
    )
      .then(res => res.text())
      .then(csv => {
        const lines = csv.trim().split("\n");
        const headers = lines[0].split(",");

        const parsedEvents = lines
          .slice(1)
          .map(line => {
            const values = line.split(",");
            return Object.fromEntries(
              headers.map((h, i) => [h.trim(), values[i]?.trim()])
            );
          })
          .filter(e => e.date && e.title); // remove empty rows

        setAllEvents(parsedEvents);

        const upcoming = parsedEvents
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) // earliest first
          .slice(0, 3); // only show first 3 upcoming events

        setUpcomingEvents(upcoming);
      })
      .catch(err => console.error("Failed to load events", err));
  }, []);

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);

  const getEventsForDate = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return allEvents.filter(event => event.date === dateStr);
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-primary/70" />
        </div>
        <div className="container relative mx-auto flex h-full items-center px-4">
          <div className="max-w-2xl animate-fade-in">
            <div className="mb-4 flex items-center gap-2">
              <Star className="h-6 w-6 text-gold" fill="currentColor" />
              <span className="text-gold font-semibold">American Legion Post #318</span>
            </div>
            <h1 className="mb-6 text-4xl font-bold text-primary-foreground md:text-5xl lg:text-6xl font-serif">
              For God and Country
            </h1>
            <p className="mb-8 text-lg text-primary-foreground/90 md:text-xl">
              Serving our veterans, community, and nation with honor and dedication. 
              Join us in making a difference.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90">
                <Link to="/hall-rentals">Rent Our Hall</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-2 border-primary-foreground bg-transparent text-primary-foreground hover:bg-primary-foreground/20">
                <Link to="/history">Our History</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground font-serif md:text-4xl">
              Welcome to Post #318
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              We are dedicated to mentoring youth, advocating for veterans, 
              and supporting our local community.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="group shadow-card hover:shadow-elevated transition-shadow border-t-4 border-t-gold">
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                    <feature.icon className="h-6 w-6 text-gold" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold font-serif">{feature.title}</h3>
                  <p className="mb-4 text-muted-foreground">{feature.description}</p>
                  <Link 
                    to={feature.link}
                    className="inline-flex items-center text-sm font-medium text-primary hover:text-accent transition-colors"
                  >
                    Learn more <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Calendar Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground font-serif md:text-4xl">
              Events Calendar
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Stay updated on all post events, meetings, and community activities.
            </p>
          </div>

          <Card className="shadow-elevated overflow-hidden max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between bg-primary p-4 text-primary-foreground">
              <Button
                variant="ghost"
                size="icon"
                onClick={prevMonth}
                className="text-primary-foreground hover:bg-primary-foreground/10"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h2 className="text-xl font-bold font-serif">
                {months[currentMonth]} {currentYear}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={nextMonth}
                className="text-primary-foreground hover:bg-primary-foreground/10"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 border-b bg-muted">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="p-3 text-center text-sm font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7">
              {/* Empty cells for days before first of month */}
              {Array.from({ length: firstDay }).map((_, index) => (
                <div key={`empty-${index}`} className="min-h-[80px] border-b border-r bg-muted/50 p-2" />
              ))}

              {/* Days of the month */}
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1;
                const dayEvents = getEventsForDate(day);
                const isToday =
                  day === new Date().getDate() &&
                  currentMonth === new Date().getMonth() &&
                  currentYear === new Date().getFullYear();

                return (
                  <div
                    key={day}
                    className={`min-h-[80px] border-b border-r p-2 ${
                      isToday ? "bg-gold/10" : ""
                    }`}
                  >
                    <span
                      className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-sm ${
                        isToday
                          ? "bg-gold font-bold text-gold-foreground"
                          : ""
                      }`}
                    >
                      {day}
                    </span>
                    {dayEvents.map((event, eventIndex) => (
                      <div
                        key={eventIndex}
                        className="mt-1 truncate rounded bg-primary px-1 py-0.5 text-xs text-primary-foreground"
                      >
                        {event.title}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold font-serif md:text-3xl">Upcoming Events</h2>
            <Button asChild variant="ghost" className="text-primary">
              <Link to="/calendar">View All <ChevronRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {upcomingEvents.map((event, index) => (
              <Card key={index} className="shadow-card hover:shadow-elevated transition-shadow">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-16 w-16 flex-col items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <span className="text-xs font-medium">
                      {new Date(event.date).toLocaleString("en-US", { month: "short" })}
                    </span>
                    <span className="text-xl font-bold">
                      {new Date(event.date).getDate()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold font-serif">{event.title}</h3>
                    <p className="text-sm text-muted-foreground">{event.time}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Alley Bar Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div>
              <h2 className="mb-4 text-3xl font-bold font-serif md:text-4xl">
                The World Famous Alley Bar
              </h2>
              <p className="mb-4 text-lg text-muted-foreground">
                <span className="font-bold text-gold">OPEN TO THE PUBLIC</span>
              </p>
              <p className="mb-6 text-muted-foreground">
                Located right in the heart of downtown Parkville, the Alley Bar at American Legion Post #318
                has been serving the community for decades. Whether you're a veteran, a local, or just passing through,
                everyone is welcome to stop by and enjoy the friendly atmosphere.
              </p>
              <div className="space-y-2 mb-6">
                <p className="flex items-start gap-2 text-muted-foreground">
                  <Building className="h-5 w-5 text-gold mt-0.5 flex-shrink-0" />
                  <span>11 Main Street, Parkville, MO 64152</span>
                </p>
              </div>
              <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90">
                <a href="https://maps.google.com/?q=11+Main+Street+Parkville+MO+64152" target="_blank" rel="noopener noreferrer">
                  Get Directions
                </a>
              </Button>
            </div>
            <div className="rounded-lg overflow-hidden shadow-elevated">
              <img
                src="/alley_bar.png"
                alt="The World Famous Alley Bar at American Legion Post #318"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="hero-gradient py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <Star className="mx-auto mb-4 h-12 w-12 text-gold" fill="currentColor" />
          <h2 className="mb-4 text-3xl font-bold text-primary-foreground font-serif md:text-4xl">
            Honor Those Who Served
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-primary-foreground/80">
            Visit our memorial section to pay tribute to the brave men and women
            who have served our nation.
          </p>
          <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90">
            <Link to="/memorials">View Memorials</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
