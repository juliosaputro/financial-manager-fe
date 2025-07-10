'use client';

import { formattedToIDR } from "@/app/constants/formattedtoIDR";

export default function SummaryCard({ icon: Icon, title, value, color }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
      <div className={`bg-gray-100 p-3 rounded-full ${color}`}>
        <Icon style={{ fontSize: '2rem' }} />
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800">Rp {formattedToIDR(value)}</p>
      </div>
    </div>
  );
}