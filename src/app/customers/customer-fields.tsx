const inputClass =
  "mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

type CustomerFieldValues = {
  name?: string;
  contact?: string | null;
  email?: string | null;
  address?: string | null;
  notes?: string | null;
};

export default function CustomerFields({ customer = {} }: { customer?: CustomerFieldValues }) {
  return (
    <>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-700">
          Customer name *
        </label>
        <input
          id="name"
          name="name"
          required
          defaultValue={customer.name ?? ""}
          className={inputClass}
          placeholder="Karen Willis or Springfield Auto Body"
        />
      </div>
      <div>
        <label htmlFor="contact" className="block text-sm font-medium text-slate-700">
          Phone / contact
        </label>
        <input
          id="contact"
          name="contact"
          defaultValue={customer.contact ?? ""}
          className={inputClass}
          placeholder="(555) 201-8834"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          defaultValue={customer.email ?? ""}
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-slate-700">
          Address
        </label>
        <input
          id="address"
          name="address"
          defaultValue={customer.address ?? ""}
          className={inputClass}
          placeholder="123 Main St, Springfield"
        />
      </div>
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-slate-700">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          defaultValue={customer.notes ?? ""}
          className={inputClass}
          placeholder="Gate code, dog in yard, preferred contact times..."
        />
      </div>
    </>
  );
}
