"use client";

import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { listCategories } from "@/lib/api/catalog";
import { listProducts } from "@/lib/api/hotels";
import { mediaUrl } from "@/lib/api/client";
import type { Batch, Category } from "@/lib/api/types";
import { cn } from "@/lib/utils/cn";

export default function BrowsePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined);
  const [products, setProducts] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listCategories().then((res) => setCategories(res.results));
  }, []);

  useEffect(() => {
    setLoading(true);
    listProducts({ category: activeCategory })
      .then((res) => setProducts(res.results))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl text-foreground">Browse verified ingredients</h1>
        <p className="text-sm text-foreground/60">Only lab-certified, listed batches appear here.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory(undefined)}
          className={cn(
            "rounded-full px-4 py-1.5 text-sm font-medium",
            !activeCategory ? "bg-primary text-on-primary" : "bg-surface-muted text-foreground/70"
          )}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.slug)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium",
              activeCategory === c.slug ? "bg-primary text-on-primary" : "bg-surface-muted text-foreground/70"
            )}
          >
            {c.name}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-foreground/50">Loading products…</p>
      ) : products.length === 0 ? (
        <p className="text-sm text-foreground/50">No verified ingredients listed in this category yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <Card key={p.id} className="overflow-hidden">
              <CardBody>
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-heading text-lg text-foreground">{p.ingredient_name}</span>
                  <ShieldCheck size={18} className="text-primary" aria-label="Lab verified" />
                </div>
                <p className="text-xs text-foreground/50">Supplier: {p.supplier_name}</p>
                <p className="mt-2 text-sm text-foreground/70">₹{p.price_per_unit} / {p.unit}</p>
                <p className="text-xs text-foreground/50">{p.available_quantity} {p.unit} available</p>
                {p.qr_image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={mediaUrl(p.qr_image) ?? undefined} alt="Trust QR" className="mt-3 h-16 w-16" />
                )}
                <Button href={`/hotel/browse/${p.id}`} size="sm" className="mt-4 w-full">
                  View details
                </Button>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
