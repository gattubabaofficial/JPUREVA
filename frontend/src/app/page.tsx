import Link from "next/link";
import { Leaf, FlaskConical, Truck, ShieldCheck, QrCode, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";

const roleCards = [
  {
    role: "Hotel / Restaurant",
    description: "Order verified, lab-tested ingredients with full farm-to-kitchen traceability.",
    href: "/register/hotel",
    icon: ShieldCheck,
  },
  {
    role: "Lab",
    description: "Verify supplier batches, issue NABL-backed certificates, and manage testing invoices.",
    href: "/register/lab",
    icon: FlaskConical,
  },
  {
    role: "Supplier / FPO",
    description: "List your harvest, get lab-certified, and sell directly to verified buyers.",
    href: "/register/supplier",
    icon: Leaf,
  },
];

const steps = [
  {
    title: "Farmer / FPO",
    description: "Suppliers log harvest batches with geo-tagged, EXIF-locked photos proving origin.",
    icon: Leaf,
  },
  {
    title: "Lab Verification",
    description: "NABL-accredited labs test each batch for adulteration, heavy metals, and microbiology.",
    icon: FlaskConical,
  },
  {
    title: "Delivery",
    description: "Verified batches ship to hotels with a cold-chain log and a scannable Trust Badge.",
    icon: Truck,
  },
];

const stats = [
  { label: "India food-service TAM", value: "$60B+" },
  { label: "Active FBO nodes onboarding", value: "120+" },
  { label: "Avg. lab turnaround", value: "< 48 hrs" },
];

export default function LandingPage() {
  return (
    <div className="flex-1">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="font-heading text-xl text-primary">JPureva</span>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/login" className="text-foreground/70 hover:text-foreground">
              Log in
            </Link>
            <Button href="/register/hotel" size="sm">
              Get started
            </Button>
          </nav>
        </div>
      </header>

      <section className="bg-primary text-on-primary">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-accent-light">
            Monetizing Food Trust
          </p>
          <h1 className="mx-auto max-w-3xl font-heading text-4xl leading-tight sm:text-5xl">
            Farm to Kitchen, Verified.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-on-primary/80">
            JPureva connects Suppliers, NABL-accredited Labs, and Hotels through a single
            trust layer — every ingredient batch is tested, certified, and traceable via QR.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button href="/register/hotel" variant="accent" size="lg">
              I&apos;m a Hotel/Restaurant
            </Button>
            <Button href="/register/lab" variant="outline" size="lg" className="border-on-primary/30 text-on-primary hover:bg-white/10">
              I&apos;m a Lab
            </Button>
            <Button href="/register/supplier" variant="outline" size="lg" className="border-on-primary/30 text-on-primary hover:bg-white/10">
              I&apos;m a Supplier
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-6 sm:grid-cols-3">
          {roleCards.map((r) => (
            <Card key={r.role} className="transition-shadow hover:shadow-md">
              <CardBody>
                <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3 text-primary">
                  <r.icon size={22} />
                </div>
                <h3 className="font-heading text-lg text-foreground">{r.role}</h3>
                <p className="mt-2 text-sm text-foreground/60">{r.description}</p>
                <Link href={r.href} className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                  Sign up <ArrowRight size={14} />
                </Link>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-surface-muted py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center font-heading text-3xl text-foreground">How It Works</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.title} className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-on-primary">
                  <s.icon size={26} />
                </div>
                <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-accent-dark">Stage {i + 1}</div>
                <h3 className="font-heading text-lg text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm text-foreground/60">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid items-center gap-10 sm:grid-cols-2">
          <div>
            <div className="mb-4 inline-flex rounded-xl bg-accent/10 p-3 text-accent-dark">
              <QrCode size={26} />
            </div>
            <h2 className="font-heading text-3xl text-foreground">The Trust Badge</h2>
            <p className="mt-4 text-foreground/70">
              Every listed batch gets a unique QR code linking to its full provenance record —
              FPO origin, harvest date, cold-chain history, and NABL lab certificate. Hotels get
              their own restaurant-level Trust Badge to display for diners, no login required to scan.
            </p>
          </div>
          <Card className="p-8 text-center">
            <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-xl border-2 border-dashed border-border bg-surface-muted">
              <QrCode size={64} className="text-primary/40" />
            </div>
            <p className="mt-4 text-sm text-foreground/50">Scan any JPureva Trust Badge to verify sourcing</p>
          </Card>
        </div>
      </section>

      <section className="bg-primary py-14 text-on-primary">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-heading text-3xl text-accent-light">{s.value}</div>
              <div className="mt-1 text-sm text-on-primary/70">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-center font-heading text-3xl text-foreground">What our pilot partners say</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <Card>
            <CardBody>
              <p className="text-foreground/70">
                &ldquo;Being able to show our guests a QR-verified supply chain has become a real
                differentiator for our kitchen.&rdquo;
              </p>
              <p className="mt-4 text-sm font-semibold text-foreground">— Executive Chef, pilot partner hotel</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <p className="text-foreground/70">
                &ldquo;JPureva gave our FPO direct access to hotel buyers we could never reach
                on our own, with lab certification built into the process.&rdquo;
              </p>
              <p className="mt-4 text-sm font-semibold text-foreground">— FPO Director, Nashik</p>
            </CardBody>
          </Card>
        </div>
      </section>

      <footer className="border-t border-border bg-surface py-8">
        <div className="mx-auto max-w-6xl px-6 text-center text-sm text-foreground/50">
          © {new Date().getFullYear()} JPureva. Farm to kitchen, verified.
        </div>
      </footer>
    </div>
  );
}
