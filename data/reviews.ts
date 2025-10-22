export interface Review {
  stars: number;
  rating: string;
  verified: boolean;
  title: string;
  body: string;
  recommend: boolean;
  author: string;
  date: string;
}

export const reviews: Review[] = [
  {
    stars: 5,
    rating: "5.0/5.0",
    verified: true,
    title: "Brilliant garage",
    body: "I've been here twice. Once for a clutch and once for an mot and the guys are very knowledgeable and welcoming.",
    recommend: true,
    author: "Anthony",
    date: "03/10/25",
  },
  {
    stars: 5,
    rating: "5.0/5.0",
    verified: true,
    title: "The Best Garage Experience I've Had",
    body: "I can't say enough good things about this garage! Kevin, the owner, is one of the most honest and...",
    recommend: true,
    author: "Ritika",
    date: "03/10/25",
  },
  {
    stars: 5,
    rating: "5.0/5.0",
    verified: true,
    title: "Amazing service",
    body: "Very impressed with MOT quick and efficient kept in the loop and informed of everything.",
    recommend: true,
    author: "Customer Review",
    date: "03/10/25",
  },
    {
    stars: 5,
    rating: "5.0/5.0",
    verified: true,
    title: "Brilliant garage",
    body: "I've been here twice. Once for a clutch and once for an mot and the guys are very knowledgeable and welcoming.",
    recommend: true,
    author: "Anthony",
    date: "03/10/25",
  },
  {
    stars: 5,
    rating: "5.0/5.0",
    verified: true,
    title: "The Best Garage Experience I've Had",
    body: "I can't say enough good things about this garage! Kevin, the owner, is one of the most honest and...",
    recommend: true,
    author: "Ritika",
    date: "03/10/25",
  },
  {
    stars: 5,
    rating: "5.0/5.0",
    verified: true,
    title: "Amazing service",
    body: "Very impressed with MOT quick and efficient kept in the loop and informed of everything.",
    recommend: true,
    author: "Customer Review",
    date: "03/10/25",
  },
];
