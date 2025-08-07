import { supabase } from "@/integrations/supabase/client";

interface DemoUserResult {
  success: boolean;
  user?: any;
  error?: any;
  needsConfirmation?: boolean;
}

export const setupDemoUser = async (): Promise<DemoUserResult> => {
  try {
    // First, check if demo user already exists and is confirmed
    const { data: existingSession, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'admin@demo.com',
      password: 'demo123'
    });

    if (existingSession?.user) {
      console.log('Demo user already exists and is authenticated');
      return { success: true, user: existingSession.user };
    }

    // Handle different error cases
    if (signInError) {
      console.log('Sign in error:', signInError.message);
      
      // If user doesn't exist, create them
      if (signInError.message.includes('Invalid login credentials')) {
        console.log('Creating new demo user...');
        return await createDemoUser();
      }
      
      // If email not confirmed, try to handle it
      if (signInError.message.includes('Email not confirmed')) {
        console.log('Demo user exists but email not confirmed, attempting to confirm...');
        // For demo purposes, we'll create a new user since we can't easily confirm the existing one
        return await createDemoUser();
      }
    }

    return { success: false, error: signInError };
  } catch (error) {
    console.error('Setup demo user error:', error);
    return { success: false, error };
  }
};

const createDemoUser = async (): Promise<DemoUserResult> => {
  try {
    console.log('Creating demo user with email confirmation bypass...');
    
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: 'admin@demo.com',
      password: 'demo123',
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: {
          demo_user: true,
          role: 'owner'
        }
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
      } else {
        console.log('Staff record updated successfully');
      }

      console.log('Demo user created successfully');
      return { 
        success: true, 
        user: signUpData.user,
        needsConfirmation: !signUpData.session // If no session, email confirmation is required
      };
    }

    return { success: false, error: new Error('Failed to create user') };
  } catch (error) {
    console.error('Create demo user error:', error);
    return { success: false, error };
  }
};