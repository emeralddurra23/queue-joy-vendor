import { supabase } from "@/integrations/supabase/client";

export const setupDemoUser = async () => {
  try {
    // Check if demo user already exists by trying to sign in
    const { data: existingSession, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'admin@demo.com',
      password: 'demo123'
    });

    if (existingSession?.user) {
      console.log('Demo user already exists');
      return { success: true, user: existingSession.user };
    }

    // If user doesn't exist, create them
    if (signInError?.message.includes('Invalid login credentials')) {
      console.log('Creating demo user...');
      
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: 'admin@demo.com',
        password: 'demo123',
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        }
      });

      if (signUpError) {
        console.error('Error creating demo user:', signUpError);
        return { success: false, error: signUpError };
      }

      if (signUpData.user) {
        // Update the staff record with the correct user_id
        const { error: updateError } = await supabase
          .from('staff')
          .update({ user_id: signUpData.user.id })
          .eq('email', 'admin@demo.com');

        if (updateError) {
          console.error('Error updating staff record:', updateError);
        }

        console.log('Demo user created successfully');
        return { success: true, user: signUpData.user };
      }
    }

    return { success: false, error: signInError };
  } catch (error) {
    console.error('Setup demo user error:', error);
    return { success: false, error };
  }
};