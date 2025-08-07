import { supabase } from "@/integrations/supabase/client";

export const createDemoSessionToken = async (staffId: string) => {
  try {
    // For demo purposes, we'll create a simple session token
    // In production, this would be a secure JWT or similar
    const demoToken = `demo_session_${staffId}_${Date.now()}`;
    
    // Store in localStorage for demo purposes
    localStorage.setItem('demo_session_token', demoToken);
    localStorage.setItem('demo_staff_id', staffId);
    
    return { success: true, token: demoToken };
  } catch (error) {
    console.error('Error creating demo session:', error);
    return { success: false, error };
  }
};

export const validateDemoSession = async () => {
  try {
    const token = localStorage.getItem('demo_session_token');
    const staffId = localStorage.getItem('demo_staff_id');
    
    if (!token || !staffId) {
      return { valid: false };
    }

    // Validate staff record still exists
    const { data: staffData, error } = await supabase
      .from('staff')
      .select('*, vendors(*)')
      .eq('id', staffId)
      .single();

    if (error || !staffData) {
      return { valid: false };
    }

    return { 
      valid: true, 
      staff: staffData,
      token 
    };
  } catch (error) {
    console.error('Error validating demo session:', error);
    return { valid: false, error };
  }
};

export const clearDemoSession = () => {
  localStorage.removeItem('demo_session_token');
  localStorage.removeItem('demo_staff_id');
};

export const isDemoUser = (email?: string) => {
  return email === 'admin@demo.com';
};