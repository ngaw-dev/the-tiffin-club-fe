export type Money = string | number;

export type Extra = {
  id: number;
  name: string;
  description: string | null;
  price: Money;
  photo_url: string | null;
};

export type Meal = {
  date: string;
  name: string;
  description: string | null;
  price: Money;
  photo_url: string | null;
  max_per_order: number;
  extras: Extra[];
};

export type OrderingStatus = {
  delivery_open: boolean | null;
  pickup_open: boolean | null;
  delivery_cutoff: string | null;
  pickup_cutoff: string | null;
  pickup_window: {
    start: string | null;
    end: string | null;
  };
  restaurant_address: string | null;
  delivery_city: string | null;
};

export type TodayMenu = {
  meal: Meal;
  ordering: OrderingStatus;
};

export type OrderItemSummary = {
  item_type: string;
  name: string;
  unit_price: Money;
  quantity: number;
  line_total: Money;
};

export type OrderSummary = {
  order_number: string;
  status: string;
  fulfilment_type: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string | null;
  payment_method: string | null;
  order_total: Money;
  ordered_at: string | null;
  items: OrderItemSummary[];
};

export type ApiErrorEnvelope = {
  message: string;
  errors: Record<string, string[]> | null;
  status: number;
};

export class ApiError extends Error {
  envelope: ApiErrorEnvelope;
  status: number;

  constructor(envelope: ApiErrorEnvelope) {
    super(envelope.message);
    this.name = "ApiError";
    this.envelope = envelope;
    this.status = envelope.status;
  }
}

export function getApiBaseUrl(): string {
  // Local DDEV default uses http: Node's server-side fetch may not trust the
  // DDEV mkcert CA (browsers are fine with https). Override with API_BASE_URL
  // (e.g. https://...) when your runtime trusts the certificate.
  const base =
    process.env.API_BASE_URL ?? "http://the-tiffin-box-main.ddev.site";
  return `${base.replace(/\/$/, "")}/api/v1`;
}

type FetchJsonOptions = RequestInit & {
  unwrapData?: boolean;
};

async function readJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return { message: text };
  }
}

function asEnvelope(value: unknown, status: number): ApiErrorEnvelope {
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return {
      message:
        typeof record.message === "string" ? record.message : "Request failed",
      errors:
        record.errors && typeof record.errors === "object"
          ? (record.errors as Record<string, string[]>)
          : null,
      status: typeof record.status === "number" ? record.status : status,
    };
  }
  return { message: "Request failed", errors: null, status };
}

export async function fetchJson<T>(
  path: string,
  options: FetchJsonOptions = {},
): Promise<T> {
  const { unwrapData = true, headers, ...init } = options;
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(headers ?? {}),
    },
  });

  const json = await readJson(response);

  if (!response.ok) {
    throw new ApiError(asEnvelope(json, response.status));
  }

  if (unwrapData && json && typeof json === "object" && "data" in json) {
    return (json as { data: T }).data;
  }
  return json as T;
}

export async function getTodayMenu(): Promise<TodayMenu | null> {
  try {
    return await fetchJson<TodayMenu>("/menu/today", { cache: "no-store" });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function getOrder(orderNumber: string): Promise<OrderSummary> {
  return fetchJson<OrderSummary>(`/orders/${encodeURIComponent(orderNumber)}`, {
    cache: "no-store",
  });
}

export function formatMoney(value: Money): string {
  const amount = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(amount)) return String(value);
  return new Intl.NumberFormat("en-NZ", {
    style: "currency",
    currency: "NZD",
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatTime(value: string | null): string | null {
  if (!value) return null;
  const [hours, minutes] = value.split(":");
  const date = new Date(2000, 0, 1, Number(hours), Number(minutes || "0"), 0, 0);
  return new Intl.DateTimeFormat("en-NZ", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function formatMenuDate(value: string): string {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-NZ", {
    month: "long",
    day: "numeric",
  }).format(date);
}

export function formatOrderedAt(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-NZ", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function isOrderingOpen(ordering: OrderingStatus): boolean {
  return ordering.pickup_open === true || ordering.delivery_open === true;
}
