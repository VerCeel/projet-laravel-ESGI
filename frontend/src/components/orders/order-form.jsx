"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select } from "@/components/ui/select";
import { formatPrice } from "@/components/products/product-form";
import { cn } from "@/lib/utils";

export const ORDER_STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

function clientLabel(client) {
  return `${client.first_name} ${client.last_name}`;
}

export function calculateTotalPrice(products, productItems) {
  if (!Array.isArray(productItems) || productItems.length === 0) {
    return 0;
  }

  return productItems.reduce((sum, item) => {
    const product = products.find((p) => String(p.id) === String(item.product_id));
    if (!product) return sum;

    const qty = Number(item.quantity);
    if (!Number.isFinite(qty) || qty < 1) return sum;

    return sum + Number(product.price) * qty;
  }, 0);
}

export function withCalculatedTotal(values, products) {
  const total = calculateTotalPrice(products, values.product_items);

  return {
    ...values,
    total_price: total > 0 ? total.toFixed(2) : "",
  };
}

export function OrderFormFields({
  idPrefix,
  values,
  onChange,
  clients,
  clientsLoading,
  products,
  productsLoading,
}) {
  const set = (field) => (event) =>
    onChange({ ...values, [field]: event.target.value });

  const handleClientChange = (clientId) => {
    onChange({ ...values, client_id: clientId });
  };

  const handleProductToggle = (productId) => {
    const id = String(productId);
    const isSelected = values.product_items.some((item) => item.product_id === id);
    const nextItems = isSelected
      ? values.product_items.filter((item) => item.product_id !== id)
      : [...values.product_items, { product_id: id, quantity: "1" }];

    onChange(withCalculatedTotal({ ...values, product_items: nextItems }, products));
  };

  const handleProductQuantityChange = (productId, quantity) => {
    const id = String(productId);
    onChange(
      withCalculatedTotal(
        {
          ...values,
          product_items: values.product_items.map((item) =>
            item.product_id === id ? { ...item, quantity } : item,
          ),
        },
        products,
      ),
    );
  };

  return (
    <div className="grid gap-4">
      <div className="space-y-2">
        <Label>Client</Label>
        <div className="max-h-40 overflow-y-auto rounded-md border p-3">
          {clientsLoading ? (
            <p className="text-sm text-muted-foreground">Loading clients...</p>
          ) : clients.length === 0 ? (
            <p className="text-sm text-muted-foreground">No clients available.</p>
          ) : (
            <RadioGroup value={values.client_id} onValueChange={handleClientChange}>
              {clients.map((client) => (
                <label
                  key={client.id}
                  htmlFor={`${idPrefix}-client-${client.id}`}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm transition",
                    values.client_id === String(client.id)
                      ? "border-primary/50 bg-primary/5"
                      : "border-transparent hover:bg-muted/50",
                  )}
                >
                  <RadioGroupItem
                    value={String(client.id)}
                    id={`${idPrefix}-client-${client.id}`}
                  />
                  <span>
                    {clientLabel(client)}{" "}
                    <span className="text-muted-foreground">({client.email})</span>
                  </span>
                </label>
              ))}
            </RadioGroup>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Products</Label>
        <div className="max-h-56 space-y-2 overflow-y-auto rounded-md border p-3">
          {productsLoading ? (
            <p className="text-sm text-muted-foreground">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="text-sm text-muted-foreground">No products available.</p>
          ) : (
            products.map((product) => {
              const selected = values.product_items.find(
                (item) => item.product_id === String(product.id),
              );

              return (
                <div
                  key={product.id}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border p-3 text-sm transition",
                    selected
                      ? "border-primary/50 bg-primary/5"
                      : "border-transparent hover:bg-muted/50",
                  )}
                >
                  <label className="flex flex-1 cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={Boolean(selected)}
                      onChange={() => handleProductToggle(product.id)}
                      className="size-4 shrink-0 rounded border-input accent-primary"
                    />
                    <span>
                      {product.name}{" "}
                      <span className="text-muted-foreground">
                        ({formatPrice(product.price)})
                      </span>
                    </span>
                  </label>
                  {selected && (
                    <Input
                      type="number"
                      min="1"
                      step="1"
                      value={selected.quantity}
                      onChange={(event) =>
                        handleProductQuantityChange(product.id, event.target.value)
                      }
                      className="h-8 w-20"
                      aria-label={`Quantity for ${product.name}`}
                    />
                  )}
                </div>
              );
            })
          )}
        </div>
        {values.product_items.length > 0 && (
          <div className="space-y-1 rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground">
            {values.product_items.map((item) => {
              const product = products.find((p) => String(p.id) === item.product_id);
              if (!product) return null;
              const lineTotal = calculateTotalPrice(products, [item]);
              return (
                <p key={item.product_id}>
                  {product.name}: {formatPrice(product.price)} × {item.quantity || 0} ={" "}
                  {formatPrice(lineTotal)}
                </p>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-total-price`}>Total price (€)</Label>
          <Input
            id={`${idPrefix}-total-price`}
            type="text"
            readOnly
            value={values.total_price ? formatPrice(values.total_price) : "—"}
            className="bg-muted/50"
          />
          <p className="text-xs text-muted-foreground">
            Calculated from all selected products
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-status`}>Status</Label>
          <Select id={`${idPrefix}-status`} value={values.status} onChange={set("status")}>
            {ORDER_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-order-date`}>Order date</Label>
          <Input
            id={`${idPrefix}-order-date`}
            type="date"
            value={values.order_date}
            onChange={set("order_date")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-delivery-date`}>Delivery date</Label>
          <Input
            id={`${idPrefix}-delivery-date`}
            type="date"
            value={values.delivery_date}
            onChange={set("delivery_date")}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-delivery-address`}>Delivery address</Label>
        <Input
          id={`${idPrefix}-delivery-address`}
          value={values.delivery_address}
          onChange={set("delivery_address")}
          placeholder="123 Main St, Paris"
        />
      </div>
    </div>
  );
}

export function emptyOrderForm() {
  return {
    client_id: "",
    product_items: [],
    total_price: "",
    status: "pending",
    order_date: "",
    delivery_date: "",
    delivery_address: "",
  };
}

export function orderToForm(order, products = []) {
  const firstClient = order?.clients?.[0];

  const form = {
    client_id: firstClient?.id != null ? String(firstClient.id) : "",
    product_items: (order?.products ?? []).map((product) => ({
      product_id: String(product.id),
      quantity: product.pivot?.quantity != null ? String(product.pivot.quantity) : "1",
    })),
    total_price: order?.total_price != null ? String(order.total_price) : "",
    status: order?.status ?? "pending",
    order_date: order?.order_date ? order.order_date.slice(0, 10) : "",
    delivery_date: order?.delivery_date ? order.delivery_date.slice(0, 10) : "",
    delivery_address: order?.delivery_address ?? "",
  };

  if (products.length > 0 && form.product_items.length > 0) {
    return withCalculatedTotal(form, products);
  }

  return form;
}

export function formToPayload(values) {
  return {
    client_ids: [Number(values.client_id)],
    products: values.product_items.map((item) => ({
      id: Number(item.product_id),
      quantity: Number(item.quantity),
    })),
    total_price: Number(values.total_price),
    status: values.status,
    order_date: values.order_date,
    delivery_date: values.delivery_date,
    delivery_address: values.delivery_address.trim(),
  };
}

export function validateOrderForm(values) {
  if (!values.client_id) {
    return "Select a client.";
  }
  if (values.product_items.length === 0) {
    return "Select at least one product.";
  }
  for (const item of values.product_items) {
    if (
      item.quantity === "" ||
      Number(item.quantity) < 1 ||
      !Number.isInteger(Number(item.quantity))
    ) {
      return "Each product must have a valid quantity.";
    }
  }
  if (values.total_price === "" || Number(values.total_price) <= 0) {
    return "Total price must be calculated from valid products and quantities.";
  }
  if (!values.order_date) {
    return "Order date is required.";
  }
  if (!values.delivery_date) {
    return "Delivery date is required.";
  }
  if (values.delivery_date < values.order_date) {
    return "Delivery date must be on or after the order date.";
  }
  if (!values.delivery_address.trim()) {
    return "Delivery address is required.";
  }
  return "";
}

export function formatOrderClients(clients) {
  if (!clients?.length) return "—";
  return clients.map((c) => `${c.first_name} ${c.last_name}`).join(", ");
}

export function formatOrderProducts(products) {
  if (!products?.length) return "—";
  return products
    .map((p) => `${p.name} ×${p.pivot?.quantity ?? 1}`)
    .join(", ");
}

export function formatDate(dateString) {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function statusLabel(status) {
  return ORDER_STATUSES.find((s) => s.value === status)?.label ?? status;
}

export function statusClassName(status) {
  switch (status) {
    case "delivered":
      return "rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary";
    case "cancelled":
      return "rounded-full bg-destructive/10 px-2 py-0.5 text-xs text-destructive";
    case "shipped":
    case "confirmed":
      return "rounded-full bg-blue-500/10 px-2 py-0.5 text-xs text-blue-600";
    default:
      return "rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground";
  }
}
