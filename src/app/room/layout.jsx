export const metadata = {
  title: 'Luxurious Rooms & Cottages',
  description: 'Explore our Garden AC Cottages and Garden View Cottages at The Exotica Agonda, equipped with modern amenities.',
  openGraph: {
    title: 'Rooms & Cottages at The Exotica Agonda',
    description: 'Find the perfect accommodation tailored for your comfort near Agonda Beach.',
  }
};

export default function RoomLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "item": {
          "@type": "HotelRoom",
          "name": "Garden AC Cottages"
        }
      }
    ]
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
