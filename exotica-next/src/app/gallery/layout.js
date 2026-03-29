export const metadata = {
  title: "Gallery",
  description: "Browse stunning photos of The Exotica Agonda — our beautiful rooms, beach views, lush gardens, and resort exteriors. Find your perfect Goa getaway.",
  keywords: ["Exotica Agonda Photos", "Goa Resort Gallery", "Agonda Beach Views", "Resort Images Goa"],
  openGraph: {
    title: "Photo Gallery — The Exotica Agonda",
    description: "Explore our gallery of luxurious rooms, scenic beach views, and tropical gardens at The Exotica Agonda, Goa.",
    images: [{ url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1200" }],
  },
};

export default function GalleryLayout({ children }) {
  return children;
}
