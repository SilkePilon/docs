import Link from 'next/link';

const projects = [
  { title: 'Homelab', href: '/docs/homelab', text: 'The k3s cluster that runs everything.' },
  { title: 'Jotihunt', href: '/docs/jotihunt', text: 'Live tracker for the Jotihunt scouting game.' },
  { title: 'Groepshike', href: '/docs/groepshike', text: 'Site for the HIT Harderwijk Groepshike.' },
  { title: 'Portfolio', href: '/docs/portfolio', text: 'silkepilon.dev' },
  { title: 'Windesheim Readers', href: '/docs/windesheim-readers', text: 'Study app on learn.silkepilon.dev' },
];

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-16">
      <h1 className="mb-2 text-3xl font-bold">Docs</h1>
      <p className="mb-10 text-fd-muted-foreground">
        Documentation for my projects, in one place.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {projects.map((p) => (
          <Link
            key={p.href}
            href={p.href}
            className="rounded-xl border bg-fd-card p-5 transition-colors hover:bg-fd-accent"
          >
            <h2 className="mb-1 font-semibold">{p.title}</h2>
            <p className="text-sm text-fd-muted-foreground">{p.text}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
