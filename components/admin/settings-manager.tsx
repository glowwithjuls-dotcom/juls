'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';

interface Settings {
  allowPayOnDelivery?: boolean;
  whatsappNumber?: string;
  supportEmail?: string;
  supportPhone?: string;
}

interface Zone {
  id: string;
  zone: string;
  fee: number;
  regions: string[];
}

export function SettingsManager({ settings, zones }: { settings: Settings | null; zones: Zone[] }) {
  const [form, setForm] = useState({
    allowPayOnDelivery: settings?.allowPayOnDelivery ?? true,
    whatsappNumber: settings?.whatsappNumber ?? '',
    supportEmail: settings?.supportEmail ?? '',
    supportPhone: settings?.supportPhone ?? '',
  });
  const [zoneList, setZoneList] = useState(zones);
  const [newZone, setNewZone] = useState({ zone: '', fee: 0, regions: '' });

  const saveSettings = async () => {
    const response = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (!response.ok) {
      toast.error('Failed to save settings');
      return;
    }
    toast.success('Settings updated');
  };

  const saveZone = async (zone: Zone) => {
    const response = await fetch(`/api/admin/delivery-zones/${zone.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...zone, regions: zone.regions }),
    });
    if (!response.ok) {
      toast.error('Unable to update zone');
      return;
    }
    toast.success('Zone updated');
  };

  const createZone = async () => {
    if (!newZone.zone) return;
    const payload = {
      zone: newZone.zone,
      fee: newZone.fee,
      regions: newZone.regions
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    };
    const response = await fetch('/api/admin/delivery-zones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      toast.error('Unable to add zone');
      return;
    }
    const data = await response.json();
    setZoneList((current) => [...current, { ...data, fee: Number(data.fee) }]);
    setNewZone({ zone: '', fee: 0, regions: '' });
    toast.success('Zone added');
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-gray-200 bg-white p-6">
        <h2 className="font-semibold text-charcoal">Checkout preferences</h2>
        <div className="mt-4 space-y-3">
          <label className="flex items-center gap-3 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={form.allowPayOnDelivery}
              onChange={(event) => setForm((prev) => ({ ...prev, allowPayOnDelivery: event.target.checked }))}
            />
            Allow pay on delivery
          </label>
          <div>
            <label className="text-sm text-gray-600">WhatsApp number</label>
            <Input value={form.whatsappNumber} onChange={(event) => setForm((prev) => ({ ...prev, whatsappNumber: event.target.value }))} />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="text-sm text-gray-600">Support email</label>
              <Input value={form.supportEmail} onChange={(event) => setForm((prev) => ({ ...prev, supportEmail: event.target.value }))} />
            </div>
            <div>
              <label className="text-sm text-gray-600">Support phone</label>
              <Input value={form.supportPhone} onChange={(event) => setForm((prev) => ({ ...prev, supportPhone: event.target.value }))} />
            </div>
          </div>
          <Button onClick={saveSettings}>Save settings</Button>
        </div>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white p-6">
        <h2 className="font-semibold text-charcoal">Delivery zones</h2>
        <div className="mt-4 space-y-4">
          {zoneList.map((zone) => (
            <div key={zone.id} className="rounded-2xl border border-gray-100 p-4">
              <div className="flex flex-wrap items-center gap-3">
                <input
                  className="rounded-lg border border-gray-200 px-3 py-1 text-sm"
                  value={zone.zone}
                  onChange={(event) =>
                    setZoneList((current) => current.map((entry) => (entry.id === zone.id ? { ...entry, zone: event.target.value } : entry)))
                  }
                />
                <input
                  type="number"
                  className="w-24 rounded-lg border border-gray-200 px-3 py-1 text-sm"
                  value={zone.fee}
                  onChange={(event) =>
                    setZoneList((current) =>
                      current.map((entry) => (entry.id === zone.id ? { ...entry, fee: Number(event.target.value) } : entry)),
                    )
                  }
                />
                <input
                  className="flex-1 rounded-lg border border-gray-200 px-3 py-1 text-sm"
                  value={zone.regions.join(', ')}
                  onChange={(event) =>
                    setZoneList((current) =>
                      current.map((entry) =>
                        entry.id === zone.id
                          ? { ...entry, regions: event.target.value.split(',').map((item) => item.trim()).filter(Boolean) }
                          : entry,
                      ),
                    )
                  }
                />
                <Button size="sm" onClick={() => saveZone(zone)}>
                  Save
                </Button>
              </div>
            </div>
          ))}

          <div className="rounded-2xl border border-dashed border-gray-200 p-4">
            <p className="text-sm font-semibold text-gray-600">Add zone</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Input placeholder="Zone name" value={newZone.zone} onChange={(event) => setNewZone((prev) => ({ ...prev, zone: event.target.value }))} />
              <Input
                type="number"
                placeholder="Fee"
                value={newZone.fee}
                onChange={(event) => setNewZone((prev) => ({ ...prev, fee: Number(event.target.value) }))}
                className="w-24"
              />
              <Input
                placeholder="Regions (comma separated)"
                value={newZone.regions}
                onChange={(event) => setNewZone((prev) => ({ ...prev, regions: event.target.value }))}
              />
              <Button onClick={createZone}>Add</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
