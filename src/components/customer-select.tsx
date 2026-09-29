"use client";

export type CustomerOption = {
  id: string;
  name: string;
  contact: string | null;
  address: string | null;
};

// Picking a customer fills in the job's customer name, contact, and location fields
// (which stay editable) so the work order and the customer record stay linked.
export default function CustomerSelect({
  customers,
  defaultValue,
  className,
}: {
  customers: CustomerOption[];
  defaultValue?: string | null;
  className?: string;
}) {
  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const customer = customers.find((c) => c.id === event.target.value);
    const form = event.target.form;
    if (!customer || !form) return;

    const fill = (name: string, value: string | null) => {
      const input = form.elements.namedItem(name);
      if (value && (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement)) {
        input.value = value;
      }
    };
    fill("customerName", customer.name);
    fill("customerContact", customer.contact);
    fill("location", customer.address);
  }

  return (
    <select
      id="customerId"
      name="customerId"
      defaultValue={defaultValue ?? ""}
      onChange={handleChange}
      className={className}
    >
      <option value="">— No saved customer —</option>
      {customers.map((c) => (
        <option key={c.id} value={c.id}>
          {c.name}
        </option>
      ))}
    </select>
  );
}
