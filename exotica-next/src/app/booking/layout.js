export const metadata = {
  title: "Book Your Stay",
  description: "Book a cottage or room at The Exotica Agonda — select your dates, choose your room, and confirm your booking. Just 1 minute from Agonda Beach, South Goa.",
  keywords: ["Book Agonda Resort", "Book Goa Hotel", "Exotica Agonda Booking", "Agonda Beach Accommodation"],
  openGraph: {
    title: "Book Your Stay — The Exotica Agonda",
    description: "Reserve your coastal retreat at The Exotica Agonda. Pick your room and travel dates today.",
    images: [{ url: "https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&q=80&w=1200" }],
  },
  robots: {
    index: false, // Don't index the booking page specifically
    follow: true,
  },
};

export default function BookingLayout({ children }) {
  return children;
}
