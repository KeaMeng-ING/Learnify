export const pricingPlans = [
  {
    id: "basic",
    name: "Basic",
    description: "Perfect for occasional use",
    price: 9,
    items: [
      "5 summaries per month",
      "Standard Processing Speed",
      "Email Support",
    ],
    paymentLink: "https://buy.stripe.com/test_9B628r0wt1eW8YVbHC97G00",
    priceId: "price_1RiXAAFKFEDTLG9rfn3BuE2W",
  },
  {
    id: "pro",
    name: "Pro",
    price: 19,
    description: "For professionals and teams",
    items: [
      "Unlimited PDF summaries",
      "Priority processing",
      "24/7 priority support",
      "Markdown Export",
    ],
    paymentLink: "https://buy.stripe.com/test_8x27sLbb78Ho4IFbHC97G01",
    priceId: "price_1RiXAAFKFEDTLG9rP09lWaVa",
  },
];

export const sampleQuestions = [
  {
    id: "q1",
    question:
      "What is the primary advantage of Next.js over traditional React applications?",
    answer:
      "Next.js provides server-side rendering (SSR) and static site generation (SSG) out of the box, improving SEO and initial page load performance compared to client-side only React apps.",
    quizId: "demo",
  },
  {
    id: "q2",
    question:
      "What is the difference between getStaticProps and getServerSideProps in Next.js?",
    answer:
      "getStaticProps runs at build time and generates static pages, while getServerSideProps runs on each request on the server, allowing for dynamic content that changes frequently.",
    quizId: "demo",
  },
  {
    id: "q3",
    question: "How does Next.js handle automatic code splitting?",
    answer:
      "Next.js automatically splits your code by pages, meaning each page only loads the JavaScript it needs. It also supports dynamic imports for further code splitting within components.",
    quizId: "demo",
  },
  {
    id: "q4",
    question:
      "What is the App Router in Next.js 13+ and how does it differ from the Pages Router?",
    answer:
      "The App Router uses the app/ directory and supports React Server Components, nested layouts, and streaming. It provides better performance and developer experience compared to the traditional pages/ directory approach.",
    quizId: "demo",
  },
  {
    id: "q5",
    question:
      "Explain the concept of Incremental Static Regeneration (ISR) in Next.js",
    answer:
      "ISR allows you to update static content after build time without rebuilding the entire site. Pages can be regenerated in the background when traffic comes in, combining the benefits of static and dynamic rendering.",
    quizId: "demo",
  },
];
