import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Star, Mail, Phone, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Officer {
  name: string;
  role: string;
}

const Officers = () => {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Google Sheets CSV URL for officers
    const googleSheetsUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQCxun4HNNwVuxlgOz-zwvOgMKQW3V9Ou99ndvFawIS6lOuMjPJqYR0X27bQH30ykamLQre7lvq9ROl/pub?gid=1989046429&single=true&output=csv";

    // Helper function to parse CSV line with proper quote handling
    const parseCSVLine = (line: string): string[] => {
      const result: string[] = [];
      let current = "";
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
          // Handle escaped quotes (double quotes)
          if (inQuotes && line[i + 1] === '"') {
            current += '"';
            i++; // Skip next quote
          } else {
            inQuotes = !inQuotes;
          }
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim());
          current = "";
        } else {
          current += char;
        }
      }

      result.push(current.trim());
      return result;
    };

    fetch(googleSheetsUrl)
      .then(res => res.text())
      .then(csv => {
        const lines = csv.trim().split("\n");
        const headers = parseCSVLine(lines[0]);

        const parsedOfficers = lines
          .slice(1)
          .map(line => {
            const values = parseCSVLine(line);
            const obj = Object.fromEntries(
              headers.map((h, i) => [h.trim(), values[i]?.trim() || ""])
            );
            return {
              name: obj.name || "",
              role: obj["position(s)"] || obj.role || ""
            } as Officer;
          })
          .filter(officer => officer.name); // remove empty rows

        setOfficers(parsedOfficers);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load officers", err);
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
            Elected Officers of Post #318
          </h1>
          <p className="mx-auto max-w-2xl text-primary-foreground/80">
            Meet the dedicated veterans who lead our post with honor and service.
          </p>
        </div>
      </section>

      {/* Officers Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading officers...</p>
            </div>
          ) : officers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No officers information available at this time.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {officers.map((officer, index) => (
                <Card key={index} className="shadow-card hover:shadow-elevated transition-all group">
                  <CardContent className="p-6 text-center">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted group-hover:bg-primary transition-colors">
                      <User className="h-10 w-10 text-muted-foreground group-hover:text-primary-foreground transition-colors" />
                    </div>
                    <h3 className="mb-2 text-lg font-bold font-serif">{officer.name}</h3>
                    <p className="text-sm font-medium text-gold">{officer.role}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-2xl font-bold font-serif">Get In Touch</h2>
          <p className="mb-6 text-muted-foreground">
            Have questions or want to get involved? Contact our post officers.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <a
              href="tel:8167415387"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Phone className="h-5 w-5" />
              (816) 741-5387
            </a>
            <a
              href="mailto:Americanlegion318@yahoo.com"
              className="inline-flex items-center gap-2 rounded-lg bg-gold px-6 py-3 text-gold-foreground hover:bg-gold/90 transition-colors"
            >
              <Mail className="h-5 w-5" />
              Americanlegion318@yahoo.com
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Officers;
