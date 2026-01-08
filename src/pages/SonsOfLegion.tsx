import Layout from "@/components/layout/Layout";
import { Star, Users, Heart, Award, Flag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const pillars = [
  { icon: Users, title: "Veterans Affairs & Rehabilitation" },
  { icon: Flag, title: "National Security" },
  { icon: Star, title: "Americanism" },
  { icon: Heart, title: "Children & Youth" },
];

const SonsOfLegion = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="hero-gradient py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <Star className="mx-auto mb-4 h-10 w-10 text-gold" fill="currentColor" />
          <h1 className="mb-4 text-4xl font-bold text-primary-foreground font-serif md:text-5xl">
            Sons of The American Legion
          </h1>
          <p className="mx-auto max-w-2xl text-primary-foreground/80">
            Honoring the service and sacrifice of Legionnaires
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 text-2xl font-bold font-serif md:text-3xl text-center">About S.A.L.</h2>

            <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
              <p>
                The Sons of The American Legion, often referred to as "S.A.L.," was founded in 1932,
                and exists to honor the service and sacrifice of Legionnaires.
              </p>

              <p>
                S.A.L. members include males of all ages whose parents or grandparents served in the U.S.
                military and were eligible for American Legion membership. Members of The American Legion,
                American Legion Auxiliary and S.A.L. comprise the Legion Family, which has a combined
                membership of nearly 3 million.
              </p>

              <p>
                Although S.A.L. has its own membership, the organization is not a separate entity. Rather,
                S.A.L. is a program of The American Legion. Many Legionnaires hold dual membership in S.A.L.
              </p>

              <p>
                The S.A.L.'s organization is divided into detachments at the state level and squadrons at
                the local level. A squadron pairs with a local American Legion, here Post #318. However,
                squadrons can determine the extent of their services to the community, state and nation.
                They are permitted flexibility in planning programs and activities to meet their needs, but
                must remember S.A.L.'s mission: to strengthen the four pillars of The American Legion.
                Therefore, squadrons' campaigns place an emphasis on preserving American traditions and values,
                improving the quality of life for our nation's children, caring for veterans and their families,
                and teaching the fundamentals of good citizenship.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Four Pillars */}
      <section className="bg-muted py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="mb-4 text-center text-2xl font-bold font-serif md:text-3xl">
            The Four Pillars of The American Legion
          </h2>
          <p className="mb-12 text-center text-muted-foreground max-w-2xl mx-auto">
            S.A.L.'s mission is to strengthen these four pillars through service and dedication
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
            {pillars.map((pillar, index) => (
              <Card key={index} className="shadow-card hover:shadow-elevated transition-shadow text-center border-t-4 border-t-gold">
                <CardContent className="p-6">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
                    <pillar.icon className="h-8 w-8 text-gold" />
                  </div>
                  <h3 className="text-sm font-bold font-serif">{pillar.title}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Accomplishments */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 text-2xl font-bold font-serif md:text-3xl text-center">Our Impact</h2>

            <div className="grid gap-6 md:grid-cols-3 mb-8">
              <Card className="shadow-card text-center p-6 border-t-4 border-t-gold">
                <div className="text-3xl font-bold text-gold mb-2">$6M+</div>
                <p className="text-sm text-muted-foreground">Raised for Child Welfare Foundation since 1988</p>
              </Card>
              <Card className="shadow-card text-center p-6 border-t-4 border-t-gold">
                <div className="text-3xl font-bold text-gold mb-2">500K+</div>
                <p className="text-sm text-muted-foreground">Volunteer hours at veterans hospitals</p>
              </Card>
              <Card className="shadow-card text-center p-6 border-t-4 border-t-gold">
                <div className="text-3xl font-bold text-gold mb-2">$1M+</div>
                <p className="text-sm text-muted-foreground">Raised for VA hospitals and homes</p>
              </Card>
            </div>

            <div className="text-center text-muted-foreground">
              <p>
                The Sons also support the Citizens Flag Alliance, a coalition dedicated to protecting
                the U.S. flag from desecration through a constitutional amendment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Membership Eligibility */}
      <section className="bg-primary py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <Star className="mx-auto mb-6 h-12 w-12 text-gold" fill="currentColor" />
            <h2 className="mb-6 text-2xl font-bold text-primary-foreground font-serif md:text-3xl text-center">
              Membership Eligibility Requirements
            </h2>
            <div className="rounded-lg bg-primary-foreground/10 p-6 md:p-8">
              <p className="text-primary-foreground/90 mb-4">
                All male descendants, adopted sons, and stepsons of members of The American Legion,
                and such male descendants of veterans who died in service during World War I, and
                December 7, 1941, to date, as set forth in Article IV, Section 1, of the National
                Constitution of The American Legion, or who died subsequent to their honorable discharge
                from such service, shall be eligible for membership in the Sons of The American Legion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Preamble */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 text-2xl font-bold font-serif md:text-3xl text-center">Preamble</h2>

            <div className="rounded-lg bg-muted p-6 md:p-8">
              <p className="text-muted-foreground italic mb-6">
                Proud possessors of a priceless heritage, we male descendants of veterans of the Great Wars,
                associate ourselves together as "Sons of The American Legion" for the following purposes:
              </p>

              <div className="text-muted-foreground space-y-4">
                <p>
                  To uphold and defend the Constitution of the United States of America; to maintain law and order;
                  to foster and perpetuate a true spirit of Americanism; to preserve the memories of our former
                  members and the association of our members and our forefathers in all wars; to inculcate a sense
                  of individual obligation to the Community, State and Nation; to combat the autocracy of both the
                  classes and the masses; to make right the master of might; to promote peace and good will on earth;
                  to safeguard and transmit to posterity the principles of justice, freedom and democracy, to consecrate
                  and sanctify our friendship by our devotion to mutual helpfulness; to adopt in letter and spirit all
                  of the great principles for which The American Legion stands; and to assist in carrying on for God and Country.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-2xl font-bold font-serif">Join Squadron #318</h2>
          <p className="mb-6 text-muted-foreground max-w-xl mx-auto">
            Interested in joining the Sons of The American Legion at Post #318?
            Contact us to learn more about membership.
          </p>
          <a
            href="mailto:Americanlegion318@yahoo.com"
            className="inline-flex items-center gap-2 rounded-lg bg-gold px-6 py-3 text-gold-foreground hover:bg-gold/90 transition-colors font-semibold"
          >
            Contact Us
          </a>
        </div>
      </section>
    </Layout>
  );
};

export default SonsOfLegion;
