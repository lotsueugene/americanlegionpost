import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Star, ChevronLeft, ChevronRight, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<any[]>([]);

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

        setEvents(parsedEvents);
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
    return events.filter(event => event.date === dateStr);
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const upcomingEvents = events
    .filter(event => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  return (
    <Layout>
      {/* Hero */}
      <section className="hero-gradient py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <Star className="mx-auto mb-4 h-10 w-10 text-gold" fill="currentColor" />
          <h1 className="mb-4 text-4xl font-bold text-primary-foreground font-serif md:text-5xl">
            Events Calendar
          </h1>
          <p className="mx-auto max-w-2xl text-primary-foreground/80">
            Stay updated on all post events, meetings, and community activities.
          </p>
        </div>
      </section>

      {/* Calendar Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Calendar */}
            <div className="lg:col-span-2">
              <Card className="shadow-elevated overflow-hidden">
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

            {/* Upcoming Events */}
            <div>
              <h2 className="mb-4 text-xl font-bold font-serif">Upcoming Events</h2>
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <Card key={index} className="shadow-card hover:shadow-elevated transition-shadow">
                    <CardContent className="p-4">
                      <div className="mb-2 text-sm font-medium text-gold">
                        {new Date(event.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                      <h3 className="mb-2 font-bold font-serif">{event.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {event.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {event.location}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CalendarPage;
