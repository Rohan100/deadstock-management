import AdminUsersPage from '@/components/admin/user/AdminUsersPage'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import React from 'react'

async function page() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/login')
  }

  if (!session.user.isAdmin) {
    redirect('/dashboard')
  }

  return (
    <AdminUsersPage />
  )
}

export default page
