import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Star, Check, Calendar, Users, Clock, ChevronLeft, ChevronRight, X, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const amenities = [
  "Entrance on Main Street",
  "Ample parking",
  "Direct access to the Alley Bar",
  "Full kitchen",
  "Three bathrooms",
  "Nearly 3,000 sq ft of space",
  "Climate controlled",
  "Tables and chairs available",
];

const HallRentals = () => {
  const { toast } = useToast();
  const [bookedDates, setBookedDates] = useState<string[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState("");
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventDate: "",
    eventType: "",
    guestCount: "",
    message: "",
  });

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Fetch booked dates from Google Sheets CSV
  useEffect(() => {
    const fetchBookedDates = () => {
      // Google Sheets CSV URL for hall bookings
      // Expected CSV format: date (YYYY-MM-DD format)
      const googleSheetsUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQCxun4HNNwVuxlgOz-zwvOgMKQW3V9Ou99ndvFawIS6lOuMjPJqYR0X27bQH30ykamLQre7lvq9ROl/pub?gid=0&single=true&output=csv";

      if (!googleSheetsUrl) {
        // No URL configured yet, use empty array
        return;
      }

      // Add cache-busting parameter to force fresh data
      const cacheBustUrl = `${googleSheetsUrl}&timestamp=${Date.now()}`;

      fetch(cacheBustUrl)
        .then(res => res.text())
        .then(csv => {
          const lines = csv.trim().split("\n");
          const headers = lines[0].split(",");

          const dates = lines
            .slice(1)
            .map(line => {
              const values = line.split(",");
              const obj = Object.fromEntries(
                headers.map((h, i) => [h.trim(), values[i]?.trim()])
              );
              // Normalize date format: convert YYYY/MM/DD to YYYY-MM-DD
              // and ensure month and day are zero-padded
              let dateStr = obj.date;
              if (dateStr) {
                // Replace slashes with hyphens
                dateStr = dateStr.replace(/\//g, "-");

                // Parse and reformat to ensure zero-padding
                const parts = dateStr.split("-");
                if (parts.length === 3) {
                  const year = parts[0];
                  const month = parts[1].padStart(2, "0");
                  const day = parts[2].padStart(2, "0");
                  dateStr = `${year}-${month}-${day}`;
                }
              }
              return dateStr;
            })
            .filter(date => date); // remove empty rows

          console.log("Booked dates loaded:", dates);
          setBookedDates(dates);
          setLastUpdate(new Date());
          setIsRefreshing(false);
        })
        .catch(err => {
          console.error("Failed to load booked dates", err);
          setIsRefreshing(false);
        });
    };

    // Fetch immediately on mount
    fetchBookedDates();

    // Poll for updates every 5 seconds for near real-time updates
    const interval = setInterval(fetchBookedDates, 5000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    // Force a refresh by triggering the fetch
    const googleSheetsUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQCxun4HNNwVuxlgOz-zwvOgMKQW3V9Ou99ndvFawIS6lOuMjPJqYR0X27bQH30ykamLQre7lvq9ROl/pub?gid=0&single=true&output=csv";
    const cacheBustUrl = `${googleSheetsUrl}&timestamp=${Date.now()}`;

    fetch(cacheBustUrl)
      .then(res => res.text())
      .then(csv => {
        const lines = csv.trim().split("\n");
        const headers = lines[0].split(",");

        const dates = lines
          .slice(1)
          .map(line => {
            const values = line.split(",");
            const obj = Object.fromEntries(
              headers.map((h, i) => [h.trim(), values[i]?.trim()])
            );
            let dateStr = obj.date;
            if (dateStr) {
              dateStr = dateStr.replace(/\//g, "-");
              const parts = dateStr.split("-");
              if (parts.length === 3) {
                const year = parts[0];
                const month = parts[1].padStart(2, "0");
                const day = parts[2].padStart(2, "0");
                dateStr = `${year}-${month}-${day}`;
              }
            }
            return dateStr;
          })
          .filter(date => date);

        console.log("Manual refresh - Booked dates loaded:", dates);
        setBookedDates(dates);
        setLastUpdate(new Date());
        setIsRefreshing(false);
        toast({
          title: "Calendar Updated",
          description: `Loaded ${dates.length} booked date(s)`,
        });
      })
      .catch(err => {
        console.error("Failed to load booked dates", err);
        setIsRefreshing(false);
        toast({
          title: "Update Failed",
          description: "Could not refresh calendar data",
          variant: "destructive",
        });
      });
  };

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);

  const isDateBooked = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return bookedDates.includes(dateStr);
  };

  const isDateInPast = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handleDateClick = (day: number) => {
    if (isDateBooked(day) || isDateInPast(day)) {
      return; // Don't allow selecting booked or past dates
    }
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setSelectedDate(dateStr);
    setFormData({ ...formData, eventDate: dateStr });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("https://formspree.io/f/xlgdqypr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Inquiry Submitted!",
          description: "We'll contact you within 24-48 hours to discuss your event.",
        });
        setFormData({
          name: "",
          email: "",
          phone: "",
          eventDate: "",
          eventType: "",
          guestCount: "",
          message: "",
        });
        setSelectedDate("");
      } else {
        toast({
          title: "Submission Failed",
          description: "Please try again or contact us directly.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Submission Failed",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="hero-gradient py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <Star className="mx-auto mb-4 h-10 w-10 text-gold" fill="currentColor" />
          <h1 className="mb-4 text-4xl font-bold text-primary-foreground font-serif md:text-5xl">
            Hall / Event Space Rental
          </h1>
          <p className="mx-auto max-w-2xl text-primary-foreground/80">
            Host your next event at our spacious and versatile venue in beautiful downtown Parkville, Missouri.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {/* Hall Info */}
          <div className="max-w-4xl mx-auto">
            <h2 className="mb-6 text-2xl font-bold font-serif md:text-3xl text-center">Our Facility</h2>
            <p className="mb-8 text-muted-foreground text-center">
              The American Legion Post #318 is located in beautiful downtown Parkville, Missouri.
              The building features a Hall / Event Space of nearly 3,000 square feet, to include,
              an entrance directly on Main Street, ample parking, direct access to the Alley Bar,
              a kitchen, and three bathrooms.
            </p>

            <div className="grid gap-4 sm:grid-cols-2 mb-8 max-w-2xl mx-auto">
              <div className="flex items-center gap-3 rounded-lg bg-muted p-4">
                <Users className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-bold">Size</p>
                  <p className="text-sm text-muted-foreground">Nearly 3,000 sq ft</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-muted p-4">
                <Clock className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-bold">Location</p>
                  <p className="text-sm text-muted-foreground">Downtown Parkville</p>
                </div>
              </div>
            </div>

            <h3 className="mb-4 text-lg font-bold font-serif text-center">Amenities Included</h3>
            <div className="grid gap-2 sm:grid-cols-2 mb-8">
              {amenities.map((amenity, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-gold" />
                  <span className="text-sm">{amenity}</span>
                </div>
              ))}
            </div>

            <h3 className="mb-4 text-lg font-bold font-serif text-center">Events We've Hosted</h3>
            <p className="mb-4 text-muted-foreground text-center">
              Hundreds of events have been hosted at Post #318's Hall / Event Space over the years, such as:
            </p>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {[
                "Retirement Parties",
                "Weddings and Wedding Receptions",
                "Birthday Parties",
                "Baby Showers",
                "Anniversaries",
                "Company Holiday Parties",
                "Company / Business Meetings and Events",
                "Live Music Events and Performances",
                "Community and Civic Meetings",
                "Sunday Church Services"
              ].map((eventType, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Star className="h-3 w-3 text-gold" fill="currentColor" />
                  <span className="text-sm">{eventType}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Availability Calendar & Booking Form */}
      <section className="bg-muted py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <h2 className="mb-4 text-3xl font-bold font-serif md:text-4xl">
              Check Availability & Book
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground mb-3">
              Select an available date from the calendar below to request a booking.
            </p>
            <p className="mx-auto max-w-2xl text-sm text-muted-foreground bg-accent/10 border border-accent/20 rounded-lg px-4 py-3">
              <strong>Pricing Information:</strong> We'll contact you within 24 hours of your submission with pricing details tailored to your event needs.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 max-w-6xl mx-auto">
            {/* Availability Calendar */}
            <div>
              <Card className="shadow-elevated overflow-hidden">
                <CardHeader className="bg-primary text-primary-foreground">
                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={prevMonth}
                      className="text-primary-foreground hover:bg-primary-foreground/10"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex flex-col items-center gap-1">
                      <CardTitle className="text-xl font-serif">
                        {months[currentMonth]} {currentYear}
                      </CardTitle>
                      {lastUpdate && (
                        <p className="text-xs text-primary-foreground/70">
                          Updated: {lastUpdate.toLocaleTimeString()}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleManualRefresh}
                        disabled={isRefreshing}
                        className="text-primary-foreground hover:bg-primary-foreground/10"
                        title="Refresh calendar data"
                      >
                        <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={nextMonth}
                        className="text-primary-foreground hover:bg-primary-foreground/10"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-0">
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
                      <div key={`empty-${index}`} className="min-h-[60px] border-b border-r bg-muted/30" />
                    ))}

                    {/* Days of the month */}
                    {Array.from({ length: daysInMonth }).map((_, index) => {
                      const day = index + 1;
                      const booked = isDateBooked(day);
                      const past = isDateInPast(day);
                      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                      const selected = selectedDate === dateStr;

                      return (
                        <div
                          key={day}
                          onClick={() => handleDateClick(day)}
                          className={`min-h-[60px] border-b border-r p-2 text-center transition-all ${
                            booked
                              ? "bg-red-50 cursor-not-allowed"
                              : past
                              ? "bg-muted/50 cursor-not-allowed"
                              : selected
                              ? "bg-gold/20 cursor-pointer hover:bg-gold/30"
                              : "cursor-pointer hover:bg-accent/10"
                          }`}
                        >
                          <div className={`text-sm font-medium ${
                            booked ? "text-red-600" : past ? "text-muted-foreground/50" : ""
                          }`}>
                            {day}
                          </div>
                          {booked && (
                            <div className="mt-1">
                              <X className="h-4 w-4 text-red-600 mx-auto" />
                              <div className="text-xs text-red-600">Booked</div>
                            </div>
                          )}
                          {!booked && !past && selected && (
                            <div className="mt-1">
                              <Check className="h-4 w-4 text-gold mx-auto" />
                              <div className="text-xs text-gold font-medium">Selected</div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Legend */}
              <div className="mt-4 flex flex-wrap gap-4 justify-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 bg-white border border-muted"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 bg-red-50 border border-red-200"></div>
                  <span>Booked</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 bg-gold/20 border border-gold"></div>
                  <span>Selected</span>
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <div>
              <Card className="shadow-elevated">
                <CardHeader className="border-b">
                  <CardTitle className="flex items-center gap-2 text-2xl font-serif">
                    <Calendar className="h-6 w-6 text-gold" />
                    Request a Booking
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="eventDate">Selected Date *</Label>
                      <Input
                        id="eventDate"
                        name="eventDate"
                        type="date"
                        value={formData.eventDate}
                        onChange={(e) => {
                          handleChange(e);
                          setSelectedDate(e.target.value);
                        }}
                        required
                        className="bg-muted"
                      />
                      {selectedDate && (
                        <p className="text-sm text-muted-foreground">
                          You selected: {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                          })}
                        </p>
                      )}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="eventType">Event Type</Label>
                        <Select
                          value={formData.eventType}
                          onValueChange={(value) => setFormData({ ...formData, eventType: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="retirement">Retirement Party</SelectItem>
                            <SelectItem value="wedding">Wedding / Wedding Reception</SelectItem>
                            <SelectItem value="birthday">Birthday Party</SelectItem>
                            <SelectItem value="baby-shower">Baby Shower</SelectItem>
                            <SelectItem value="anniversary">Anniversary</SelectItem>
                            <SelectItem value="holiday">Company Holiday Party</SelectItem>
                            <SelectItem value="corporate">Company / Business Meeting or Event</SelectItem>
                            <SelectItem value="music">Live Music Event</SelectItem>
                            <SelectItem value="community">Community / Civic Meeting</SelectItem>
                            <SelectItem value="church">Church Service</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="guestCount">Estimated Guests</Label>
                        <Input
                          id="guestCount"
                          name="guestCount"
                          type="number"
                          min="1"
                          max="150"
                          value={formData.guestCount}
                          onChange={handleChange}
                          placeholder="Up to 150"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Additional Information</Label>
                      <Textarea
                        id="message"
                        name="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us more about your event, preferred time, special requirements, etc..."
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-gold text-gold-foreground hover:bg-gold/90"
                      disabled={!selectedDate}
                    >
                      Submit Booking Request
                    </Button>

                    {!selectedDate && (
                      <p className="text-sm text-center text-muted-foreground">
                        Please select a date from the calendar to continue
                      </p>
                    )}
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HallRentals;
