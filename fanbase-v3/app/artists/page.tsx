import Layout from "../components/Layout";
import Image from "next/image";

// Sample artist data
const artists = [
  { id: 1, name: "Burna Boy", image: "/artist_cards/burnaboy.jpg" },
  { id: 2, name: "Burna Boy", image: "/artist_cards/burnaboy.jpg" },
  { id: 3, name: "Burna Boy", image: "/artist_cards/burnaboy.jpg" },
  { id: 4, name: "Burna Boy", image: "/artist_cards/burnaboy.jpg" },
  { id: 5, name: "Burna Boy", image: "/artist_cards/burnaboy.jpg" },
  { id: 6, name: "Burna Boy", image: "/artist_cards/burnaboy.jpg" },
  { id: 7, name: "Burna Boy", image: "/artist_cards/burnaboy.jpg" },
  { id: 8, name: "Burna Boy", image: "/artist_cards/burnaboy.jpg" },
  { id: 9, name: "Burna Boy", image: "/artist_cards/burnaboy.jpg" },
];

function ArtistCard({ artist }: { artist: { id: number; name: string; image: string } }) {
  return (
    <div className="relative h-48 w-full rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-xl">
      <Image
        src={artist.image}
        alt={artist.name}
        fill
        className="object-cover"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-center py-2">
        <h3 className="font-bold text-lg">{artist.name}</h3>
      </div>
    </div>
  );
}

export default function ArtistsPage() {
  return (
    <Layout>
      <div className="p-8">
        {/* Search Bar */}
        <div className="flex justify-center mb-10">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search for an artist..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1016.65 2a7.5 7.5 0 000 15z"
              />
            </svg>
          </div>
        </div>

        {/* Page Title and Description */}
        <h1 className="text-3xl font-bold mb-4 text-center">Upcoming Artists</h1>
        <p className="text-gray-600 mb-8 text-center">
          Discover new and emerging artists in the music scene.
        </p>

        {/* Artist Grid */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Featured Artists</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {artists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}
