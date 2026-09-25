# NanoTech Itahari — Enterprise E-Commerce & Hardware Studio

Official production deployment: **[https://nanotech-itahari.vercel.app](https://nanotech-itahari.vercel.app)**

## Dedicated Portal & Search URLs (Same Domain)

| Service | Dedicated URL Endpoint | Description |
| :--- | :--- | :--- |
| **Main Storefront** | [https://nanotech-itahari.vercel.app/store](https://nanotech-itahari.vercel.app/store) | Public hardware store & customer marketplace (also `/`) |
| **Store Catalog** | [https://nanotech-itahari.vercel.app/store/products](https://nanotech-itahari.vercel.app/store/products) | Browse all components, laptops, and custom builds |
| **Store PC Builder** | [https://nanotech-itahari.vercel.app/store/pc-builder](https://nanotech-itahari.vercel.app/store/pc-builder) | Interactive PC Builder studio with AM5/LGA compat |
| **Store Cart** | [https://nanotech-itahari.vercel.app/store/cart](https://nanotech-itahari.vercel.app/store/cart) | Shopping cart & checkout flow |
| **User Marketplace Search** | [https://nanotech-itahari.vercel.app/search](https://nanotech-itahari.vercel.app/search) | Dedicated customer marketplace search (or `/store/search`) |
| **Admin Portal** | [https://nanotech-itahari.vercel.app/admin](https://nanotech-itahari.vercel.app/admin) | Enterprise staff administration & operations console |
| **Admin Dashboard** | [https://nanotech-itahari.vercel.app/admin/dashboard](https://nanotech-itahari.vercel.app/admin/dashboard) | Live overview, inventory, orders, revenue & accounting |
| **Admin Login** | [https://nanotech-itahari.vercel.app/admin/login](https://nanotech-itahari.vercel.app/admin/login) | Staff and administrative authentication gate |
| **Admin Global Search** | [https://nanotech-itahari.vercel.app/admin/search](https://nanotech-itahari.vercel.app/admin/search) | Internal operational catalog, customer & ledger search |
| **Superadmin Console** | [https://nanotech-itahari.vercel.app/superadmin](https://nanotech-itahari.vercel.app/superadmin) | Executive root console reserved for Kalam |
| **Superadmin Dashboard** | [https://nanotech-itahari.vercel.app/superadmin/dashboard](https://nanotech-itahari.vercel.app/superadmin/dashboard) | Master system health, governance, and audit trails |
| **Superadmin Login** | [https://nanotech-itahari.vercel.app/superadmin/login](https://nanotech-itahari.vercel.app/superadmin/login) | Root-tier master authentication gate |
| **Superadmin Manage Admins** | [https://nanotech-itahari.vercel.app/superadmin/admins](https://nanotech-itahari.vercel.app/superadmin/admins) | Provision, revoke, or modify administrator accounts |
| **Superadmin Master Search** | [https://nanotech-itahari.vercel.app/superadmin/search](https://nanotech-itahari.vercel.app/superadmin/search) | Master search across admins, permissions, and audit logs |

## Tech Stack
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, Recharts
- **Backend & Database**: Supabase (PostgreSQL, Auth, Storage)
- **Deployment**: Vercel CI/CD via GitHub (`main` branch)
