import AdminSidebar from '@/components/admin/Sidebar'
import "@/app/globals.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen bg-sl-dark text-sl-text">
          <AdminSidebar />
          <main className="flex-1 p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
