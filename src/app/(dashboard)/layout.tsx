import { Header } from '@/components/layout/Header'
import { getUser, getProfile } from '@/lib/auth/actions'
import { redirect } from 'next/navigation'
import { Database } from '@/types/database'

type Profile = Database['public']['Tables']['profiles']['Row']

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()

  if (!user) {
    redirect('/login')
  }

  const profile = await getProfile() as Profile | null

  return (
    <div className="min-h-screen bg-background">
      <Header
        userName={profile?.display_name ?? undefined}
        userEmail={user.email ?? undefined}
      />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
