'use client';

import { usePathname } from 'next/navigation';
import { Avatar, IconButton, Tooltip } from '@mui/material';

function capitalizeFirstLetter(string) {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function Navbar() {
  const pathname = usePathname();
  // Contoh: "/pages/dashboard" -> "dashboard" -> "Dashboard"
  const pageTitle = capitalizeFirstLetter(pathname.split('/').pop());

  return (
    <header className="bg-white shadow-sm flex items-center justify-between px-6 py-3 z-10">
      {/* Judul Halaman */}
      <h2 className="text-xl font-semibold text-gray-700">{pageTitle || 'Dashboard'}</h2>

      {/* Aksi di sisi kanan */}
      <div className="flex items-center">
        <Tooltip title="User Profile">
          <IconButton>
            <Avatar sx={{ width: 32, height: 32 }}>U</Avatar>
          </IconButton>
        </Tooltip>
      </div>
    </header>
  );
}