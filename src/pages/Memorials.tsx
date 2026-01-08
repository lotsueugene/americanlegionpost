import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Star, Flag, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Memorial {
  name: string;
  branch: string;
  conflict: string;
  years: string;
}

const Memorials = () => {
  const [memorials, setMemorials] = useState<Memorial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace this URL with your actual Google Sheets CSV publish URL
    // Example: https://docs.google.com/spreadsheets/d/e/YOUR_SHEET_ID/pub?output=csv
    const googleSheetsUrl = "";

    if (!googleSheetsUrl) {
      // No URL configured yet, show coming soon
      setLoading(false);
      return;
    }

    fetch(googleSheetsUrl)
      .then(res => res.text())
      .then(csv => {
        const lines = csv.trim().split("\n");
        const headers = lines[0].split(",");

        const parsedMemorials = lines
          .slice(1)
          .map(line => {
            const values = line.split(",");
            const obj = Object.fromEntries(
              headers.map((h, i) => [h.trim(), values[i]?.trim()])
            );
            return {
              name: obj.name || "",
              branch: obj.branch || "",
              conflict: obj.conflict || "",
              years: obj.years || ""
            } as Memorial;
          })
          .filter(m => m.name); // remove empty rows

        setMemorials(parsedMemorials);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load memorials", err);
        setLoading(false);
      });
  }, []);

  return (
    <Layout>
      {/* Hero */}
      <section className="hero-gradient py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <Star className="mx-auto mb-4 h-10 w-10 text-gold" fill="currentColor" />
          <h1 className="mb-4 text-4xl font-bold text-primary-foreground font-serif md:text-5xl">
            Veteran Memorials
          </h1>
          <p className="mx-auto max-w-2xl text-primary-foreground/80">
            Honoring those who gave the ultimate sacrifice for our freedom.
          </p>
        </div>
      </section>

      {/* Memorial Wall */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <Flag className="mx-auto mb-4 h-10 w-10 text-accent" />
            <h2 className="text-2xl font-bold font-serif md:text-3xl">In Memoriam</h2>
            <p className="mt-2 text-muted-foreground">
              We remember these fallen heroes from our community
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading memorials...</p>
            </div>
          ) : memorials.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto max-w-md">
                <Star className="mx-auto mb-4 h-16 w-16 text-gold/50" fill="currentColor" />
                <h3 className="mb-2 text-2xl font-bold font-serif">Coming Soon</h3>
                <p className="text-muted-foreground">
                  We are currently compiling our memorial wall. This section will honor the brave veterans
                  from our community who made the ultimate sacrifice.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {memorials.map((memorial, index) => (
                <Card key={index} className="shadow-card hover:shadow-elevated transition-shadow border-t-4 border-t-gold">
                  <CardContent className="p-6 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
                      <Star className="h-8 w-8 text-gold" fill="currentColor" />
                    </div>
                    <h3 className="mb-1 text-lg font-bold font-serif">{memorial.name}</h3>
                    <p className="text-sm text-gold">{memorial.branch}</p>
                    <p className="text-sm text-muted-foreground">{memorial.conflict}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{memorial.years}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* POW/MIA Section */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-2xl font-bold text-primary-foreground font-serif md:text-3xl">
            POW/MIA Remembrance
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-primary-foreground/80">
            We never forget our Prisoners of War and those Missing in Action.
            Their sacrifice and the sacrifice of their families must always be remembered.
          </p>
          <div className="inline-flex items-center gap-2 rounded-lg bg-primary-foreground/10 px-6 py-4">
            <Heart className="h-6 w-6 text-gold" />
            <span className="text-primary-foreground font-bold font-serif">
              "You Are Not Forgotten"
            </span>
          </div>
        </div>
      </section>

      {/* Submit Memorial */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-2xl font-bold font-serif">Submit a Memorial</h2>
          <p className="mx-auto mb-6 max-w-xl text-muted-foreground">
            If you would like to submit a memorial for a veteran from our community,
            please contact our Post Historian at{" "}
            <a href="mailto:Americanlegion318@yahoo.com" className="text-primary hover:text-accent underline">
              Americanlegion318@yahoo.com
            </a>
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default Memorials;
