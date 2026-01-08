import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Star, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface GalleryImage {
  id: string;
  title: string;
  category: string;
  src: string;
  fullSrc?: string;
}

const categories = ["All", "Events", "Facility", "Hall"];

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/gallery");

        if (!response.ok) {
          throw new Error(`Failed to fetch images: ${response.statusText}`);
        }

        const data = await response.json();
        setGalleryImages(data);
      } catch (err) {
        console.error("Error fetching gallery images:", err);
        setError(err instanceof Error ? err.message : "Failed to load images");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const filteredImages = selectedCategory === "All"
    ? galleryImages
    : galleryImages.filter(img => img.category === selectedCategory);

  return (
    <Layout>
      {/* Hero */}
      <section className="hero-gradient py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <Star className="mx-auto mb-4 h-10 w-10 text-gold" fill="currentColor" />
          <h1 className="mb-4 text-4xl font-bold text-primary-foreground font-serif md:text-5xl">
            Photo Gallery
          </h1>
          <p className="mx-auto max-w-2xl text-primary-foreground/80">
            Memories from our events, ceremonies, and community gatherings.
          </p>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {/* Category Filter */}
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-primary/10"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="ml-4 text-muted-foreground">Loading images...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-16">
              <p className="text-red-500 mb-2">Error loading images: {error}</p>
              <p className="text-muted-foreground text-sm">Make sure the backend server is running on http://localhost:5001</p>
            </div>
          )}

          {/* Image Grid */}
          {!loading && !error && (
            <>
              {filteredImages.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {filteredImages.map((image) => (
                    <div
                      key={image.id}
                      onClick={() => setSelectedImage(image)}
                      className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg bg-muted shadow-card hover:shadow-elevated transition-all"
                    >
                      <img
                        src={`http://localhost:5001${image.src}`}
                        alt={image.title}
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.parentElement?.querySelector('.placeholder')?.classList.remove('hidden');
                        }}
                      />
                      <div className="placeholder absolute inset-0 items-center justify-center bg-primary/10 hidden">
                        <Star className="h-12 w-12 text-primary/30" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-primary-foreground transform translate-y-full group-hover:translate-y-0 transition-transform">
                        <p className="text-sm font-medium">{image.title}</p>
                        <p className="text-xs text-gold">{image.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-8 text-center text-muted-foreground">
                  <em>No images found. Check back for photos from our events!</em>
                </p>
              )}
            </>
          )}
        </div>
      </section>

      {/* Lightbox Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden">
          <div className="relative aspect-video bg-muted flex items-center justify-center">
            {selectedImage && (
              <img
                src={`http://localhost:5001${selectedImage.fullSrc || selectedImage.src}`}
                alt={selectedImage.title}
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            )}
            <Star className="h-24 w-24 text-primary/20 absolute" />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 rounded-full bg-primary/80 p-2 text-primary-foreground hover:bg-primary transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {selectedImage && (
            <div className="p-4">
              <h3 className="font-bold font-serif">{selectedImage.title}</h3>
              <p className="text-sm text-muted-foreground">{selectedImage.category}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Gallery;




