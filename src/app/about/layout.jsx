export const metadata = {
  title: 'About Us',
  description: 'Discover the story behind The Exotica Agonda, a coastal paradise offering a blend of modern luxury and natural splendor in South Goa.',
  openGraph: {
    title: 'About The Exotica Agonda',
    description: 'A sublime retreat for travelers seeking a harmonious blend of modern luxury and natural splendor near Agonda Beach.',
  }
};

export default function AboutLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "mainEntity": {
      "@type": "Hotel",
      "name": "The Exotica Agonda"
    }
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
