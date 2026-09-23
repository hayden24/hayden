"use client";

import { useActionState } from "react";
import type { Customer } from "@prisma/client";
import { updateCustomerSpecs } from "../../actions";
import { Field } from "../../field";

export default function SpecsForm({ customer }: { customer: Customer }) {
  const boundAction = updateCustomerSpecs.bind(null, customer.id);
  const [state, formAction, pending] = useActionState(boundAction, undefined);

  return (
    <form action={formAction} className="space-y-4 rounded-lg border border-slate-200 bg-white p-4">
      <fieldset className="grid grid-cols-2 gap-3">
        <legend className="col-span-full mb-1 text-sm font-semibold text-slate-900">
          Devices &amp; finishes
        </legend>
        <Field
          id="outletColor"
          name="outletColor"
          label="Outlet color"
          list="colors"
          defaultValue={customer.outletColor}
        />
        <Field
          id="switchColor"
          name="switchColor"
          label="Switch color"
          list="colors"
          defaultValue={customer.switchColor}
        />
        <Field
          id="coverPlateColor"
          name="coverPlateColor"
          label="Cover plate color"
          list="colors"
          defaultValue={customer.coverPlateColor}
        />
        <Field
          id="coverPlateType"
          name="coverPlateType"
          label="Cover plate type"
          list="plate-types"
          defaultValue={customer.coverPlateType}
        />
        <Field
          id="deviceStyle"
          name="deviceStyle"
          label="Device style"
          list="device-styles"
          defaultValue={customer.deviceStyle}
        />
        <Field
          id="deviceBrand"
          name="deviceBrand"
          label="Device brand"
          list="device-brands"
          defaultValue={customer.deviceBrand}
        />
      </fieldset>

      <fieldset className="grid grid-cols-2 gap-3 border-t border-slate-200 pt-4">
        <legend className="col-span-full mb-1 pt-4 text-sm font-semibold text-slate-900">
          Service
        </legend>
        <Field
          id="serviceType"
          name="serviceType"
          label="Service drop"
          list="service-types"
          defaultValue={customer.serviceType}
        />
        <Field
          id="utilityCompany"
          name="utilityCompany"
          label="Utility company"
          defaultValue={customer.utilityCompany}
        />
        <Field
          id="meterNumber"
          name="meterNumber"
          label="Meter number"
          defaultValue={customer.meterNumber}
          className="col-span-2"
        />
      </fieldset>

      {state?.success && (
        <p className="text-sm text-green-600" role="status">
          Saved.
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {pending ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
