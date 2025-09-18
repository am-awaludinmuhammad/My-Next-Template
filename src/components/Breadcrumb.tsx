import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { routes } from "@/constants/routes"; // sesuaikan import ini
import { cn } from "@/lib/utils"; // opsional kalau pakai cn

type Crumb = { label: string; href?: string };
type BreadcrumbData = { items: Crumb[] };

type Ctx = {
  current?: string;
  params?: Record<string, string | number>;
};

const fillParams = (tpl: string, params?: Ctx["params"]) =>
  tpl.replace(/\[(\w+)\]/g, (_, k) =>
    encodeURIComponent(String(params?.[k] ?? "")),
  );

// ====== DEFINISI OBJEK BREADCRUMB DI FILE YANG SAMA ======
const defs = {
  workflowEditor: ({ current }: Ctx): BreadcrumbData => ({
    items: [
      { label: "Workflow", href: routes.workflow_index },
      { label: `${current ?? ""} Workflow` },
    ],
  }),
  siglePage: ({ current }: Ctx): BreadcrumbData => ({
    items: [
      { label: `${current ?? ""}` },
    ],
  }),
  // contoh dengan path dinamis [id]
  workflow_detail: ({ params, current }: Ctx): BreadcrumbData => ({
    items: [
      { label: "Workflow", href: routes.workflow_index },
      { label: "Detail", href: fillParams(routes.workflow_create, params) },
      { label: current ?? "" },
    ],
  }),
};

export function breadcrumb<K extends keyof typeof defs>(
  key: K,
  ctx: Ctx = {},
): BreadcrumbData {
  return defs[key](ctx);
}

// ====== KOMPONEN RENDERER ======
export function Breadcrumbs({
  data,
  className,
}: {
  data: BreadcrumbData;
  className?: string;
}) {
  return (
    <nav className={cn("ml-4 flex items-center gap-2", className)}>
      {data.items.map((c, i) => (
        <span key={`${c.label}-${i}`} className="flex items-center gap-2">
          {i > 0 && <ChevronRight size={12} className="text-muted-foreground" />}
          {c.href ? (
            <Link className="text-brand" href={c.href}>
              {c.label}
            </Link>
          ) : (
            <span className="text-muted-foreground">{c.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
