// ─── Navigation ────────────────────────────────────────────────────────────────
export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/search", label: "Explore" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/dashboard", label: "Host Dashboard" },
  { href: "/profile", label: "Profile" },
];

// ─── Types ─────────────────────────────────────────────────────────────────────
export type PropertyType = "room" | "house" | "hostel" | "apartment" | "villa";

export interface Amenity {
  icon: string;
  label: string;
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Host {
  id: string;
  name: string;
  avatar: string;
  joinedYear: number;
  reviewCount: number;
  isSuperhost: boolean;
  bio: string;
}

export interface Property {
  id: string;
  title: string;
  type: PropertyType;
  location: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  pricePerNight: number;
  rating: number;
  reviewCount: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  image: string;
  images: string[];
  description: string;
  amenities: Amenity[];
  host: Host;
  reviews: Review[];
  isFeatured: boolean;
  isWishlisted: boolean;
  category: string;
  instantBook: boolean;
}

export interface Booking {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  location: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  pricePerNight: number;
  totalPrice: number;
  status: "confirmed" | "pending" | "cancelled" | "completed";
  hostName: string;
  bookedOn: string;
}

export interface Category {
  id: string;
  label: string;
  icon: string;
  description: string;
}

// ─── Categories ────────────────────────────────────────────────────────────────
export const categories: Category[] = [
  { id: "trending", label: "Trending", icon: "🔥", description: "Most popular right now" },
  { id: "beach", label: "Beach", icon: "🏖️", description: "Stays near the ocean" },
  { id: "mountains", label: "Mountains", icon: "⛰️", description: "Scenic mountain retreats" },
  { id: "city", label: "City", icon: "🏙️", description: "Urban city stays" },
  { id: "hostel", label: "Hostel", icon: "🛏️", description: "Budget-friendly hostels" },
  { id: "entire-home", label: "Entire Home", icon: "🏠", description: "Whole house to yourself" },
  { id: "private-room", label: "Private Room", icon: "🚪", description: "Your own private space" },
  { id: "villa", label: "Villa", icon: "🏡", description: "Luxury villa escapes" },
  { id: "countryside", label: "Countryside", icon: "🌿", description: "Peaceful rural getaways" },
  { id: "lakefront", label: "Lakefront", icon: "🏞️", description: "Stunning lake views" },
];

// ─── Hosts ─────────────────────────────────────────────────────────────────────
export const hosts: Host[] = [
  {
    id: "h1",
    name: "Sarah Mitchell",
    avatar: "https://www.velaw.com/wp-content/uploads/2022/01/103014_Mitchell_4x5_web-465x581.jpg",
    joinedYear: 2018,
    reviewCount: 142,
    isSuperhost: true,
    bio: "Hi! I'm Sarah, a travel enthusiast who loves sharing my beautiful spaces with guests from around the world. I'm always available to help make your stay perfect.",
  },
  {
    id: "h2",
    name: "James Okafor",
    avatar: "/images/host-james-okafor.jpg",
    joinedYear: 2019,
    reviewCount: 89,
    isSuperhost: true,
    bio: "Welcome! I'm James, a local architect who designed and renovated my properties with comfort and style in mind. I love meeting new people and sharing local tips.",
  },
  {
    id: "h3",
    name: "Mei Lin",
    avatar: "/images/host-mei-lin.jpg",
    joinedYear: 2020,
    reviewCount: 67,
    isSuperhost: false,
    bio: "Hello! I'm Mei, a hospitality professional with a passion for creating cozy, welcoming spaces. My home is your home — I want every guest to feel truly at ease.",
  },
  {
    id: "h4",
    name: "Carlos Rivera",
    avatar: "/images/host-carlos-rivera.jpg",
    joinedYear: 2017,
    reviewCount: 203,
    isSuperhost: true,
    bio: "Hola! I'm Carlos, born and raised in Barcelona. I've been hosting for 7 years and love introducing guests to the best local spots, food, and culture.",
  },
];

// ─── Properties ────────────────────────────────────────────────────────────────
export const properties: Property[] = [
  {
    id: "p1",
    title: "Cozy Beachfront Studio in Malibu",
    type: "room",
    location: "Malibu, California",
    city: "Malibu",
    country: "United States",
    lat: 34.0259,
    lng: -118.7798,
    pricePerNight: 189,
    rating: 4.92,
    reviewCount: 87,
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    image: "/images/beachfront-studio-malibu.jpg",
    images: [
      "/images/beachfront-studio-malibu.jpg",
      "/images/beachfront-studio-malibu-interior.jpg",
      "/images/beachfront-studio-malibu-view.jpg",
      "/images/beachfront-studio-malibu-bathroom.jpg",
    ],
    description:
      "Wake up to the sound of waves in this stunning beachfront studio. Floor-to-ceiling windows frame breathtaking Pacific Ocean views. The space features a king bed, fully equipped kitchenette, and a private deck perfect for sunset watching. Steps from the sand, this is the ultimate California coastal escape.",
    amenities: [
      { icon: "🌊", label: "Ocean View" },
      { icon: "🍳", label: "Kitchenette" },
      { icon: "📶", label: "Fast WiFi" },
      { icon: "🅿️", label: "Free Parking" },
      { icon: "❄️", label: "Air Conditioning" },
      { icon: "🏖️", label: "Beach Access" },
    ],
    host: hosts[0],
    reviews: [
      {
        id: "r1",
        author: "Emma T.",
        avatar: "/images/reviewer-emma.jpg",
        rating: 5,
        date: "November 2024",
        comment: "Absolutely magical! Woke up to the most beautiful sunrise over the ocean. Sarah was incredibly responsive and the space was spotless. Will definitely return!",
      },
      {
        id: "r2",
        author: "Michael R.",
        avatar: "/images/reviewer-michael.jpg",
        rating: 5,
        date: "October 2024",
        comment: "Perfect romantic getaway. The views are even better in person. Everything was exactly as described. Highly recommend!",
      },
    ],
    isFeatured: true,
    isWishlisted: false,
    category: "beach",
    instantBook: true,
  },
  {
    id: "p2",
    title: "Modern Loft in Downtown Manhattan",
    type: "apartment",
    location: "New York City, New York",
    city: "New York City",
    country: "United States",
    lat: 40.7128,
    lng: -74.006,
    pricePerNight: 245,
    rating: 4.85,
    reviewCount: 124,
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1,
    image: "/images/modern-loft-manhattan.jpg",
    images: [
      "/images/modern-loft-manhattan.jpg",
      "/images/modern-loft-manhattan-living.jpg",
      "/images/modern-loft-manhattan-bedroom.jpg",
      "/images/modern-loft-manhattan-kitchen.jpg",
    ],
    description:
      "Experience New York City living at its finest in this sleek industrial loft in the heart of Manhattan. Exposed brick walls, soaring ceilings, and designer furnishings create an unforgettable urban retreat. Walking distance to Times Square, Central Park, and world-class dining.",
    amenities: [
      { icon: "🏙️", label: "City View" },
      { icon: "🍳", label: "Full Kitchen" },
      { icon: "📶", label: "Fast WiFi" },
      { icon: "🧺", label: "Washer/Dryer" },
      { icon: "❄️", label: "Air Conditioning" },
      { icon: "🛗", label: "Elevator" },
    ],
    host: hosts[1],
    reviews: [
      {
        id: "r3",
        author: "Sophie L.",
        avatar: "/images/reviewer-sophie.jpg",
        rating: 5,
        date: "December 2024",
        comment: "James's loft is incredible — the photos don't do it justice. Perfect location, immaculate space, and James was super helpful with restaurant recommendations.",
      },
    ],
    isFeatured: true,
    isWishlisted: true,
    category: "city",
    instantBook: true,
  },
  {
    id: "p3",
    title: "Charming Tuscan Villa with Pool",
    type: "villa",
    location: "Florence, Tuscany",
    city: "Florence",
    country: "Italy",
    lat: 43.7696,
    lng: 11.2558,
    pricePerNight: 420,
    rating: 4.97,
    reviewCount: 56,
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 3,
    image: "/images/tuscan-villa-florence-pool.jpg",
    images: [
      "/images/tuscan-villa-florence-pool.jpg",
      "/images/tuscan-villa-florence-interior.jpg",
      "/images/tuscan-villa-florence-garden.jpg",
      "/images/tuscan-villa-florence-bedroom.jpg",
    ],
    description:
      "Immerse yourself in the timeless beauty of Tuscany in this stunning 16th-century villa. Set among rolling vineyards with a private pool, outdoor dining terrace, and panoramic views of the Florentine hills. The perfect base for wine tours, cooking classes, and exploring Renaissance art.",
    amenities: [
      { icon: "🏊", label: "Private Pool" },
      { icon: "🍷", label: "Wine Cellar" },
      { icon: "🌿", label: "Garden" },
      { icon: "🍳", label: "Full Kitchen" },
      { icon: "🔥", label: "Fireplace" },
      { icon: "🅿️", label: "Free Parking" },
    ],
    host: hosts[3],
    reviews: [
      {
        id: "r4",
        author: "David K.",
        avatar: "/images/reviewer-david.jpg",
        rating: 5,
        date: "September 2024",
        comment: "A dream come true. The villa is even more beautiful than the photos. Carlos arranged a private wine tasting for us — absolutely unforgettable trip.",
      },
    ],
    isFeatured: true,
    isWishlisted: false,
    category: "villa",
    instantBook: false,
  },
  {
    id: "p4",
    title: "Budget Hostel Dorm in Barcelona",
    type: "hostel",
    location: "Barcelona, Catalonia",
    city: "Barcelona",
    country: "Spain",
    lat: 41.3851,
    lng: 2.1734,
    pricePerNight: 28,
    rating: 4.7,
    reviewCount: 312,
    maxGuests: 1,
    bedrooms: 1,
    bathrooms: 1,
    image: "https://images.trvl-media.com/lodging/112000000/111440000/111438000/111437994/8c474f10.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill",
    images: [
      "https://images.trvl-media.com/lodging/112000000/111440000/111438000/111437994/8c474f10.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill",
      "/images/hostel-dorm-barcelona-common.jpg",
      "/images/hostel-dorm-barcelona-rooftop.jpg",
    ],
    description:
      "The best-rated hostel in Barcelona's vibrant Gothic Quarter! Our social hostel features comfortable pod-style bunk beds with privacy curtains, personal lockers, and a rooftop terrace with stunning city views. Meet fellow travelers at our nightly events and free walking tours.",
    amenities: [
      { icon: "🔒", label: "Personal Locker" },
      { icon: "📶", label: "Fast WiFi" },
      { icon: "🏠", label: "Common Room" },
      { icon: "🌇", label: "Rooftop Terrace" },
      { icon: "🍳", label: "Shared Kitchen" },
      { icon: "🎉", label: "Social Events" },
    ],
    host: hosts[3],
    reviews: [
      {
        id: "r5",
        author: "Alex P.",
        avatar: "/images/reviewer-alex.jpg",
        rating: 5,
        date: "January 2025",
        comment: "Best hostel experience ever! Met amazing people, the rooftop is incredible, and the location is perfect for exploring Barcelona. Carlos and his team are fantastic hosts.",
      },
    ],
    isFeatured: true,
    isWishlisted: false,
    category: "hostel",
    instantBook: true,
  },
  {
    id: "p5",
    title: "Lakefront Cabin in the Swiss Alps",
    type: "house",
    location: "Interlaken, Bern",
    city: "Interlaken",
    country: "Switzerland",
    lat: 46.6863,
    lng: 7.8632,
    pricePerNight: 310,
    rating: 4.94,
    reviewCount: 78,
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2,
    image: "/images/lakefront-cabin-swiss-alps.jpg",
    images: [
      "/images/lakefront-cabin-swiss-alps.jpg",
      "/images/lakefront-cabin-swiss-alps-interior.jpg",
      "/images/lakefront-cabin-swiss-alps-lake.jpg",
      "/images/lakefront-cabin-swiss-alps-deck.jpg",
    ],
    description:
      "A fairytale escape in the heart of the Swiss Alps. This traditional wooden cabin sits directly on the shores of Lake Thun with jaw-dropping views of the Eiger, Mönch, and Jungfrau peaks. Perfect for skiing in winter and hiking, kayaking, and paragliding in summer.",
    amenities: [
      { icon: "🏔️", label: "Mountain View" },
      { icon: "🚣", label: "Lake Access" },
      { icon: "🔥", label: "Wood Fireplace" },
      { icon: "🍳", label: "Full Kitchen" },
      { icon: "🛁", label: "Hot Tub" },
      { icon: "🎿", label: "Ski Storage" },
    ],
    host: hosts[2],
    reviews: [
      {
        id: "r6",
        author: "Hannah W.",
        avatar: "/images/reviewer-hannah.jpg",
        rating: 5,
        date: "February 2025",
        comment: "Woke up to snow-capped mountains and a frozen lake — pure magic. The cabin is cozy, well-equipped, and Mei was incredibly helpful. Already planning our return trip!",
      },
    ],
    isFeatured: true,
    isWishlisted: true,
    category: "mountains",
    instantBook: false,
  },
  {
    id: "p6",
    title: "Private Room in Tokyo Townhouse",
    type: "room",
    location: "Shinjuku, Tokyo",
    city: "Tokyo",
    country: "Japan",
    lat: 35.6938,
    lng: 139.7034,
    pricePerNight: 95,
    rating: 4.88,
    reviewCount: 201,
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    image: "/images/private-room-tokyo-townhouse.jpg",
    images: [
      "/images/private-room-tokyo-townhouse.jpg",
      "/images/private-room-tokyo-townhouse-room.jpg",
      "/images/private-room-tokyo-townhouse-garden.jpg",
    ],
    description:
      "Experience authentic Tokyo living in this beautifully preserved traditional townhouse (machiya) in the heart of Shinjuku. Your private tatami room features a futon bed, shoji screens, and access to a serene Japanese garden. Minutes from world-class dining, shopping, and nightlife.",
    amenities: [
      { icon: "🌸", label: "Japanese Garden" },
      { icon: "🛁", label: "Shared Onsen Bath" },
      { icon: "📶", label: "Fast WiFi" },
      { icon: "🍵", label: "Tea Ceremony" },
      { icon: "🚇", label: "Near Metro" },
      { icon: "🧹", label: "Daily Cleaning" },
    ],
    host: hosts[2],
    reviews: [
      {
        id: "r7",
        author: "Lucas M.",
        avatar: "/images/reviewer-lucas.jpg",
        rating: 5,
        date: "March 2025",
        comment: "An absolutely unique experience. Sleeping on a futon in a traditional machiya was a highlight of our Japan trip. Mei is a wonderful host who made us feel so welcome.",
      },
    ],
    isFeatured: false,
    isWishlisted: false,
    category: "city",
    instantBook: true,
  },
  {
    id: "p7",
    title: "Entire Beachhouse in Bali",
    type: "house",
    location: "Seminyak, Bali",
    city: "Seminyak",
    country: "Indonesia",
    lat: -8.6905,
    lng: 115.1609,
    pricePerNight: 175,
    rating: 4.91,
    reviewCount: 143,
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2,
    image: "/images/beachhouse-bali-seminyak.jpg",
    images: [
      "/images/beachhouse-bali-seminyak.jpg",
      "/images/beachhouse-bali-seminyak-pool.jpg",
      "/images/beachhouse-bali-seminyak-bedroom.jpg",
      "/images/beachhouse-bali-seminyak-terrace.jpg",
    ],
    description:
      "Your own tropical paradise in Bali's most stylish beach village. This stunning 3-bedroom villa features a private infinity pool, lush tropical garden, and open-air living spaces. Steps from Seminyak's famous beach clubs, boutiques, and world-class restaurants.",
    amenities: [
      { icon: "🏊", label: "Infinity Pool" },
      { icon: "🌴", label: "Tropical Garden" },
      { icon: "🏖️", label: "Beach Access" },
      { icon: "🍳", label: "Full Kitchen" },
      { icon: "🛵", label: "Scooter Rental" },
      { icon: "🧘", label: "Yoga Deck" },
    ],
    host: hosts[0],
    reviews: [
      {
        id: "r8",
        author: "Priya S.",
        avatar: "/images/reviewer-priya.jpg",
        rating: 5,
        date: "April 2025",
        comment: "Absolute paradise! The infinity pool overlooking the rice fields is unreal. Sarah arranged a private chef for one evening — best meal of our lives. 10/10!",
      },
    ],
    isFeatured: true,
    isWishlisted: false,
    category: "beach",
    instantBook: true,
  },
  {
    id: "p8",
    title: "Cozy Mountain Chalet in Chamonix",
    type: "house",
    location: "Chamonix, Haute-Savoie",
    city: "Chamonix",
    country: "France",
    lat: 45.9237,
    lng: 6.8694,
    pricePerNight: 265,
    rating: 4.89,
    reviewCount: 92,
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 3,
    image: "/images/mountain-chalet-chamonix.jpg",
    images: [
      "/images/mountain-chalet-chamonix.jpg",
      "/images/mountain-chalet-chamonix-interior.jpg",
      "/images/mountain-chalet-chamonix-view.jpg",
    ],
    description:
      "A classic Alpine chalet at the foot of Mont Blanc. This spacious 4-bedroom retreat features exposed timber beams, a stone fireplace, and a sauna. Ski-in/ski-out access to the Chamonix valley's legendary slopes. Perfect for groups and families seeking the ultimate mountain adventure.",
    amenities: [
      { icon: "🎿", label: "Ski-in/Ski-out" },
      { icon: "🧖", label: "Private Sauna" },
      { icon: "🔥", label: "Stone Fireplace" },
      { icon: "🍳", label: "Full Kitchen" },
      { icon: "🏔️", label: "Mont Blanc View" },
      { icon: "🅿️", label: "Garage Parking" },
    ],
    host: hosts[1],
    reviews: [
      {
        id: "r9",
        author: "Tom B.",
        avatar: "/images/reviewer-tom.jpg",
        rating: 5,
        date: "January 2025",
        comment: "The chalet of our dreams! Ski-in/ski-out access is incredible, the sauna after a long day on the slopes is heaven, and James was an amazing host. Booked again for next season!",
      },
    ],
    isFeatured: false,
    isWishlisted: true,
    category: "mountains",
    instantBook: false,
  },
];

// ─── Mock Bookings ──────────────────────────────────────────────────────────────
export const mockBookings: Booking[] = [
  {
    id: "b1",
    propertyId: "p2",
    propertyTitle: "Modern Loft in Downtown Manhattan",
    propertyImage: "/images/modern-loft-manhattan.jpg",
    location: "New York City, New York",
    checkIn: "2025-06-15",
    checkOut: "2025-06-20",
    guests: 2,
    nights: 5,
    pricePerNight: 245,
    totalPrice: 1225,
    status: "confirmed",
    hostName: "James Okafor",
    bookedOn: "2025-05-10",
  },
  {
    id: "b2",
    propertyId: "p5",
    propertyTitle: "Lakefront Cabin in the Swiss Alps",
    propertyImage: "/images/lakefront-cabin-swiss-alps.jpg",
    location: "Interlaken, Switzerland",
    checkIn: "2025-08-01",
    checkOut: "2025-08-08",
    guests: 4,
    nights: 7,
    pricePerNight: 310,
    totalPrice: 2170,
    status: "pending",
    hostName: "Mei Lin",
    bookedOn: "2025-05-20",
  },
  {
    id: "b3",
    propertyId: "p4",
    propertyTitle: "Budget Hostel Dorm in Barcelona",
    propertyImage: "https://images.trvl-media.com/lodging/112000000/111440000/111438000/111437994/8c474f10.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill",
    location: "Barcelona, Spain",
    checkIn: "2025-03-10",
    checkOut: "2025-03-15",
    guests: 1,
    nights: 5,
    pricePerNight: 28,
    totalPrice: 140,
    status: "completed",
    hostName: "Carlos Rivera",
    bookedOn: "2025-02-28",
  },
];

// ─── Featured Destinations ──────────────────────────────────────────────────────
export const featuredDestinations = [
  { city: "Bali", country: "Indonesia", image: "/images/destination-bali.jpg", propertyCount: 1240 },
  { city: "Paris", country: "France", image: "/images/destination-paris.jpg", propertyCount: 3820 },
  { city: "Tokyo", country: "Japan", image: "/images/destination-tokyo.jpg", propertyCount: 2150 },
  { city: "New York", country: "USA", image: "/images/destination-new-york.jpg", propertyCount: 4560 },
  { city: "Barcelona", country: "Spain", image: "/images/destination-barcelona.jpg", propertyCount: 1890 },
  { city: "Santorini", country: "Greece", image: "/images/destination-santorini.jpg", propertyCount: 680 },
];

// ─── Stats ──────────────────────────────────────────────────────────────────────
export const siteStats = [
  { label: "Properties Listed", value: "2M+", description: "Unique stays worldwide" },
  { label: "Happy Guests", value: "50M+", description: "Travelers hosted globally" },
  { label: "Countries", value: "190+", description: "Destinations available" },
  { label: "Superhosts", value: "500K+", description: "Verified top-rated hosts" },
];