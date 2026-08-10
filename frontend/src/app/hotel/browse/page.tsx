"use client";

import { useState, useMemo } from "react";
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  ShoppingBag, 
  FlaskConical, 
  Leaf, 
  Thermometer, 
  FileText, 
  Plus, 
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { RAW_PRODUCTS, type RawProduct } from "@/lib/data/products";
import { useCart } from "@/lib/store/cartStore";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { LabReportModal } from "@/components/products/LabReportModal";

const CATEGORIES = [
  { id: "all", label: "All Products (52 Items)" },
  { id: "vegetables", label: "Fresh Organic Vegetables" },
  { id: "grains-pulses", label: "Grains & Pulses" },
  { id: "spices", label: "Pure Whole & Ground Spices" },
  { id: "dairy-oils", label: "Pure Dairy & Cold-Pressed Oils" },
  { id: "meats-dryfruits", label: "Dry Fruits & Raw Meats" },
];

export default function HotelBrowsePage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recommended");
  const [selectedLabProduct, setSelectedLabProduct] = useState<RawProduct | null>(null);

  // Cart hook
  const {
    cart,
    isOpen: isCartOpen,
    setIsOpen: setIsCartOpen,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    discountAmount,
    discountRate,
    taxAmount,
    total,
    itemCount,
  } = useCart();

  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const getQuantity = (product: RawProduct) => {
    return quantities[product.id] ?? product.moq;
  };

  const setQuantity = (productId: string, val: number, moq: number) => {
    const validVal = Math.max(val, moq);
    setQuantities((prev) => ({ ...prev, [productId]: validVal }));
  };

  const filteredProducts = useMemo(() => {
    let list = [...RAW_PRODUCTS];

    if (selectedCategory !== "all") {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.hindiName.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.fpoSource.name.toLowerCase().includes(q)
      );
    }

    if (sortBy === "price-low") {
      list.sort((a, b) => a.pricePerUnit - b.pricePerUnit);
    } else if (sortBy === "price-high") {
      list.sort((a, b) => b.pricePerUnit - a.pricePerUnit);
    } else if (sortBy === "moq-low") {
      list.sort((a, b) => a.moq - b.moq);
    }

    return list;
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="max-w-2xl">
          <h1 className="font-heading text-3xl font-normal tracking-tight text-foreground sm:text-4xl">
            Browse verified raw produce
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-foreground-secondary">
            Direct B2B procurement of unadulterated raw materials with NABL lab testing and clear
            minimum order quantities.
          </p>
        </div>

        <button
          onClick={() => setIsCartOpen(true)}
          className="flex items-center gap-2 rounded-xl border border-primary/25 bg-surface-muted px-4 py-2 text-xs font-bold text-primary hover:bg-surface-2 transition-colors shadow-soft self-start md:self-auto"
        >
          <ShoppingBag size={18} />
          <span>Procurement Cart</span>
          {itemCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-on-accent">
              {itemCount}
            </span>
          )}
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-border bg-surface p-4 shadow-soft">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-tertiary" size={18} />
          <input
            type="text"
            placeholder="Search 52 raw food materials (e.g. Paneer, Haldi, Potato, Basmati)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface-muted pl-10 pr-4 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <Filter size={16} className="text-foreground-tertiary" />
          <span className="text-xs text-foreground-secondary shrink-0">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-xl border border-border bg-surface-muted px-3 py-2 text-xs text-foreground font-medium focus:border-primary focus:outline-none"
          >
            <option value="recommended">Recommended (NABL Purity)</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="moq-low">Lowest MOQ First</option>
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`shrink-0 rounded-full px-5 py-2 text-xs font-semibold transition-all ${
              selectedCategory === cat.id
                ? "bg-primary text-on-primary shadow-glow-primary"
                : "bg-surface border border-border text-foreground-secondary hover:border-primary/50 hover:text-foreground"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Products Count Indicator */}
      <div className="text-xs text-foreground-tertiary font-medium">
        Showing <strong className="text-foreground">{filteredProducts.length}</strong> verified raw materials
      </div>

      {/* Product Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((p) => {
          const currentQty = getQuantity(p);

          return (
            <div
              key={p.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-300 hover:border-primary/40 hover:shadow-lifted"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-surface-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-80" />

                  <div className="absolute top-3 left-3 rounded-full bg-accent px-3 py-1 text-[11px] font-medium text-on-accent shadow-soft">
                    MOQ: {p.moq} {p.unit}
                  </div>

                  <div className="absolute top-3 right-3 rounded-full flex items-center gap-1 rounded-full bg-surface/90 px-2.5 py-1 text-[10px] font-medium text-primary backdrop-blur-md">
                    <ShieldCheck size={12} /> NABL Verified
                  </div>

                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="font-heading text-xl font-bold text-foreground drop-shadow">{p.name}</h3>
                    <p className="text-xs text-foreground-secondary drop-shadow">{p.hindiName}</p>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="tabular-nums text-2xl font-semibold text-primary">₹{p.pricePerUnit}</span>
                      <span className="text-xs text-foreground-tertiary"> / {p.unit}</span>
                    </div>
                    <span className="text-[11px] text-foreground-tertiary">Stock: {p.stockAvailable} {p.unit}</span>
                  </div>

                  <p className="text-xs text-foreground-secondary leading-relaxed line-clamp-2">
                    {p.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-medium">
                    <div className="rounded-lg border border-border bg-surface-muted px-2.5 py-1.5 flex items-center justify-between">
                      <span className="text-foreground-tertiary">Protein:</span>
                      <span className="font-semibold text-primary">{p.labDetails.protein}</span>
                    </div>
                    <div className="rounded-lg border border-border bg-surface-muted px-2.5 py-1.5 flex items-center justify-between">
                      <span className="text-foreground-tertiary">Fat:</span>
                      <span className="font-semibold text-accent-light">{p.labDetails.fat}</span>
                    </div>
                  </div>

                  <div className="rounded-lg border border-primary/25 bg-primary/10 px-3 py-1.5 text-[11px] text-primary font-semibold tabular-nums">
                    ✓ {p.labDetails.adulterants}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-foreground-tertiary border-t border-border pt-3">
                    <span className="flex items-center gap-1 text-foreground-secondary">
                      <Leaf size={12} className="text-primary" /> {p.fpoSource.name}
                    </span>
                    <span className="flex items-center gap-1">
                      <Thermometer size={12} className="text-accent-light" /> {p.shelfLife.split(" ")[0]} {p.shelfLife.split(" ")[1]}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 space-y-3">
                <div className="flex items-center justify-between rounded-xl border border-border bg-surface-muted p-2">
                  <span className="text-xs font-medium text-foreground-secondary pl-1">Order Quantity:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQuantity(p.id, currentQty - 5, p.moq)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-surface font-bold text-foreground hover:bg-surface-muted text-xs"
                      disabled={currentQty <= p.moq}
                    >
                      <Minus size={12} />
                    </button>
                    <span className="tabular-nums text-xs font-bold text-foreground px-1">
                      {currentQty} {p.unit}
                    </span>
                    <button
                      onClick={() => setQuantity(p.id, currentQty + 5, p.moq)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-surface font-bold text-foreground hover:bg-surface-muted text-xs"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedLabProduct(p)}
                    className="rounded-xl border border-border bg-surface px-3 py-2 text-[11px] font-semibold text-foreground-secondary hover:border-primary hover:text-foreground transition-colors flex items-center justify-center gap-1"
                  >
                    <FileText size={12} /> NABL Report
                  </button>
                  <Button
                    onClick={() => addToCart(p, currentQty)}
                    variant="accent"
                    size="sm"
                    className="text-xs"
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="rounded-2xl border border-border bg-surface p-12 text-center space-y-4">
          <FlaskConical size={48} className="mx-auto text-foreground-tertiary/40" />
          <h3 className="font-heading text-xl font-bold text-foreground">No Products Found</h3>
          <p className="text-sm text-foreground-secondary">
            No raw materials matched &ldquo;{searchQuery}&rdquo;.
          </p>
          <Button onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }} variant="outline" size="sm">
            Reset Search
          </Button>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
        subtotal={subtotal}
        discountAmount={discountAmount}
        discountRate={discountRate}
        taxAmount={taxAmount}
        total={total}
      />

      {/* Lab Modal */}
      <LabReportModal product={selectedLabProduct} onClose={() => setSelectedLabProduct(null)} />
    </div>
  );
}
