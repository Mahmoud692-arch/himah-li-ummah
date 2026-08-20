import { supabase } from "@/lib/supabase/client";
import type { LoginInput, RegisterInput } from "@/lib/validators/auth";

export const authService = {
  // Sign up with email and password
  async signUp(data: RegisterInput) {
    const { email, password, full_name } = data;
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
        },
      },
    });

    if (authError) throw authError;

    // Create user profile
    if (authData.user?.id) {
      const { error: profileError } = await supabase.from("users").insert([
        {
          id: authData.user.id,
          email,
          full_name,
          role: "user",
        },
      ]);

      if (profileError) throw profileError;

      // Initialize user points
      await supabase.from("user_points").insert([
        {
          user_id: authData.user.id,
          points: 0,
          level: 1,
          total_points_earned: 0,
        },
      ]);
    }

    return authData;
  },

  // Sign in with email and password
  async signIn(data: LoginInput) {
    const { email, password } = data;
    
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return authData;
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Reset password
  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${import.meta.env.VITE_APP_URL}/auth/update-password`,
    });
    if (error) throw error;
  },

  // Update password
  async updatePassword(password: string) {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
  },

  // Get current session
  async getSession() {
    const { data } = await supabase.auth.getSession();
    return data.session;
  },

  // Get current user
  async getUser() {
    const { data } = await supabase.auth.getUser();
    return data.user;
  },

  // Listen to auth state changes
  onAuthStateChange(callback: (session: any) => void) {
    return supabase.auth.onAuthStateChange((_, session) => {
      callback(session);
    });
  },
};
