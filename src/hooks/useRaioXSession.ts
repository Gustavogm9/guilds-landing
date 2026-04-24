import { useState, useEffect } from 'react';
import { supabaseRaiox } from '@/lib/supabase-raiox';
import { Session, User } from '@supabase/supabase-js';

export function useRaioXSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const initSession = async () => {
      try {
        const { data: { session }, error } = await supabaseRaiox.auth.getSession();
        if (error) throw error;
        
        setSession(session);
        setUser(session?.user || null);
      } catch (err) {
        console.error('Error fetching Raio-X session:', err);
      } finally {
        setLoading(false);
      }
    };

    initSession();

    // Listen for auth changes
    const { data: { subscription } } = supabaseRaiox.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user || null);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabaseRaiox.auth.signOut();
  };

  return { session, user, loading, signOut };
}
