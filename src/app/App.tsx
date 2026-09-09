import { useState, useMemo } from 'react';
import {
  ShoppingCart, Search, Menu, X, Leaf, ChevronRight, ChevronLeft,
  Star, MapPin, Calendar, Package, Truck, CheckCircle, Clock,
  Plus, Pencil, Trash2, ArrowRight, FileText, User,
  Milk, Egg, Apple, Phone, Mail, ShieldCheck, Bell,
  DollarSign, Store, Heart, RefreshCw, Check, ChevronDown,
  Upload, Sprout, ClipboardList
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Page =
  | 'home' | 'marketplace' | 'product' | 'cart' | 'checkout'
  | 'tracking' | 'farmer-dash' | 'farmer-products' | 'farmer-add' | 'farmer-orders';

type Category = 'all' | 'vegetables' | 'fruits' | 'dairy' | 'eggs' | 'other';

interface Product {
  id: number;
  name: string;
  category: 'vegetables' | 'fruits' | 'dairy' | 'eggs' | 'other';
  price: number;
  unit: string;
  quantity: number;
  farmerId: number;
  farmer: string;
  farm: string;
  location: string;
  harvestDate: string;
  description: string;
  image: string;
  rating: number;
  reviews: number;
  sold: number;
  featured: boolean;
}

interface CartItem { product: Product; qty: number; }

const PRODUCTS: Product[] = [
  {
    id: 1, name: 'Benguet Red Tomatoes', category: 'vegetables',
    price: 45, unit: 'kg', quantity: 150, farmerId: 1,
    farmer: 'Manang Rosa Reyes', farm: 'Reyes Upland Farm', location: 'La Trinidad, Benguet',
    harvestDate: 'September 8, 2026',
    description: 'Freshly harvested highland tomatoes from the cool climate of Benguet. Firm, juicy, and naturally sweet. Ideal for sinigang, Filipino sauces, and fresh salads. Grown without harmful pesticides.',
    image: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?cs=srgb&dl=pexels-pixabay-533280.jpg&fm=jpg',
    rating: 4.8, reviews: 47, sold: 234, featured: true,
  },
  {
    id: 2, name: 'Organic Carrots', category: 'vegetables',
    price: 35, unit: 'kg', quantity: 200, farmerId: 2,
    farmer: 'Mang Pedro Dela Cruz', farm: 'Dela Cruz Organic Farm', location: 'Bukidnon, Northern Mindanao',
    harvestDate: 'September 7, 2026',
    description: 'Crunchy, naturally sweet carrots grown without pesticides in the fertile highlands of Bukidnon. Perfect for ginisang gulay, soups, and fresh juices. Certified naturally grown.',
    image: 'https://shop.trueharvestseeds.org/wp-content/uploads/2021/02/Carrot-Rodelika-KS.jpg',
    rating: 4.7, reviews: 38, sold: 189, featured: true,
  },
  {
    id: 3, name: 'Highland Leafy Greens Bundle', category: 'vegetables',
    price: 30, unit: 'bundle', quantity: 80, farmerId: 3,
    farmer: 'Ate Maria Santos', farm: 'Santos Highland Greens', location: 'La Trinidad, Benguet',
    harvestDate: 'September 9, 2026',
    description: 'A mixed bundle of freshly harvested pechay, lettuce, and kangkong. Picked this morning for maximum freshness. Store refrigerated for up to 5 days.',
    image: 'https://images.unsplash.com/photo-1591586116988-62fe65164f8d?w=600&h=400&fit=crop&auto=format',
    rating: 4.9, reviews: 62, sold: 301, featured: true,
  },
  {
    id: 4, name: 'Fresh Carabao Milk', category: 'dairy',
    price: 120, unit: 'liter', quantity: 40, farmerId: 4,
    farmer: 'Kuya Tony Reyes', farm: 'Reyes Dairy Farm', location: 'Cabanatuan, Nueva Ecija',
    harvestDate: 'September 9, 2026',
    description: 'Rich, creamy carabao milk from our grass-fed herd. Higher in fat and protein than cow milk. Perfect for drinking, making kesong puti, or Filipino desserts like maja blanca.',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&h=400&fit=crop&auto=format',
    rating: 4.6, reviews: 29, sold: 115, featured: false,
  },
  {
    id: 5, name: 'Native Free-Range Eggs', category: 'eggs',
    price: 180, unit: 'dozen', quantity: 120, farmerId: 5,
    farmer: 'Aling Nena Fernandez', farm: 'Fernandez Backyard Farm', location: 'Nasugbu, Batangas',
    harvestDate: 'September 8, 2026',
    description: "Free-range native chicken eggs with rich golden yolks. Our chickens roam freely and forage naturally, producing eggs with superior taste. Great for torta, scrambled eggs, and baking.",
    image: 'https://th.bing.com/th/id/OIP.Des54GcGXosbVstxdtMaPwHaHa?w=167&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
    rating: 4.9, reviews: 84, sold: 423, featured: true,
  },
  {
    id: 6, name: 'Lakatan Bananas', category: 'fruits',
    price: 60, unit: 'kg', quantity: 300, farmerId: 6,
    farmer: 'Carlo Mendoza', farm: 'Mendoza Banana Grove', location: 'Davao del Sur, Davao Region',
    harvestDate: 'September 6, 2026',
    description: "Sweet, aromatic Lakatan bananas from the fertile soils of Davao. Known for their thin peel, creamy texture, and rich flavor. Filipino families' favorite for snacking and cooking turon.",
    image: 'https://www.turkishagrinews.com/wp-content/uploads/2020/06/Muz-1-1024x601.jpg',
    rating: 4.7, reviews: 55, sold: 267, featured: false,
  },
];

const FARMER_AVATARS: Record<number, string> = {
  1: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&crop=face',
  2: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
  3: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face',
  4: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=80&h=80&fit=crop&crop=face',
  5: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80&h=80&fit=crop&crop=face',
  6: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face',
};

const INCOMING_ORDERS = [
  {
    id: 'FE-2026001', customer: 'Juan dela Cruz',
    address: '123 Sampaguita St., Quezon City, Metro Manila',
    items: [{ name: 'Benguet Red Tomatoes', qty: 3, unit: 'kg' }],
    total: 135, status: 'pending', date: 'Sept 9, 2026',
  },
  {
    id: 'FE-2026002', customer: 'Maria Bautista',
    address: '456 Narra Ave., Makati City, Metro Manila',
    items: [{ name: 'Highland Leafy Greens Bundle', qty: 2, unit: 'bundle' }],
    total: 60, status: 'confirmed', date: 'Sept 9, 2026',
  },
  {
    id: 'FE-2026003', customer: 'Jose Santos',
    address: '789 Aguho Rd., Pasig City, Metro Manila',
    items: [{ name: 'Benguet Red Tomatoes', qty: 5, unit: 'kg' }, { name: 'Organic Carrots', qty: 2, unit: 'kg' }],
    total: 295, status: 'preparing', date: 'Sept 8, 2026',
  },
  {
    id: 'FE-2026004', customer: 'Ana Reyes',
    address: '321 Molave St., Marikina City, Metro Manila',
    items: [{ name: 'Highland Leafy Greens Bundle', qty: 4, unit: 'bundle' }],
    total: 120, status: 'delivered', date: 'Sept 7, 2026',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All Products', emoji: '🛒' },
  { id: 'vegetables', label: 'Vegetables', emoji: '🥦' },
  { id: 'fruits', label: 'Fruits', emoji: '🍎' },
  { id: 'dairy', label: 'Dairy', emoji: '🥛' },
  { id: 'eggs', label: 'Eggs', emoji: '🥚' },
  { id: 'other', label: 'Farm Products', emoji: '🌾' },
];

function statusColor(s: string) {
  const map: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-800',
    confirmed: 'bg-blue-100 text-blue-800',
    preparing: 'bg-purple-100 text-purple-800',
    out_for_delivery: 'bg-orange-100 text-orange-800',
    delivered: 'bg-emerald-100 text-emerald-800',
  };
  return map[s] ?? 'bg-gray-100 text-gray-700';
}

function statusLabel(s: string) {
  const map: Record<string, string> = {
    pending: 'Pending', confirmed: 'Confirmed',
    preparing: 'Preparing', out_for_delivery: 'Out for Delivery', delivered: 'Delivered',
  };
  return map[s] ?? s;
}

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [userRole, setUserRole] = useState<'customer' | 'farmer'>('customer');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productQty, setProductQty] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'newest'>('popular');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [farmerProducts, setFarmerProducts] = useState([...PRODUCTS]);
  const [addFormData, setAddFormData] = useState({
    name: '', category: 'vegetables', price: '', quantity: '', unit: 'kg', harvestDate: '', description: '',
  });

  const cartTotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const addToCart = (product: Product, qty = 1) => {
    setCart(prev => {
      const ex = prev.find(i => i.product.id === product.id);
      return ex
        ? prev.map(i => i.product.id === product.id ? { ...i, qty: i.qty + qty } : i)
        : [...prev, { product, qty }];
    });
    showNotification(`${product.name} added to cart!`);
  };

  const removeFromCart = (id: number) => setCart(prev => prev.filter(i => i.product.id !== id));

  const updateCartQty = (id: number, qty: number) => {
    if (qty <= 0) { removeFromCart(id); return; }
    setCart(prev => prev.map(i => i.product.id === id ? { ...i, qty } : i));
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const navigate = (p: Page, product?: Product) => {
    if (product) { setSelectedProduct(product); setProductQty(1); }
    setPage(p);
    setMobileMenuOpen(false);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredProducts = useMemo(() => {
    let r = PRODUCTS;
    if (activeCategory !== 'all') r = r.filter(p => p.category === activeCategory);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      r = r.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.farmer.toLowerCase().includes(q)
      );
    }
    switch (sortBy) {
      case 'price-asc': return [...r].sort((a, b) => a.price - b.price);
      case 'price-desc': return [...r].sort((a, b) => b.price - a.price);
      case 'newest': return [...r].reverse();
      default: return [...r].sort((a, b) => b.sold - a.sold);
    }
  }, [activeCategory, searchQuery, sortBy]);

  const customerNav = [
    { label: 'Home', p: 'home' as Page },
    { label: 'Products', p: 'marketplace' as Page },
    { label: 'Track Order', p: 'tracking' as Page },
  ];
  const farmerNav = [
    { label: 'Dashboard', p: 'farmer-dash' as Page },
    { label: 'My Products', p: 'farmer-products' as Page },
    { label: 'Orders', p: 'farmer-orders' as Page },
  ];
  const navLinks = userRole === 'customer' ? customerNav : farmerNav;

  // ────────────────────────────────────────────
  // PRODUCT CARD
  // ────────────────────────────────────────────
  const ProductCard = ({ product }: { product: Product }) => (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-green-300 hover:shadow-xl hover:shadow-green-100/60 transition-shadow cursor-pointer"
      onClick={() => navigate('product', product)}
    >
      <div className="relative h-48 bg-green-50 overflow-hidden">
        <img
          src={product.image} alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.featured && (
          <span className="absolute top-3 left-3 px-2 py-1 rounded-full bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wide shadow-sm">
            Featured
          </span>
        )}
        <button
          onClick={e => { e.stopPropagation(); addToCart(product); }}
          className="absolute bottom-3 right-3 w-9 h-9 rounded-xl bg-green-700 hover:bg-green-600 text-white flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
          aria-label="Add to cart"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
      <div className="p-4">
        <p className="text-xs text-muted-foreground font-medium mb-1 flex items-center gap-1">
          <MapPin className="w-3 h-3" /> {product.location}
        </p>
        <h3 className="font-semibold text-foreground mb-0.5 group-hover:text-green-700 transition-colors leading-snug">{product.name}</h3>
        <p className="text-xs text-muted-foreground mb-3">{product.farmer}</p>
        <div className="flex items-center justify-between">
          <div>
            <span className="font-['Playfair_Display'] text-xl font-bold text-amber-600">₱{product.price}</span>
            <span className="text-xs text-muted-foreground">/{product.unit}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="text-xs font-semibold text-foreground">{product.rating}</span>
            <span className="text-xs text-muted-foreground">({product.reviews})</span>
          </div>
        </div>
        <p className="text-xs text-green-600 mt-2 font-medium">{product.quantity} {product.unit}s available</p>
      </div>
    </motion.div>
  );

  // ────────────────────────────────────────────
  // NAVIGATION
  // ────────────────────────────────────────────
  const Nav = () => (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-green-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => navigate(userRole === 'farmer' ? 'farmer-dash' : 'home')}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-9 h-9 rounded-xl bg-green-700 flex items-center justify-center group-hover:bg-green-800 transition-colors shadow-sm">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <span className="font-['Playfair_Display'] text-lg font-bold text-green-800 block leading-tight">Farms Express</span>
              <span className="text-[10px] text-green-500 font-medium tracking-widest uppercase block leading-tight">Farm to Your Door</span>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <button
                key={link.p}
                onClick={() => navigate(link.p)}
                className={`text-sm font-medium transition-colors hover:text-green-700 ${
                  page === link.p ? 'text-green-700 font-semibold' : 'text-gray-600'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1 bg-green-50 rounded-full p-1 border border-green-100">
              <button
                onClick={() => { setUserRole('customer'); navigate('home'); }}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  userRole === 'customer' ? 'bg-green-700 text-white shadow-sm' : 'text-green-700 hover:bg-green-100'
                }`}
              >
                Customer
              </button>
              <button
                onClick={() => { setUserRole('farmer'); navigate('farmer-dash'); }}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  userRole === 'farmer' ? 'bg-green-700 text-white shadow-sm' : 'text-green-700 hover:bg-green-100'
                }`}
              >
                Farmer
              </button>
            </div>

            {userRole === 'customer' && (
              <button
                onClick={() => navigate('cart')}
                className="relative p-2 rounded-xl bg-green-50 hover:bg-green-100 transition-colors border border-green-100"
              >
                <ShoppingCart className="w-5 h-5 text-green-700" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-green-100 bg-white px-4 py-4 space-y-1 overflow-hidden"
          >
            {navLinks.map(link => (
              <button
                key={link.p}
                onClick={() => navigate(link.p)}
                className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium hover:bg-green-50 text-gray-700 hover:text-green-700 transition-colors"
              >
                {link.label}
              </button>
            ))}
            <div className="flex gap-2 pt-2 border-t border-green-50 mt-2">
              <button
                onClick={() => { setUserRole('customer'); navigate('home'); }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  userRole === 'customer' ? 'bg-green-700 text-white' : 'bg-green-50 text-green-700 border border-green-200'
                }`}
              >
                Customer View
              </button>
              <button
                onClick={() => { setUserRole('farmer'); navigate('farmer-dash'); }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  userRole === 'farmer' ? 'bg-green-700 text-white' : 'bg-green-50 text-green-700 border border-green-200'
                }`}
              >
                Farmer View
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );

  // ────────────────────────────────────────────
  // FOOTER
  // ────────────────────────────────────────────
  const Footer = () => (
    <footer className="bg-green-950 text-green-100 pt-16 pb-10 font-['DM_Sans']">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-green-500 flex items-center justify-center">
                <Sprout className="w-5 h-5 text-white" />
              </div>
              <span className="font-['Playfair_Display'] text-xl font-bold text-white">Farms Express</span>
            </div>
            <p className="text-green-300 text-sm leading-relaxed mb-5">
              Connecting Filipino farmers directly with customers. Reducing crop waste, supporting local agriculture, one delivery at a time.
            </p>
            <div className="flex gap-3">
              {['📘', '📸', '🐦'].map((icon, i) => (
                <button key={i} className="w-9 h-9 rounded-xl bg-green-800 hover:bg-green-700 flex items-center justify-center text-sm transition-colors">
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">For Customers</h4>
            <ul className="space-y-2.5">
              {['Browse Products', 'How to Order', 'Delivery Information', 'Order Tracking', 'Returns & Refunds'].map(l => (
                <li key={l}><button className="text-green-300 hover:text-white text-sm transition-colors">{l}</button></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">For Farmers</h4>
            <ul className="space-y-2.5">
              {['Become a Seller', 'Farmer Dashboard', 'Listing Guidelines', 'Pricing & Fees', 'Farmer Support'].map(l => (
                <li key={l}><button className="text-green-300 hover:text-white text-sm transition-colors">{l}</button></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-green-300">
                <Mail className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>hello@farmsexpress.ph</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-green-300">
                <Phone className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>+63 967 676 7676</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-green-300">
                <MapPin className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Lieutenant Cosico Avenue, Del Remedio, San Pablo, Laguna, Philippines</span>
              </div>
            </div>
          </div>
        </div>

        <div className="h-px bg-green-800 mb-6" />
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-green-400">
          <p>© 2026 Farms Express. All rights reserved. Proudly Filipino 🇵🇭</p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(l => (
              <button key={l} className="hover:text-white transition-colors">{l}</button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );

  // ────────────────────────────────────────────
  // HOME PAGE
  // ────────────────────────────────────────────
  const HomePage = () => (
    <div>
      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-green-950">
        <img
          src="https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=1400&h=900&fit=crop&auto=format"
          alt="Fresh vegetables from local farms"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-green-950/95 via-green-950/70 to-green-900/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-2xl">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/15 border border-amber-400/25 text-amber-300 text-sm font-medium mb-6"
            >
              <Leaf className="w-4 h-4" /> Supporting Local Filipino Farmers
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-['Playfair_Display'] text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6"
            >
              Fresh From Local Farms,{' '}
              <span className="text-amber-400 italic">Delivered to Your Door.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-green-100 text-lg sm:text-xl leading-relaxed mb-10 max-w-xl"
            >
              Farms Express connects you directly with local Filipino farmers. Get the freshest harvest delivered to your home while helping reduce crop waste and supporting rural communities.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <button
                onClick={() => navigate('marketplace')}
                className="px-8 py-4 rounded-2xl bg-green-500 hover:bg-green-400 text-white font-bold text-lg transition-all hover:scale-105 shadow-xl shadow-green-900/40 flex items-center gap-2"
              >
                Shop Now <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => { setUserRole('farmer'); navigate('farmer-dash'); }}
                className="px-8 py-4 rounded-2xl border-2 border-white/30 hover:border-white/60 hover:bg-white/10 text-white font-bold text-lg transition-all flex items-center gap-2"
              >
                <Store className="w-5 h-5" /> Become a Farmer
              </button>
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/40">
          <span className="text-[10px] uppercase tracking-widest">Scroll</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl font-bold text-green-900 mb-3">Shop by Category</h2>
            <p className="text-muted-foreground max-w-md mx-auto">Browse our wide selection of fresh farm products, sourced directly from local Philippine farms</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id as Category); navigate('marketplace'); }}
                className="group flex flex-col items-center gap-3 p-6 rounded-2xl bg-card border border-border hover:border-green-300 hover:shadow-lg hover:shadow-green-100/60 transition-all"
              >
                <span className="text-4xl group-hover:scale-110 transition-transform">{cat.emoji}</span>
                <span className="font-semibold text-green-900 text-sm text-center">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-green-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl font-bold text-green-900 mb-2">Featured Products</h2>
              <p className="text-muted-foreground">Handpicked from the freshest harvests this week</p>
            </div>
            <button onClick={() => navigate('marketplace')} className="hidden sm:flex items-center gap-2 text-green-700 font-semibold hover:text-green-500 transition-colors text-sm">
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRODUCTS.filter(p => p.featured).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          <div className="sm:hidden mt-6 text-center">
            <button onClick={() => navigate('marketplace')} className="text-green-700 font-semibold">
              View All Products →
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl font-bold text-green-900 mb-3">How It Works</h2>
            <p className="text-muted-foreground max-w-md mx-auto">Connecting farmers and customers in four simple steps</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            <div className="hidden lg:block absolute top-8 left-[calc(12.5%+2rem)] right-[calc(12.5%+2rem)] h-0.5 bg-green-100 z-0" />
            {[
              { step: '1', icon: Store, title: 'Farmers List Products', desc: 'Local farmers upload their fresh harvest with photos, prices, and availability.' },
              { step: '2', icon: ShoppingCart, title: 'Customers Place Orders', desc: 'Browse fresh products and place orders directly from the farm.' },
              { step: '3', icon: Truck, title: 'Farms Express Delivers', desc: 'We handle pickup from the farm and deliver straight to your home.' },
              { step: '4', icon: CheckCircle, title: 'Fresh at Your Door', desc: 'Receive farm-fresh products, guaranteed fresh or your money back.' },
            ].map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="relative text-center z-10">
                <div className="w-16 h-16 rounded-2xl bg-green-700 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-green-700/20 hover:scale-110 transition-transform">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 lg:right-auto lg:left-1/2 lg:-translate-x-1/2 w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center">
                  {step}
                </div>
                <h3 className="font-bold text-green-900 text-lg mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Waste Reduction */}
      <section className="relative py-24 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1567306295427-94503f8300d7?w=1400&h=700&fit=crop&auto=format"
          alt="Fresh farm harvest in crate"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-green-950/82" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-500 flex items-center justify-center mx-auto mb-6 shadow-xl">
              <RefreshCw className="w-8 h-8 text-white" />
            </div>
            <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Don't Let Fresh Harvest Go to Waste.
            </h2>
            <p className="text-green-100 text-lg leading-relaxed mb-10">
              Every year, Filipino farmers lose a significant portion of their harvest because they cannot reach enough customers in time. Farms Express gives farmers a direct channel to sell more of their crops — reducing waste and increasing income for rural families.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
              {[
                { value: '40%', label: 'of Philippine agricultural produce goes to waste annually' },
                { value: '2,400+', label: 'local farmer families supported through our platform' },
                { value: '₱0', label: 'listing fee for farmers — free to join and start selling' },
              ].map(({ value, label }) => (
                <div key={value} className="bg-white/8 rounded-2xl p-6 border border-white/15 backdrop-blur-sm">
                  <div className="font-['Playfair_Display'] text-4xl font-bold text-amber-400 mb-2">{value}</div>
                  <p className="text-green-200 text-sm leading-relaxed">{label}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => { setUserRole('farmer'); navigate('farmer-dash'); }}
              className="px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-white font-bold text-lg transition-all hover:scale-105 inline-flex items-center gap-2 shadow-xl shadow-amber-900/30"
            >
              Join as a Farmer <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Freshness & Delivery */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl font-bold text-green-900 mb-6">
                Freshness You Can Count On
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                We understand the challenge of keeping farm products fresh during delivery. Farms Express uses optimized routing and temperature-aware logistics to ensure your products arrive at peak freshness.
              </p>
              <div className="space-y-5">
                {[
                  { icon: Clock, title: 'Same-day dispatch', desc: 'Orders placed before 10 AM are dispatched the same day directly from the farm.' },
                  { icon: ShieldCheck, title: 'Freshness guaranteed', desc: 'Not satisfied? We offer a full refund or free replacement — no questions asked.' },
                  { icon: MapPin, title: 'Live order tracking', desc: 'Track your order in real time from farm harvest to your front door.' },
                  { icon: Truck, title: '1–3 day delivery', desc: 'Fast delivery within 1–3 days depending on your location in the Philippines.' },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-green-700" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-0.5">{title}</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative rounded-3xl overflow-hidden h-80 lg:h-[520px] bg-green-100">
              <img
                src="https://images.unsplash.com/photo-1557844352-761f2565b576?w=700&h=600&fit=crop&auto=format"
                alt="Fresh vegetables and fruits from Philippine farms"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-5 left-5 right-5 bg-white rounded-2xl p-4 shadow-2xl border border-green-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-700 flex items-center justify-center flex-shrink-0">
                    <Truck className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-green-900 text-sm">Your order is on the way!</p>
                    <p className="text-muted-foreground text-xs mt-0.5">Estimated arrival: Today, 3–5 PM</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold flex-shrink-0">On Track</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );

  // ────────────────────────────────────────────
  // MARKETPLACE PAGE
  // ────────────────────────────────────────────
  const MarketplacePage = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="font-['Playfair_Display'] text-3xl font-bold text-green-900 mb-1.5">Fresh Farm Products</h1>
        <p className="text-muted-foreground">Discover fresh harvests directly from local Filipino farms</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products, farmers, locations..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 transition-all text-sm"
          />
        </div>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as typeof sortBy)}
          className="px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-green-300 text-sm font-medium cursor-pointer"
        >
          <option value="popular">Most Popular</option>
          <option value="newest">Newest First</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      <div className="flex gap-2 mb-8 flex-wrap">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as Category)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === cat.id
                ? 'bg-green-700 text-white shadow-md'
                : 'bg-card border border-border text-foreground hover:border-green-300 hover:bg-green-50'
            }`}
          >
            <span>{cat.emoji}</span>{cat.label}
          </button>
        ))}
      </div>

      <p className="text-sm text-muted-foreground mb-6">
        {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
      </p>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-green-200" />
          </div>
          <h3 className="font-bold text-foreground mb-2">No products found</h3>
          <p className="text-muted-foreground text-sm">Try adjusting your search or category filter</p>
        </div>
      )}
    </div>
  );

  // ────────────────────────────────────────────
  // PRODUCT DETAIL
  // ────────────────────────────────────────────
  const ProductDetailPage = () => {
    if (!selectedProduct) return null;
    const p = selectedProduct;
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => navigate('marketplace')} className="flex items-center gap-2 text-green-700 hover:text-green-500 font-medium mb-7 transition-colors text-sm">
          <ChevronLeft className="w-5 h-5" /> Back to Products
        </button>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="rounded-3xl overflow-hidden bg-green-50 h-80 lg:h-[480px]">
            <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold capitalize">{p.category}</span>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="font-semibold text-foreground">{p.rating}</span>
                <span>({p.reviews} reviews · {p.sold} sold)</span>
              </div>
            </div>

            <h1 className="font-['Playfair_Display'] text-3xl lg:text-4xl font-bold text-green-900 mb-2 leading-tight">{p.name}</h1>
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-6">
              <MapPin className="w-4 h-4 text-green-500" /> {p.location}
            </div>

            <div className="flex items-center gap-3 p-4 rounded-2xl bg-green-50/80 border border-green-100 mb-6">
              <img
                src={FARMER_AVATARS[p.farmerId]}
                alt={p.farmer}
                className="w-12 h-12 rounded-full object-cover border-2 border-green-200 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-green-900">{p.farmer}</p>
                <p className="text-sm text-muted-foreground">{p.farm}</p>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-green-200 text-green-800 font-bold flex-shrink-0">Verified ✓</span>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-['Playfair_Display'] text-4xl font-bold text-amber-600">₱{p.price}</span>
              <span className="text-muted-foreground text-lg">/{p.unit}</span>
            </div>
            <p className="text-sm text-green-600 font-medium mb-4">{p.quantity} {p.unit}s available</p>
            <p className="text-muted-foreground leading-relaxed mb-5">{p.description}</p>

            <div className="flex items-center gap-2 text-sm text-green-700 font-medium mb-8 bg-green-50 px-4 py-2.5 rounded-xl border border-green-100 w-fit">
              <Calendar className="w-4 h-4" /> Harvested: {p.harvestDate}
            </div>

            <div className="flex items-center gap-4 mb-5">
              <div className="flex items-center gap-2 bg-green-50 rounded-xl px-2 py-1.5 border border-green-100">
                <button
                  onClick={() => setProductQty(Math.max(1, productQty - 1))}
                  className="w-9 h-9 rounded-lg hover:bg-green-100 flex items-center justify-center font-bold text-green-700 transition-colors text-lg"
                >−</button>
                <span className="w-8 text-center font-bold text-foreground">{productQty}</span>
                <button
                  onClick={() => setProductQty(Math.min(p.quantity, productQty + 1))}
                  className="w-9 h-9 rounded-lg hover:bg-green-100 flex items-center justify-center font-bold text-green-700 transition-colors text-lg"
                >+</button>
              </div>
              <span className="text-sm text-muted-foreground">
                Subtotal: <span className="font-bold text-foreground text-base">₱{p.price * productQty}</span>
              </span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { addToCart(p, productQty); navigate('cart'); }}
                className="flex-1 py-4 rounded-2xl bg-green-700 hover:bg-green-600 text-white font-bold transition-all flex items-center justify-center gap-2 shadow-md shadow-green-700/20"
              >
                <ShoppingCart className="w-5 h-5" /> Add to Cart
              </button>
              <button
                onClick={() => { addToCart(p, productQty); navigate('checkout'); }}
                className="flex-1 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-white font-bold transition-all flex items-center justify-center gap-2 shadow-md shadow-amber-500/20"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ────────────────────────────────────────────
  // CART PAGE
  // ────────────────────────────────────────────
  const CartPage = () => {
    const deliveryFee = cart.length > 0 ? 75 : 0;
    const total = cartTotal + deliveryFee;
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-['Playfair_Display'] text-3xl font-bold text-green-900 mb-8">Shopping Cart</h1>
        {cart.length === 0 ? (
          <div className="text-center py-24">
            <ShoppingCart className="w-16 h-16 text-green-200 mx-auto mb-5" />
            <h3 className="font-bold text-foreground text-xl mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground mb-7">Add some fresh products from our marketplace</p>
            <button
              onClick={() => navigate('marketplace')}
              className="px-7 py-3 rounded-xl bg-green-700 text-white font-bold hover:bg-green-600 transition-colors"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-3">
              {cart.map(item => (
                <div key={item.product.id} className="flex gap-4 bg-card rounded-2xl p-4 border border-border hover:border-green-200 transition-colors">
                  <img
                    src={item.product.image} alt={item.product.name}
                    className="w-20 h-20 rounded-xl object-cover bg-green-50 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">{item.product.name}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">{item.product.farmer}</p>
                    <p className="text-sm text-muted-foreground">{item.product.location}</p>
                    <p className="text-sm font-bold text-amber-600 mt-1">₱{item.product.price}/{item.product.unit}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <button onClick={() => removeFromCart(item.product.id)} className="text-red-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-1 bg-green-50 rounded-lg px-1 py-1 border border-green-100">
                      <button
                        onClick={() => updateCartQty(item.product.id, item.qty - 1)}
                        className="w-7 h-7 rounded flex items-center justify-center hover:bg-green-100 text-green-700 font-bold transition-colors"
                      >−</button>
                      <span className="w-6 text-center text-sm font-bold text-foreground">{item.qty}</span>
                      <button
                        onClick={() => updateCartQty(item.product.id, item.qty + 1)}
                        className="w-7 h-7 rounded flex items-center justify-center hover:bg-green-100 text-green-700 font-bold transition-colors"
                      >+</button>
                    </div>
                    <p className="text-sm font-bold text-foreground">₱{item.product.price * item.qty}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-card rounded-2xl p-6 border border-border h-fit sticky top-24">
              <h3 className="font-['Playfair_Display'] font-bold text-green-900 text-lg mb-5">Order Summary</h3>
              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal ({cartCount} items)</span>
                  <span className="font-medium text-foreground">₱{cartTotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span className="font-medium text-foreground">₱{deliveryFee}</span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex justify-between font-bold">
                  <span className="text-foreground">Total</span>
                  <span className="text-amber-600 text-lg font-['Playfair_Display']">₱{total}</span>
                </div>
              </div>
              <button
                onClick={() => navigate('checkout')}
                className="w-full py-4 rounded-2xl bg-green-700 hover:bg-green-600 text-white font-bold transition-all flex items-center justify-center gap-2 shadow-md"
              >
                Proceed to Checkout <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('marketplace')}
                className="w-full py-3 rounded-2xl mt-3 border border-border hover:bg-muted text-muted-foreground font-semibold transition-all text-sm"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ────────────────────────────────────────────
  // CHECKOUT PAGE
  // ────────────────────────────────────────────
  const CheckoutPage = () => {
    const deliveryFee = 75;
    const total = cartTotal + deliveryFee;
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-['Playfair_Display'] text-3xl font-bold text-green-900 mb-8">Checkout</h1>
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-5">
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-green-600" /> Customer Information
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  ['First Name', 'Juan', 'text'],
                  ['Last Name', 'dela Cruz', 'text'],
                  ['Email Address', 'juan@email.com', 'email'],
                  ['Mobile Number', '+63 917 123 4567', 'tel'],
                ].map(([label, placeholder, type]) => (
                  <div key={label}>
                    <label className="block text-sm font-semibold text-green-900 mb-1.5">{label}</label>
                    <input
                      type={type}
                      placeholder={placeholder}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 text-sm transition-all"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-2xl p-6 border border-border">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-green-600" /> Delivery Address
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-green-900 mb-1.5">Street Address</label>
                  <input
                    type="text"
                    placeholder="123 Sampaguita Street, Barangay Pinyahan"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-green-300 text-sm"
                  />
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  {[['City / Municipality', 'Quezon City'], ['Province', 'Metro Manila'], ['ZIP Code', '1100']].map(([l, p]) => (
                    <div key={l}>
                      <label className="block text-sm font-semibold text-green-900 mb-1.5">{l}</label>
                      <input
                        type="text"
                        placeholder={p}
                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-green-300 text-sm"
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-green-900 mb-1.5">Delivery Notes (optional)</label>
                  <textarea
                    placeholder="Gate code, landmark, special instructions..."
                    rows={2}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-green-300 text-sm resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-6 border border-border">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-600" /> Preferred Delivery Schedule
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-green-900 mb-1.5">Delivery Date</label>
                  <input
                    type="date"
                    defaultValue="2026-09-11"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-green-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-green-900 mb-1.5">Time Slot</label>
                  <select className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-green-300 text-sm">
                    <option>9:00 AM – 12:00 PM</option>
                    <option>1:00 PM – 5:00 PM</option>
                    <option>5:00 PM – 8:00 PM</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-6 border border-border">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" /> Payment Method
              </h3>
              <div className="space-y-3">
                {[
                  { id: 'cod', label: 'Cash on Delivery', desc: 'Pay in cash when your order arrives', icon: '💵', checked: true },
                  { id: 'gcash', label: 'GCash', desc: 'Pay via GCash mobile wallet', icon: '📱', checked: false },
                  { id: 'bank', label: 'Bank Transfer', desc: 'BDO, BPI, Metrobank, UnionBank', icon: '🏦', checked: false },
                ].map(({ id, label, desc, icon, checked }) => (
                  <label
                    key={id}
                    className="flex items-center gap-3 p-4 rounded-xl border border-border hover:border-green-300 cursor-pointer transition-all hover:bg-green-50/40"
                  >
                    <input type="radio" name="payment" defaultChecked={checked} className="accent-green-700" />
                    <span className="text-xl">{icon}</span>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{label}</p>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-card rounded-2xl p-6 border border-border sticky top-24">
              <h3 className="font-['Playfair_Display'] font-bold text-green-900 text-lg mb-5">Order Summary</h3>
              <div className="space-y-3 mb-4 max-h-44 overflow-y-auto">
                {cart.length > 0 ? cart.map(item => (
                  <div key={item.product.id} className="flex gap-3 items-center">
                    <img src={item.product.image} alt={item.product.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">×{item.qty} {item.product.unit}</p>
                    </div>
                    <span className="text-sm font-bold text-foreground flex-shrink-0">₱{item.product.price * item.qty}</span>
                  </div>
                )) : (
                  <p className="text-sm text-muted-foreground text-center py-2">No items in cart</p>
                )}
              </div>
              <div className="h-px bg-border mb-4" />
              <div className="space-y-2 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">₱{cartTotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="text-foreground">₱{deliveryFee}</span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex justify-between font-bold">
                  <span className="text-foreground">Total</span>
                  <span className="text-amber-600 text-xl font-['Playfair_Display']">₱{total}</span>
                </div>
              </div>
              <button
                onClick={() => { setOrderPlaced(true); setCart([]); navigate('tracking'); }}
                className="w-full py-4 rounded-2xl bg-green-700 hover:bg-green-600 text-white font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-700/20"
              >
                Place Order <Check className="w-5 h-5" />
              </button>
              <p className="text-center text-xs text-muted-foreground mt-3">
                By placing your order you agree to our Terms of Service
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ────────────────────────────────────────────
  // ORDER TRACKING
  // ────────────────────────────────────────────
  const TrackingPage = () => {
    const steps = [
      { id: 'placed', label: 'Order Placed', desc: 'Your order has been received', icon: FileText, done: true, active: false },
      { id: 'confirmed', label: 'Confirmed by Farmer', desc: 'Farmer accepted your order', icon: CheckCircle, done: true, active: false },
      { id: 'preparing', label: 'Preparing Products', desc: 'Farmer is packing your fresh order', icon: Package, done: true, active: true },
      { id: 'delivery', label: 'Out for Delivery', desc: 'Your order is on its way to you', icon: Truck, done: false, active: false },
      { id: 'delivered', label: 'Delivered', desc: 'Enjoy your fresh farm products!', icon: Heart, done: false, active: false },
    ];

    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {orderPlaced && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-8 flex items-center gap-3"
          >
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-green-800">Order placed successfully! Thank you. 🌾</p>
              <p className="text-sm text-green-600 mt-0.5">Thank you for supporting local Filipino farmers.</p>
            </div>
          </motion.div>
        )}

        <h1 className="font-['Playfair_Display'] text-3xl font-bold text-green-900 mb-1.5">Order Tracking</h1>
        <p className="text-muted-foreground mb-8">Order #FE-2026009 · Placed September 9, 2026</p>

        <div className="bg-card rounded-2xl p-6 border border-border mb-5">
          <h3 className="font-bold text-foreground mb-6">Delivery Status</h3>
          <div>
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all flex-shrink-0 ${
                      step.active
                        ? 'bg-green-700 border-green-700 shadow-lg shadow-green-300'
                        : step.done
                          ? 'bg-green-100 border-green-300'
                          : 'bg-muted border-border'
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        step.active ? 'text-white' : step.done ? 'text-green-600' : 'text-muted-foreground'
                      }`} />
                    </div>
                    {idx < steps.length - 1 && (
                      <div className={`w-0.5 h-8 my-1 ${step.done ? 'bg-green-300' : 'bg-border'}`} />
                    )}
                  </div>
                  <div className="pb-4 pt-1.5">
                    <p className={`font-semibold text-sm flex items-center gap-2 ${
                      step.active ? 'text-green-700' : step.done ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {step.label}
                      {step.active && (
                        <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase animate-pulse">
                          Current
                        </span>
                      )}
                    </p>
                    <p className={`text-xs mt-0.5 ${
                      step.done || step.active ? 'text-muted-foreground' : 'text-muted-foreground/50'
                    }`}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-5">
          <div className="bg-card rounded-2xl p-5 border border-border">
            <h4 className="font-bold text-foreground mb-3 text-xs uppercase tracking-widest text-muted-foreground">Estimated Delivery</h4>
            <p className="font-['Playfair_Display'] text-2xl font-bold text-green-700">Sept 11, 2026</p>
            <p className="text-muted-foreground text-sm mt-1">Between 9:00 AM – 12:00 PM</p>
            <div className="mt-3 flex items-center gap-2 text-xs text-green-600 font-medium">
              <Truck className="w-4 h-4" /> Farms Express Logistics
            </div>
          </div>
          <div className="bg-card rounded-2xl p-5 border border-border">
            <h4 className="font-bold text-foreground mb-3 text-xs uppercase tracking-widest text-muted-foreground">Delivery Address</h4>
            <p className="font-semibold text-foreground">Jun Dave Ofrin</p>
            <p className="text-muted-foreground text-sm mt-1 leading-relaxed">
              Lieutenant Cosico Avenue, Del Remedio<br />San Pablo City, Laguna
            </p>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border">
          <h3 className="font-bold text-foreground mb-4">Items in This Order</h3>
          <div className="space-y-3">
            {[
              { name: 'Benguet Red Tomatoes', qty: '3 kg', price: 135, farmer: 'Manang Rosa Reyes' },
              { name: 'Native Free-Range Eggs', qty: '1 dozen', price: 180, farmer: 'Aling Nena Fernandez' },
            ].map(item => (
              <div key={item.name} className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-foreground text-sm">{item.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.qty} · {item.farmer}</p>
                </div>
                <span className="font-bold text-amber-600">₱{item.price}</span>
              </div>
            ))}
            <div className="h-px bg-border" />
            <div className="flex justify-between">
              <div>
                <span className="font-bold text-foreground">Total Paid</span>
                <span className="text-xs text-muted-foreground ml-2">(incl. ₱75 delivery)</span>
              </div>
              <span className="font-['Playfair_Display'] text-lg font-bold text-amber-600">₱390</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ────────────────────────────────────────────
  // FARMER DASHBOARD
  // ────────────────────────────────────────────
  const FarmerDashPage = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-['Playfair_Display'] text-3xl font-bold text-green-900">
            Welcome back, Manong Edward! 👋
          </h1>
          <p className="text-muted-foreground mt-1">Here's what's happening with your farm today.</p>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <img src={FARMER_AVATARS[1]} alt="Farmer" className="w-11 h-11 rounded-full object-cover border-2 border-green-200" />
          <div>
            <p className="font-semibold text-foreground text-sm">Manong Edward Reyes</p>
            <p className="text-xs text-muted-foreground">Reyes Upland Farm, Benguet</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Sales', value: '₱45,820', icon: DollarSign, bg: 'bg-green-100', ic: 'text-green-700', trend: '+12% this month' },
          { label: 'Total Orders', value: '127', icon: ClipboardList, bg: 'bg-blue-100', ic: 'text-blue-700', trend: '8 pending' },
          { label: 'Completed Orders', value: '119', icon: CheckCircle, bg: 'bg-emerald-100', ic: 'text-emerald-700', trend: '93.7% completion rate' },
          { label: 'Active Listings', value: '6', icon: Package, bg: 'bg-amber-100', ic: 'text-amber-700', trend: '750+ units available' },
        ].map(({ label, value, icon: Icon, bg, ic, trend }) => (
          <div key={label} className="bg-card rounded-2xl p-5 border border-border hover:border-green-200 transition-colors">
            <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center mb-4`}>
              <Icon className={`w-5 h-5 ${ic}`} />
            </div>
            <p className="font-['Playfair_Display'] text-2xl font-bold text-foreground">{value}</p>
            <p className="text-sm font-semibold text-foreground mt-0.5">{label}</p>
            <p className="text-xs text-muted-foreground mt-1">{trend}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border overflow-hidden">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <h3 className="font-bold text-foreground">Recent Orders</h3>
            <button onClick={() => navigate('farmer-orders')} className="text-sm text-green-700 font-semibold hover:text-green-500 transition-colors">
              View all →
            </button>
          </div>
          <div className="divide-y divide-border">
            {INCOMING_ORDERS.map(order => (
              <div key={order.id} className="p-4 flex items-center gap-4 hover:bg-green-50/40 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-foreground text-sm">{order.id}</p>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusColor(order.status)}`}>
                      {statusLabel(order.status)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{order.customer} · {order.date}</p>
                  <p className="text-xs text-green-600 mt-0.5 truncate">
                    {order.items.map(i => `${i.name} ×${i.qty}`).join(', ')}
                  </p>
                </div>
                <span className="font-bold text-amber-600 text-sm flex-shrink-0">₱{order.total}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-card rounded-2xl border border-border p-5">
            <h3 className="font-bold text-foreground mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate('farmer-add')}
                className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-green-700 hover:bg-green-600 text-white transition-colors shadow-sm"
              >
                <Plus className="w-5 h-5 flex-shrink-0" />
                <span className="font-semibold text-sm">Add New Product</span>
              </button>
              <button
                onClick={() => navigate('farmer-products')}
                className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-green-50 hover:bg-green-100 text-green-800 border border-green-200 transition-colors"
              >
                <Package className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="font-semibold text-sm">Manage Products</span>
              </button>
              <button
                onClick={() => navigate('farmer-orders')}
                className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-green-50 hover:bg-green-100 text-green-800 border border-green-200 transition-colors"
              >
                <ClipboardList className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="font-semibold text-sm">View All Orders</span>
              </button>
            </div>
          </div>

          <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5">
            <div className="flex items-center gap-2 mb-2">
              <Bell className="w-4 h-4 text-amber-600" />
              <h4 className="font-bold text-amber-800 text-sm">New Orders</h4>
            </div>
            <p className="text-amber-700 text-sm leading-relaxed">
              You have <strong>2 new orders</strong> waiting for your confirmation.
            </p>
            <button onClick={() => navigate('farmer-orders')} className="mt-3 text-sm font-bold text-amber-700 hover:text-amber-500 transition-colors">
              Review now →
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // ────────────────────────────────────────────
  // FARMER MANAGE PRODUCTS
  // ────────────────────────────────────────────
  const FarmerProductsPage = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-['Playfair_Display'] text-3xl font-bold text-green-900">My Products</h1>
          <p className="text-muted-foreground mt-1">Manage your active farm product listings</p>
        </div>
        <button
          onClick={() => navigate('farmer-add')}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-green-700 text-white font-bold hover:bg-green-600 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" /> Add Product
        </button>
      </div>

      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-green-50/50">
                {['Product', 'Category', 'Price', 'Available', 'Harvest Date', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {farmerProducts.map(product => (
                <tr key={product.id} className="hover:bg-green-50/30 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt={product.name} className="w-12 h-12 rounded-xl object-cover bg-green-50 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-foreground text-sm">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.sold} sold</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold capitalize">{product.category}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-bold text-amber-600 whitespace-nowrap">₱{product.price}/{product.unit}</span>
                  </td>
                  <td className="px-5 py-4 text-sm text-foreground whitespace-nowrap">{product.quantity} {product.unit}s</td>
                  <td className="px-5 py-4 text-sm text-muted-foreground whitespace-nowrap">{product.harvestDate}</td>
                  <td className="px-5 py-4">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">Active</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <button className="p-2 rounded-lg hover:bg-blue-50 text-blue-400 hover:text-blue-600 transition-colors" title="Edit product">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors"
                        title="Delete product"
                        onClick={() => {
                          setFarmerProducts(prev => prev.filter(p => p.id !== product.id));
                          showNotification(`${product.name} removed from listings.`);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // ────────────────────────────────────────────
  // ADD PRODUCT
  // ────────────────────────────────────────────
  const AddProductPage = () => (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button onClick={() => navigate('farmer-products')} className="flex items-center gap-2 text-green-700 font-medium mb-7 hover:text-green-500 transition-colors text-sm">
        <ChevronLeft className="w-5 h-5" /> Back to Products
      </button>
      <h1 className="font-['Playfair_Display'] text-3xl font-bold text-green-900 mb-8">Add New Product</h1>

      <div className="bg-card rounded-2xl border border-border p-7 space-y-6">
        <div>
          <label className="block text-sm font-bold text-foreground mb-3">Product Image</label>
          <div className="border-2 border-dashed border-green-200 rounded-2xl p-10 text-center hover:border-green-400 hover:bg-green-50/40 transition-all cursor-pointer group">
            <Upload className="w-10 h-10 text-green-300 group-hover:text-green-500 mx-auto mb-3 transition-colors" />
            <p className="font-semibold text-green-700 text-sm">Click to upload a product photo</p>
            <p className="text-xs text-muted-foreground mt-1.5">PNG, JPG, or WebP · Up to 10MB</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <label className="block text-sm font-bold text-foreground mb-2">Product Name *</label>
            <input
              type="text"
              placeholder="e.g. Benguet Strawberries"
              value={addFormData.name}
              onChange={e => setAddFormData(f => ({ ...f, name: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 text-sm transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-foreground mb-2">Category *</label>
            <select
              value={addFormData.category}
              onChange={e => setAddFormData(f => ({ ...f, category: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-green-300 text-sm"
            >
              <option value="vegetables">🥦 Vegetables</option>
              <option value="fruits">🍎 Fruits</option>
              <option value="dairy">🥛 Dairy</option>
              <option value="eggs">🥚 Eggs</option>
              <option value="other">🌾 Other Farm Products</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-foreground mb-2">Unit of Measurement *</label>
            <select
              value={addFormData.unit}
              onChange={e => setAddFormData(f => ({ ...f, unit: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-green-300 text-sm"
            >
              <option value="kg">per kilogram (kg)</option>
              <option value="piece">per piece</option>
              <option value="bundle">per bundle</option>
              <option value="liter">per liter</option>
              <option value="dozen">per dozen</option>
              <option value="pack">per pack</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-foreground mb-2">Price (₱) *</label>
            <input
              type="number"
              placeholder="45"
              value={addFormData.price}
              onChange={e => setAddFormData(f => ({ ...f, price: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-green-300 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-foreground mb-2">Available Quantity *</label>
            <input
              type="number"
              placeholder="100"
              value={addFormData.quantity}
              onChange={e => setAddFormData(f => ({ ...f, quantity: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-green-300 text-sm"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-bold text-foreground mb-2">Harvest Date *</label>
            <input
              type="date"
              value={addFormData.harvestDate}
              onChange={e => setAddFormData(f => ({ ...f, harvestDate: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-green-300 text-sm"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-bold text-foreground mb-2">Product Description *</label>
            <textarea
              rows={4}
              placeholder="Describe your product — growing method, taste profile, how it was harvested, best uses in cooking..."
              value={addFormData.description}
              onChange={e => setAddFormData(f => ({ ...f, description: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-green-300 text-sm resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={() => {
              const newProd: Product = {
                id: Date.now(), name: addFormData.name || 'New Product',
                category: addFormData.category as Product['category'],
                price: Number(addFormData.price) || 0, unit: addFormData.unit,
                quantity: Number(addFormData.quantity) || 0, farmerId: 1,
                farmer: 'Manang Rosa Reyes', farm: 'Reyes Upland Farm',
                location: 'La Trinidad, Benguet',
                harvestDate: addFormData.harvestDate || 'September 9, 2026',
                description: addFormData.description,
                image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600&h=400&fit=crop&auto=format',
                rating: 0, reviews: 0, sold: 0, featured: false,
              };
              setFarmerProducts(prev => [...prev, newProd]);
              showNotification(`"${addFormData.name || 'Product'}" published successfully!`);
              setAddFormData({ name: '', category: 'vegetables', price: '', quantity: '', unit: 'kg', harvestDate: '', description: '' });
              navigate('farmer-products');
            }}
            className="flex-1 py-4 rounded-2xl bg-green-700 hover:bg-green-600 text-white font-bold transition-all flex items-center justify-center gap-2 shadow-md shadow-green-700/20"
          >
            <Check className="w-5 h-5" /> Publish Product
          </button>
          <button
            onClick={() => navigate('farmer-products')}
            className="px-6 py-4 rounded-2xl border border-border hover:bg-muted text-muted-foreground font-semibold transition-all text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  // ────────────────────────────────────────────
  // FARMER ORDERS
  // ────────────────────────────────────────────
  const FarmerOrdersPage = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="font-['Playfair_Display'] text-3xl font-bold text-green-900">Customer Orders</h1>
        <p className="text-muted-foreground mt-1">Manage and fulfill incoming orders from customers</p>
      </div>

      <div className="space-y-4">
        {INCOMING_ORDERS.map(order => (
          <div key={order.id} className="bg-card rounded-2xl border border-border overflow-hidden hover:border-green-200 transition-colors">
            <div className="p-5 border-b border-border flex flex-wrap items-center justify-between gap-3 bg-green-50/30">
              <div className="flex items-center gap-3 flex-wrap">
                <p className="font-bold text-foreground">{order.id}</p>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${statusColor(order.status)}`}>
                  {statusLabel(order.status)}
                </span>
                <span className="text-sm text-muted-foreground">{order.date}</span>
              </div>
              <span className="font-['Playfair_Display'] text-2xl font-bold text-amber-600">₱{order.total}</span>
            </div>

            <div className="p-5 grid sm:grid-cols-3 gap-5">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Customer</p>
                <p className="font-semibold text-foreground">{order.customer}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Delivery Address</p>
                <p className="text-sm text-foreground leading-relaxed">{order.address}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Items Ordered</p>
                {order.items.map(item => (
                  <p key={item.name} className="text-sm text-foreground leading-relaxed">
                    {item.name} <span className="text-muted-foreground">× {item.qty} {item.unit}</span>
                  </p>
                ))}
              </div>
            </div>

            {order.status === 'pending' && (
              <div className="px-5 pb-5 flex gap-3">
                <button
                  onClick={() => showNotification(`Order ${order.id} accepted!`)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-700 text-white font-bold text-sm hover:bg-green-600 transition-colors shadow-sm"
                >
                  <Check className="w-4 h-4" /> Accept Order
                </button>
                <button
                  onClick={() => showNotification(`Order ${order.id} rejected.`)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-red-200 text-red-600 font-bold text-sm hover:bg-red-50 transition-colors"
                >
                  <X className="w-4 h-4" /> Reject Order
                </button>
              </div>
            )}
            {order.status === 'confirmed' && (
              <div className="px-5 pb-5">
                <button
                  onClick={() => showNotification(`Order ${order.id} updated to Preparing!`)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-colors shadow-sm"
                >
                  <Package className="w-4 h-4" /> Start Preparing
                </button>
              </div>
            )}
            {order.status === 'preparing' && (
              <div className="px-5 pb-5">
                <button
                  onClick={() => showNotification(`Order ${order.id} is now out for delivery!`)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-bold text-sm transition-colors shadow-sm"
                >
                  <Truck className="w-4 h-4" /> Mark as Out for Delivery
                </button>
              </div>
            )}
            {order.status === 'delivered' && (
              <div className="px-5 pb-5">
                <span className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                  <CheckCircle className="w-4 h-4" /> Order delivered successfully
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // ────────────────────────────────────────────
  // PAGE RENDERER
  // ────────────────────────────────────────────
  const renderPage = () => {
    switch (page) {
      case 'home': return <HomePage />;
      case 'marketplace': return <MarketplacePage />;
      case 'product': return <ProductDetailPage />;
      case 'cart': return <CartPage />;
      case 'checkout': return <CheckoutPage />;
      case 'tracking': return <TrackingPage />;
      case 'farmer-dash': return <FarmerDashPage />;
      case 'farmer-products': return <FarmerProductsPage />;
      case 'farmer-add': return <AddProductPage />;
      case 'farmer-orders': return <FarmerOrdersPage />;
      default: return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-background font-['DM_Sans'] text-foreground">
      <Nav />

      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-green-800 text-white px-6 py-3.5 rounded-2xl shadow-2xl font-semibold text-sm flex items-center gap-2.5 whitespace-nowrap"
          >
            <Check className="w-4 h-4 text-green-300 flex-shrink-0" />
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-16">
        {renderPage()}
      </main>
    </div>
  );
}
