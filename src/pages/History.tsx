import Layout from "@/components/layout/Layout";
import { Star, Flag, Shield, Award } from "lucide-react";

const milestones = [
  { year: "1919", title: "American Legion Chartered", description: "The American Legion was chartered by Congress as a patriotic veterans organization, focusing on service to veterans, service members, and communities." },
  { year: "1940", title: "Parkville Post #318 Chartered", description: "The Parkville American Legion Post #318 was officially chartered, beginning its service to local veterans and the community." },
  { year: "1945", title: "Post Commander Robbins", description: "Leon A. Robbins served his second term as Post Commander. He was a charter member, first commander in 1941, and professor at Park College." },
  { year: "1961", title: "Robbins Passes", description: "Leon A. Robbins, charter member, first commander, and three-time Parkville mayor, passed away leaving a lasting legacy." },
  { year: "1985", title: "Post Renamed", description: "Post #318 adopted a new name: The Leon A. Robbins Memorial Post Number 318, honoring the distinguished veteran and co-founder." },
];

const History = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="hero-gradient py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <Star className="mx-auto mb-4 h-10 w-10 text-gold" fill="currentColor" />
          <h1 className="mb-4 text-4xl font-bold text-primary-foreground font-serif md:text-5xl">
            Our History
          </h1>
          <p className="mx-auto max-w-2xl text-primary-foreground/80">
            Over a century of service to veterans, families, and community.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 flex items-center gap-4">
              <Flag className="h-8 w-8 text-accent" />
              <h2 className="text-2xl font-bold font-serif md:text-3xl">Our Story</h2>
            </div>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <h3 className="text-xl font-bold font-serif text-foreground mb-4">The American Legion's History</h3>
              <p className="mb-6">
                The American Legion was chartered by Congress in 1919 as a patriotic veterans organization.
                Focusing on service to veterans, service members, and communities, the Legion evolved from
                a group of war weary veterans of World War I into one of the most influential nonprofit
                groups in the United States. Membership quickly grew to over 1 million, and local posts
                sprang up across the country. Today, membership stands at over 2.4 million in 14,000 posts
                worldwide. The posts are organized into 55 departments: one each for the 50 states, along
                with the District of Columbia, Puerto Rico, France, Mexico, and the Philippines.
              </p>

              <h3 className="text-xl font-bold font-serif text-foreground mb-4 mt-8">Parkville, MO Post #318's History</h3>
              <p className="mb-6">
                The Parkville American Legion Post #318 was chartered in 1940. In 1985, Post #318 adopted
                a new name: The Leon A. Robbins Memorial Post Number 318. Mr. Robbins was a charter member
                of the post in 1940. He served as the post's first Commander in 1941 and again in 1945.
                At Park College, Robbins was a professor and chairman of the mathematics department. He
                passed in 1961.
              </p>

              <p className="mb-6">
                In proposing naming the Post #318 after him, Raymond Paeth, Chaplain, said the majority of
                the posts in the district were named for veterans. "It is only fitting and proper," the
                renaming resolution reads, "that the American Legion Post 318 should honor a distinguished
                veteran, co-founder, charter member, and first post commander, and three-time Parkville mayor."
                The resolution changing the post name passed on February 14, 1985.
              </p>

              <p>
                Over the years, Post #318 has supported its community, assisted veterans, and encouraged
                patriotism. The post continues to grow and support veterans and our community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-muted py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <Shield className="mx-auto mb-4 h-10 w-10 text-primary" />
            <h2 className="text-2xl font-bold font-serif md:text-3xl">Key Milestones</h2>
          </div>
          <div className="mx-auto max-w-3xl">
            <div className="relative border-l-4 border-gold pl-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="relative mb-10 last:mb-0">
                  <div className="absolute -left-[2.65rem] flex h-8 w-8 items-center justify-center rounded-full bg-gold">
                    <span className="text-xs font-bold text-gold-foreground">
                      {milestone.year.slice(-2)}
                    </span>
                  </div>
                  <div className="rounded-lg bg-card p-6 shadow-card">
                    <div className="mb-1 text-sm font-bold text-gold">{milestone.year}</div>
                    <h3 className="mb-2 text-lg font-bold font-serif">{milestone.title}</h3>
                    <p className="text-muted-foreground">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <Award className="mx-auto mb-4 h-10 w-10 text-primary" />
            <h2 className="mb-8 text-2xl font-bold font-serif md:text-3xl">Four Pillars of Service</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {["Veterans Affairs", "National Security", "Americanism", "Children & Youth"].map((pillar, index) => (
                <div key={index} className="rounded-lg border-2 border-primary/20 p-6 hover:border-gold transition-colors">
                  <h3 className="text-lg font-bold font-serif text-primary">{pillar}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default History;
