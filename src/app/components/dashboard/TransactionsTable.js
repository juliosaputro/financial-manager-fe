'use client';

import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';

export default function TransactionsTable({ title, columns, data }) {
  const table = useMaterialReactTable({
    columns,
    data,
    // Optional: disable some features for a cleaner look on the dashboard
    enableTopToolbar: false,
    enableBottomToolbar: false,
    enableColumnActions: false,
  });

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">{title}</h2>
      <MaterialReactTable table={table} />
    </div>
  );
}