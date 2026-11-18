import type { SaaSVenture } from '../data/portfolio';

interface VenturePreviewProps {
  variant: SaaSVenture['previewVariant'];
}

export function VenturePreview({ variant }: VenturePreviewProps) {
  switch (variant) {
    case 'tidyflow':
      return (
        <div
          aria-hidden="true"
          className="rounded-2xl border border-[#e3dcf5] bg-[#f6f3ff] p-4 text-xs"
        >
          <div className="flex items-center justify-between border-b border-[#e3dcf5] pb-2 font-mono text-[11px] text-[#5e567a]">
            <span>Daily Crew Dispatch</span>
            <span className="tabular-nums text-[#5b21b6]">GPS Verified · 3 Active</span>
          </div>
          <div className="mt-3 space-y-2">
            {[
              { job: 'Northside Office Suite', crew: 'Crew A · 09:00', state: 'On site' },
              { job: 'Harbor Medical Clinic', crew: 'Crew B · 11:30', state: 'Checklist 8/8' },
              { job: 'QuickBooks Daily Sync', crew: 'Automated', state: 'Synced' },
            ].map((row) => (
              <div
                key={row.job}
                className="flex items-center justify-between rounded-xl border border-[#e8e2f6] bg-white px-3 py-2"
              >
                <span className="font-medium text-[#15102b]">{row.job}</span>
                <span className="font-mono text-[11px] text-[#5e567a] tabular-nums">
                  {row.crew} · {row.state}
                </span>
              </div>
            ))}
          </div>
        </div>
      );

    case 'tidyagent':
      return (
        <div
          aria-hidden="true"
          className="rounded-2xl border border-[#e3dcf5] bg-[#f6f3ff] p-4 text-xs"
        >
          <div className="flex items-center justify-between border-b border-[#e3dcf5] pb-2 font-mono text-[11px] text-[#5e567a]">
            <span>Agent Operations Queue</span>
            <span className="tabular-nums text-[#5b21b6]">Guardrailed Execution</span>
          </div>
          <div className="mt-3 space-y-2">
            <div className="rounded-xl border border-[#e8e2f6] bg-white px-3 py-2.5">
              <p className="font-medium text-[#15102b]">Reschedule Request #418</p>
              <p className="mt-0.5 text-[11px] text-[#5e567a]">
                Verified crew capacity for Thu 14:00 · Drafted client confirmation
              </p>
            </div>
            <div className="rounded-xl border border-[#e8e2f6] bg-white px-3 py-2.5">
              <p className="font-medium text-[#15102b]">Shift Handoff Digest</p>
              <p className="mt-0.5 text-[11px] text-[#5e567a]">
                Compiled 14 completed checklists &amp; flagged 1 supply restock
              </p>
            </div>
          </div>
        </div>
      );

    case 'tidysync':
      return (
        <div
          aria-hidden="true"
          className="rounded-2xl border border-[#e3dcf5] bg-[#f6f3ff] p-4 text-xs"
        >
          <div className="flex items-center justify-between border-b border-[#e3dcf5] pb-2 font-mono text-[11px] text-[#5e567a]">
            <span>Shopify Store Pipeline</span>
            <span className="tabular-nums text-[#5b21b6]">App Store Verified</span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2.5 text-center font-mono text-[11px]">
            <div className="rounded-xl border border-[#e8e2f6] bg-white p-2.5">
              <p className="font-semibold text-[#15102b] tabular-nums">Catalog</p>
              <p className="mt-0.5 text-[#5e567a]">2-Way Sync</p>
            </div>
            <div className="rounded-xl border border-[#e8e2f6] bg-white p-2.5">
              <p className="font-semibold text-[#15102b] tabular-nums">Orders</p>
              <p className="mt-0.5 text-[#5e567a]">Webhooks</p>
            </div>
            <div className="rounded-xl border border-[#e8e2f6] bg-white p-2.5">
              <p className="font-semibold text-[#5b21b6] tabular-nums">Sheets</p>
              <p className="mt-0.5 text-[#5e567a]">Live Mirror</p>
            </div>
          </div>
        </div>
      );

    case 'stocksentry':
      return (
        <div
          aria-hidden="true"
          className="rounded-2xl border border-[#e3dcf5] bg-[#f6f3ff] p-4 text-xs"
        >
          <div className="flex items-center justify-between border-b border-[#e3dcf5] pb-2 font-mono text-[11px] text-[#5e567a]">
            <span>SKU Threshold Monitor</span>
            <span className="tabular-nums text-[#5b21b6]">Velocity Guard Active</span>
          </div>
          <div className="mt-3 space-y-2">
            {[
              { sku: 'SKU-204 · Ceramic Diffuser', stock: '7 units left', action: 'Reorder Alert' },
              { sku: 'SKU-119 · Travel Kit Pro', stock: '84 units', action: 'Protected' },
            ].map((item) => (
              <div
                key={item.sku}
                className="flex items-center justify-between rounded-xl border border-[#e8e2f6] bg-white px-3 py-2"
              >
                <span className="font-medium text-[#15102b]">{item.sku}</span>
                <span className="font-mono text-[11px] text-[#5e567a] tabular-nums">
                  {item.stock} · {item.action}
                </span>
              </div>
            ))}
          </div>
        </div>
      );

    case 'aftersale':
      return (
        <div
          aria-hidden="true"
          className="rounded-2xl border border-[#e3dcf5] bg-[#f6f3ff] p-4 text-xs"
        >
          <div className="flex items-center justify-between border-b border-[#e3dcf5] pb-2 font-mono text-[11px] text-[#5e567a]">
            <span>Warranty &amp; Claims Portal</span>
            <span className="tabular-nums text-[#5b21b6]">Order #SH-8841</span>
          </div>
          <div className="mt-3 space-y-2">
            {[
              { step: '01. Product Registered', meta: '24-Month Coverage Issued' },
              { step: '02. Claim Submitted', meta: '2 Photos Attached · Validated' },
              { step: '03. Certificate & Email', meta: 'Approved · Auto-Dispatched' },
            ].map((item) => (
              <div
                key={item.step}
                className="flex items-center justify-between rounded-xl border border-[#e8e2f6] bg-white px-3 py-2"
              >
                <span className="font-medium text-[#15102b]">{item.step}</span>
                <span className="font-mono text-[11px] text-[#5e567a]">{item.meta}</span>
              </div>
            ))}
          </div>
        </div>
      );

    case 'slotwise':
      return (
        <div
          aria-hidden="true"
          className="rounded-2xl border border-[#e3dcf5] bg-[#f6f3ff] p-4 text-xs"
        >
          <div className="flex items-center justify-between border-b border-[#e3dcf5] pb-2 font-mono text-[11px] text-[#5e567a]">
            <span>Embeddable Booking Widget</span>
            <span className="tabular-nums text-[#5b21b6]">UTC-Safe Slots</span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 font-mono text-[11px] tabular-nums">
            {['09:00', '09:30', '10:00', '10:30', '11:00', '11:30'].map((slot, idx) => (
              <div
                key={slot}
                className={`rounded-xl border px-2 py-2 text-center font-medium ${
                  idx === 2
                    ? 'border-[#5b21b6] bg-[#5b21b6] text-white'
                    : 'border-[#e8e2f6] bg-white text-[#15102b]'
                }`}
              >
                {slot}
              </div>
            ))}
          </div>
        </div>
      );
  }
}
