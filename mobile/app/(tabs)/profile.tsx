import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Auth from '../../components/Auth'
import Account from '../../components/Account'
import { View } from 'react-native'
import { Session } from '@supabase/supabase-js'
import { useAuth } from '../_layout'

export default function App() {
  // const [session, setSession] = useState<Session | null>(null)
  const session = useAuth((state: any) => state.session)
  console.log(session) // 打印 session

  return (
    <View>
      {session && session.user ? <Account key={session.user.id} session={session} /> : <Auth />}
    </View>
  )
}