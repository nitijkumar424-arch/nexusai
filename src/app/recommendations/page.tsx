'use client';

import { motion } from 'framer-motion';
import { 
  Laptop, 
  BookOpen, 
  Monitor, 
  GraduationCap,
  ExternalLink,
  Star,
  ArrowLeft,
  ShoppingCart
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  rating: number;
  image: string;
  buyLink: string;
  platform: 'amazon' | 'flipkart' | 'udemy' | 'coursera' | 'other';
  badge?: string;
}

interface Category {
  id: string;
  name: string;
  icon: typeof Laptop;
  color: string;
  products: Product[];
}

const categories: Category[] = [
  {
    id: 'tech',
    name: 'Tech & Gadgets',
    icon: Laptop,
    color: 'from-blue-500 to-cyan-500',
    products: [
      {
        id: 't1',
        name: 'Apple MacBook Air M3',
        description: 'Best laptop for developers with incredible performance and battery life',
        price: '₹1,14,900',
        rating: 4.8,
        image: 'https://m.media-amazon.com/images/I/71TPda7cwUL._SL1500_.jpg',
        buyLink: 'https://www.amazon.in/Apple-MacBook-Laptop-chip-13/dp/B0CX22ZW1T',
        platform: 'amazon',
        badge: 'Best Seller'
      },
      {
        id: 't2',
        name: 'Logitech MX Master 3S',
        description: 'Premium wireless mouse with ergonomic design and precision tracking',
        price: '₹9,495',
        rating: 4.7,
        image: 'https://m.media-amazon.com/images/I/61ni3t1ryQL._SL1500_.jpg',
        buyLink: 'https://www.amazon.in/Logitech-Master-Wireless-Mouse-Graphite/dp/B09HM94VDS',
        platform: 'amazon'
      },
      {
        id: 't3',
        name: 'Sony WH-1000XM5',
        description: 'Industry-leading noise cancelling headphones for focused work',
        price: '₹26,990',
        rating: 4.6,
        image: 'https://m.media-amazon.com/images/I/51aXvjzcukL._SL1500_.jpg',
        buyLink: 'https://www.amazon.in/Sony-WH-1000XM5-Cancelling-Headphones-Multi-Point/dp/B09XS7JWHH',
        platform: 'amazon',
        badge: 'Premium'
      },
      {
        id: 't4',
        name: 'Samsung 27" 4K Monitor',
        description: 'Crystal clear display perfect for coding and design work',
        price: '₹27,999',
        rating: 4.5,
        image: 'https://m.media-amazon.com/images/I/71o5Lj7hxrL._SL1500_.jpg',
        buyLink: 'https://www.amazon.in/Samsung-inches-Border-Monitor-LU27R590CWWXXL/dp/B09TPL5FZT',
        platform: 'amazon'
      },
      {
        id: 't5',
        name: 'Keychron K2 Mechanical Keyboard',
        description: 'Wireless mechanical keyboard with Mac/Windows support',
        price: '₹7,999',
        rating: 4.6,
        image: 'https://m.media-amazon.com/images/I/71pf8z0W2QL._SL1500_.jpg',
        buyLink: 'https://www.amazon.in/Keychron-Wireless-Mechanical-Keyboard-Swappable/dp/B08B5WHYTT',
        platform: 'amazon'
      }
    ]
  },
  {
    id: 'books',
    name: 'Books',
    icon: BookOpen,
    color: 'from-green-500 to-emerald-500',
    products: [
      {
        id: 'b1',
        name: 'Clean Code by Robert C. Martin',
        description: 'A must-read for every developer to write better, maintainable code',
        price: '₹2,499',
        rating: 4.7,
        image: 'https://m.media-amazon.com/images/I/51E2055ZGUL._SL1000_.jpg',
        buyLink: 'https://www.amazon.in/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882',
        platform: 'amazon',
        badge: 'Must Read'
      },
      {
        id: 'b2',
        name: 'System Design Interview',
        description: 'Essential guide for cracking system design rounds at top companies',
        price: '₹1,999',
        rating: 4.8,
        image: 'https://m.media-amazon.com/images/I/61OzBO5XVRL._SL1360_.jpg',
        buyLink: 'https://www.amazon.in/System-Design-Interview-insiders-Second/dp/B08CMF2CQF',
        platform: 'amazon',
        badge: 'Top Rated'
      },
      {
        id: 'b3',
        name: 'Designing Data-Intensive Applications',
        description: 'The big ideas behind reliable, scalable, and maintainable systems',
        price: '₹4,299',
        rating: 4.9,
        image: 'https://m.media-amazon.com/images/I/91YfNb49PLL._SL1500_.jpg',
        buyLink: 'https://www.amazon.in/Designing-Data-Intensive-Applications-Reliable-Maintainable/dp/9352135245',
        platform: 'amazon'
      },
      {
        id: 'b4',
        name: 'Atomic Habits by James Clear',
        description: 'Transform your life with tiny changes that deliver remarkable results',
        price: '₹499',
        rating: 4.8,
        image: 'https://m.media-amazon.com/images/I/81F90H7hnML._SL1500_.jpg',
        buyLink: 'https://www.amazon.in/Atomic-Habits-James-Clear/dp/1847941834',
        platform: 'amazon',
        badge: 'Best Seller'
      },
      {
        id: 'b5',
        name: 'The Pragmatic Programmer',
        description: 'Classic book on software development best practices',
        price: '₹2,850',
        rating: 4.7,
        image: 'https://m.media-amazon.com/images/I/71VStSjZmpL._SL1500_.jpg',
        buyLink: 'https://www.amazon.in/Pragmatic-Programmer-journey-mastery-Anniversary/dp/0135957052',
        platform: 'amazon'
      }
    ]
  },
  {
    id: 'workspace',
    name: 'Workspace & Office',
    icon: Monitor,
    color: 'from-purple-500 to-pink-500',
    products: [
      {
        id: 'w1',
        name: 'Green Soul Jupiter Superb Chair',
        description: 'Ergonomic office chair with lumbar support for long coding sessions',
        price: '₹19,999',
        rating: 4.4,
        image: 'https://m.media-amazon.com/images/I/61WniSXlrRL._SL1500_.jpg',
        buyLink: 'https://www.amazon.in/GreenSoul-Jupiter-Superb-Office-Chair/dp/B07KT1TFPF',
        platform: 'amazon',
        badge: 'Ergonomic'
      },
      {
        id: 'w2',
        name: 'IKEA BEKANT Standing Desk',
        description: 'Height-adjustable desk for a healthier work environment',
        price: '₹49,990',
        rating: 4.5,
        image: 'https://www.ikea.com/in/en/images/products/bekant-desk-sit-stand-white__0735960_pe740168_s5.jpg',
        buyLink: 'https://www.ikea.com/in/en/p/bekant-desk-sit-stand-white-s29022238/',
        platform: 'other'
      },
      {
        id: 'w3',
        name: 'BenQ ScreenBar Monitor Light',
        description: 'LED monitor light bar that reduces eye strain during night coding',
        price: '₹8,500',
        rating: 4.6,
        image: 'https://m.media-amazon.com/images/I/51k-FqCfBbL._SL1000_.jpg',
        buyLink: 'https://www.amazon.in/BenQ-ScreenBar-Monitor-Light-Black/dp/B076VNFZJG',
        platform: 'amazon'
      },
      {
        id: 'w4',
        name: 'Twelve South BookArc Stand',
        description: 'Elegant vertical laptop stand to save desk space',
        price: '₹5,999',
        rating: 4.5,
        image: 'https://m.media-amazon.com/images/I/61EYGdup0SL._SL1500_.jpg',
        buyLink: 'https://www.amazon.in/Twelve-South-BookArc-MacBook-Space/dp/B086RWK8Y5',
        platform: 'amazon'
      },
      {
        id: 'w5',
        name: 'Anker USB-C Hub',
        description: '7-in-1 USB-C hub with HDMI, USB ports, and SD card reader',
        price: '₹4,999',
        rating: 4.6,
        image: 'https://m.media-amazon.com/images/I/61thMurK3QL._SL1500_.jpg',
        buyLink: 'https://www.amazon.in/Anker-Adapter-MacBook-Chromebook-Laptops/dp/B07ZVKTP53',
        platform: 'amazon'
      }
    ]
  },
  {
    id: 'learning',
    name: 'Learning Resources',
    icon: GraduationCap,
    color: 'from-orange-500 to-red-500',
    products: [
      {
        id: 'l1',
        name: 'Complete Web Developer Course',
        description: 'Learn HTML, CSS, JavaScript, React, Node.js and more from scratch',
        price: '₹449',
        rating: 4.7,
        image: 'https://img-c.udemycdn.com/course/750x422/764164_de03_2.jpg',
        buyLink: 'https://www.udemy.com/course/the-complete-web-developer-zero-to-mastery/',
        platform: 'udemy',
        badge: 'Best Seller'
      },
      {
        id: 'l2',
        name: 'Machine Learning by Andrew Ng',
        description: 'The most popular ML course by Stanford professor on Coursera',
        price: 'Free',
        rating: 4.9,
        image: 'https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://s3.amazonaws.com/coursera-course-photos/83/e258e0532611e5a5072321239ff4d4/MachineLearning-Thumbnail.png',
        buyLink: 'https://www.coursera.org/learn/machine-learning',
        platform: 'coursera',
        badge: 'Top Rated'
      },
      {
        id: 'l3',
        name: 'React - The Complete Guide',
        description: 'Master React, Redux, Hooks, Router and more with hands-on projects',
        price: '₹449',
        rating: 4.8,
        image: 'https://img-c.udemycdn.com/course/750x422/1362070_b9a1_2.jpg',
        buyLink: 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/',
        platform: 'udemy'
      },
      {
        id: 'l4',
        name: 'DSA for Coding Interviews',
        description: 'Master data structures and algorithms for FAANG interviews',
        price: '₹499',
        rating: 4.6,
        image: 'https://img-c.udemycdn.com/course/750x422/2165380_2ced_3.jpg',
        buyLink: 'https://www.udemy.com/course/master-the-coding-interview-data-structures-algorithms/',
        platform: 'udemy'
      },
      {
        id: 'l5',
        name: 'AWS Certified Solutions Architect',
        description: 'Complete preparation for AWS Solutions Architect certification',
        price: '₹449',
        rating: 4.7,
        image: 'https://img-c.udemycdn.com/course/750x422/362328_91f3_10.jpg',
        buyLink: 'https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/',
        platform: 'udemy',
        badge: 'Popular'
      }
    ]
  }
];

const platformColors: Record<string, string> = {
  amazon: 'bg-orange-500',
  flipkart: 'bg-yellow-500',
  udemy: 'bg-purple-600',
  coursera: 'bg-blue-600',
  other: 'bg-gray-500'
};

const platformNames: Record<string, string> = {
  amazon: 'Amazon',
  flipkart: 'Flipkart',
  udemy: 'Udemy',
  coursera: 'Coursera',
  other: 'Website'
};

function ProductCard({ product }: { product: Product }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="group relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300"
    >
      {product.badge && (
        <div className="absolute top-3 left-3 z-10">
          <Badge className="bg-primary text-primary-foreground">{product.badge}</Badge>
        </div>
      )}
      
      <div className="aspect-square relative overflow-hidden bg-muted/50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <Badge variant="outline" className={`${platformColors[product.platform]} text-white text-[10px] shrink-0`}>
            {platformNames[product.platform]}
          </Badge>
        </div>
        
        <p className="text-xs text-muted-foreground line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-3 w-3 ${
                i < Math.floor(product.rating)
                  ? 'text-yellow-500 fill-yellow-500'
                  : 'text-muted'
              }`}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">({product.rating})</span>
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <span className="font-bold text-lg text-primary">{product.price}</span>
          <a
            href={product.buyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors"
          >
            <ShoppingCart className="h-3 w-3" />
            Buy Now
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function RecommendationsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to NEXUS AI</span>
          </Link>
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="NEXUS AI" className="h-8 w-8" />
            <span className="font-semibold">Recommendations</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Badge variant="outline" className="px-4 py-1">
            Curated by Nitij Kumar
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
            My Recommendations
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A curated collection of the best tools, books, courses, and gear that I personally use and recommend 
            for developers and tech enthusiasts.
          </p>
        </motion.div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        {categories.map((category, categoryIndex) => {
          const Icon = category.icon;
          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: categoryIndex * 0.1 }}
              className="mb-16"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${category.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold">{category.name}</h2>
                <Badge variant="secondary">{category.products.length} items</Badge>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {category.products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </motion.div>
          );
        })}
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 text-center text-sm text-muted-foreground">
        <p>
          Affiliate Disclosure: Some links may be affiliate links. This helps support the project at no extra cost to you.
        </p>
        <p className="mt-2">
          Made with ❤️ by <a href="https://github.com/nitijkumar424-arch" className="text-primary hover:underline">Nitij Kumar</a>
        </p>
      </footer>
    </div>
  );
}
