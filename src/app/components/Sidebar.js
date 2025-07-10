'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import CategoryIcon from '@mui/icons-material/Category';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { IconButton, Tooltip } from '@mui/material';

const navItems = [
  { href: '/pages/dashboard', label: 'Dashboard', icon: DashboardIcon },
  {
    href: '/pages/income',
    label: 'Income',
    icon: TrendingUpIcon,
  },
  {
    href: '/pages/expense',
    label: 'Expense',
    icon: TrendingDownIcon,
  },
  { href: '/pages/kategori', label: 'Kategori', icon: CategoryIcon },
];

export default function Sidebar({ isCollapsed, setCollapsed }) {
  const pathname = usePathname();

  return (
    <aside
      className={`bg-white shadow-md flex flex-col transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className="relative flex h-[65px] items-center justify-center border-b p-4">
        <div className="flex items-center gap-3">
          <AccountBalanceWalletIcon className="h-8 w-8 text-blue-600 flex-shrink-0" />
          <h1
            className={`whitespace-nowrap text-2xl font-bold text-gray-800 transition-all duration-300 ${
              isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
            }`}
          >
            FinManager
          </h1>
        </div>
        <IconButton
          onClick={() => setCollapsed(!isCollapsed)}
          size="small"
          className="absolute right-4 top-1/2 -translate-y-1/2"
        >
          <ChevronLeftIcon
            className={`transition-transform duration-300 ${
              isCollapsed ? 'rotate-180' : 'rotate-0'
            }`}
          />
        </IconButton>
      </div>

      <nav className="mt-4 flex-1">
        <ul>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href} className="px-3">
                <Tooltip title={isCollapsed ? item.label : ''} placement="right">
                  <Link
                    href={item.href}
                    className={`flex items-center p-3 my-1 rounded-lg transition-colors ${
                      isCollapsed ? 'justify-center' : 'gap-4'
                    } ${
                      isActive
                        ? 'bg-blue-100 text-blue-700 font-semibold'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className="h-6 w-6 flex-shrink-0" />
                    <span
                      className={`whitespace-nowrap transition-opacity duration-200 ${
                        isCollapsed ? 'opacity-0 w-0' : 'opacity-100'
                      }`}
                    >
                      {item.label}
                    </span>
                  </Link>
                </Tooltip>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}