import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Star, ChevronLeft, ChevronRight, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

type RecurringEvent = {
  id: string;
  title: string;
  time: string;
  location: string;
  description?: string;
  recurrence: 'monthly' | 'weekly';
  config: {
    weekOfMonth?: number | number[];
    dayOfWeek?: number;
    months?: number[];
  };
};

const SPECIAL_RECURRING_EVENTS: RecurringEvent[] = [
  {
    id: 'legion-meeting',
    title: 'Monthly Legion Membership Meeting',
    time: '6:00 PM',
    location: 'Legion Hall',
    recurrence: 'monthly',
    config: { weekOfMonth: 2, dayOfWeek: 4 }
  },
  {
    id: 'sons-meeting',
    title: 'Monthly Sons Membership Meeting',
    time: '6:00 PM',
    location: 'Legion Hall',
    recurrence: 'monthly',
    config: { weekOfMonth: 2, dayOfWeek: 3 }
  },
  {
    id: 'trivia-night',
    title: 'Trivia Night',
    time: '6:30 PM',
    location: 'Legion Hall',
    recurrence: 'weekly',
    config: { dayOfWeek: 2 }
  },
  {
    id: 'veterans-lunch',
    title: "Saturday Veteran's Lunch",
    time: 'Noon to 2:00 PM',
    location: 'Legion Hall',
    description: '$8 suggested donation. All proceeds benefit our Legion Veteran\'s Fund.',
    recurrence: 'weekly',
    config: { dayOfWeek: 6 }
  },
  {
    id: 'final-friday',
    title: 'Final Friday Live Music',
    time: '7:00 PM',
    location: 'Legion Hall',
    description: 'Live music on the last Friday of every month',
    recurrence: 'monthly',
    config: {
      weekOfMonth: -1,
      dayOfWeek: 5
    }
  }
];

function getNthDayOfMonth(year: number, month: number, dayOfWeek: number, week: number): Date | null {
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Handle last occurrence (week = -1)
  if (week === -1) {
    // Start from last day of month and work backwards
    for (let day = daysInMonth; day >= 1; day--) {
      const date = new Date(year, month, day);
      if (date.getDay() === dayOfWeek) {
        return date;
      }
    }
    return null;
  }

  // Handle normal nth occurrence
  const firstDay = new Date(year, month, 1);
  const firstDayOfWeek = firstDay.getDay();

  let offset = (dayOfWeek - firstDayOfWeek + 7) % 7;
  let targetDate = 1 + offset + (week - 1) * 7;

  if (targetDate > daysInMonth) return null;

  return new Date(year, month, targetDate);
}

function generateRecurringEventOccurrences(
  event: RecurringEvent,
  year: number,
  month: number
): Array<{ date: string; title: string; time: string; location: string; description?: string; isSpecialEvent: true; originalEventId?: string }> {
  const occurrences = [];

  if (event.recurrence === 'monthly') {
    const { weekOfMonth, dayOfWeek, months } = event.config;

    if (months && !months.includes(month + 1)) {
      return occurrences;
    }

    const weeks = Array.isArray(weekOfMonth) ? weekOfMonth : [weekOfMonth!];

    for (const week of weeks) {
      const date = getNthDayOfMonth(year, month, dayOfWeek!, week);
      if (date) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        occurrences.push({
          date: dateStr,
          title: event.title,
          time: event.time,
          location: event.location,
          description: event.description,
          isSpecialEvent: true,
          originalEventId: event.id
        });
      }
    }
  } else if (event.recurrence === 'weekly') {
    const { dayOfWeek } = event.config;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      if (date.getDay() === dayOfWeek) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        occurrences.push({
          date: dateStr,
          title: event.title,
          time: event.time,
          location: event.location,
          description: event.description,
          isSpecialEvent: true,
          originalEventId: event.id
        });
      }
    }
  }

  return occurrences;
}

function getRecurrenceDescription(event: RecurringEvent): string {
  if (event.recurrence === 'monthly') {
    const { weekOfMonth, dayOfWeek } = event.config;
    const weeks = Array.isArray(weekOfMonth) ? weekOfMonth : [weekOfMonth!];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const ordinals = ['', '1st', '2nd', '3rd', '4th', '5th'];

    if (weeks.length === 1) {
      if (weeks[0] === -1) {
        return `Last ${dayNames[dayOfWeek!]} of each month`;
      }
      return `${ordinals[weeks[0]]} ${dayNames[dayOfWeek!]} of each month`;
    } else {
      return `${weeks.map(w => ordinals[w]).join(', ')} ${dayNames[dayOfWeek!]} of each month`;
    }
  } else if (event.recurrence === 'weekly') {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return `Every ${dayNames[event.config.dayOfWeek!]}`;
  }
  return '';
}

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [sheetsEvents, setSheetsEvents] = useState<any[]>([]);
  const [mergedEvents, setMergedEvents] = useState<any[]>([]);
  const [overriddenEvents, setOverriddenEvents] = useState<Map<string, string>>(new Map());

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

        setSheetsEvents(parsedEvents);
      })
      .catch(err => console.error("Failed to load events", err));
  }, []);

  // Merge special events with sheets events
  useEffect(() => {
    // Generate special events for the next 12 months
    const specialEvents: any[] = [];
    const today = new Date();

    for (let monthOffset = 0; monthOffset < 12; monthOffset++) {
      const targetDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
      const targetYear = targetDate.getFullYear();
      const targetMonth = targetDate.getMonth();

      SPECIAL_RECURRING_EVENTS.forEach(recurringEvent => {
        const occurrences = generateRecurringEventOccurrences(
          recurringEvent,
          targetYear,
          targetMonth
        );
        specialEvents.push(...occurrences);
      });
    }

    const overrides = new Map<string, string>();
    const sheetsEventsByDate = new Map(sheetsEvents.map(e => [e.date, e]));

    const filteredSpecialEvents = specialEvents.filter(se => {
      if (sheetsEventsByDate.has(se.date)) {
        overrides.set(se.date, se.title);
        return false;
      }
      return true;
    });

    setOverriddenEvents(overrides);

    const merged = [...sheetsEvents, ...filteredSpecialEvents];
    setMergedEvents(merged);
  }, [sheetsEvents]);

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
    return mergedEvents.filter(event => event.date === dateStr);
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const upcomingEvents = mergedEvents
    .filter(event => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const eventDate = new Date(event.date + 'T00:00:00');
      return eventDate >= today;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date + 'T00:00:00');
      const dateB = new Date(b.date + 'T00:00:00');
      return dateA.getTime() - dateB.getTime();
    })
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

      {/* Special Events Section */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold font-serif">Special Events</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {SPECIAL_RECURRING_EVENTS.map(event => (
              <Card key={event.id} className="shadow-card border-t-4 border-t-gold">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2 font-serif">{event.title}</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gold" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gold" />
                      <span>{event.location}</span>
                    </div>
                    <p className="text-xs italic mt-2">
                      {getRecurrenceDescription(event)}
                    </p>
                    {event.description && (
                      <p className="text-xs mt-3 pt-3 border-t">{event.description}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
                        {dayEvents.map((event, eventIndex) => {
                          const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                          const isOverriding = !event.isSpecialEvent && overriddenEvents.has(dateStr);

                          return (
                            <div key={eventIndex} className="mt-1 space-y-0.5">
                              <div className={`truncate rounded px-1 py-0.5 text-xs ${
                                event.isSpecialEvent
                                  ? 'bg-gold/80 text-gold-foreground'
                                  : 'bg-primary text-primary-foreground'
                              }`}>
                                {event.title}
                              </div>
                              {isOverriding && (
                                <div className="text-[9px] text-muted-foreground italic px-1">
                                  (Replaces: {overriddenEvents.get(dateStr)})
                                </div>
                              )}
                            </div>
                          );
                        })}
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
                        {new Date(event.date + 'T00:00:00').toLocaleDateString("en-US", {
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
