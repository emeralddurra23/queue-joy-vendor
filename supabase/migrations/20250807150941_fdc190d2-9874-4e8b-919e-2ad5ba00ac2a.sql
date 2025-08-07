-- Create enum types
CREATE TYPE public.queue_status AS ENUM ('waiting', 'ordering', 'preparing', 'ready', 'completed', 'abandoned');
CREATE TYPE public.user_role AS ENUM ('owner', 'staff');
CREATE TYPE public.notification_type AS ENUM ('in_app', 'sms', 'whatsapp');

-- Create vendors table
CREATE TABLE public.vendors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  api_endpoint TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create staff/users table
CREATE TABLE public.staff (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role public.user_role NOT NULL DEFAULT 'staff',
  qr_badge_code TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create menu items table
CREATE TABLE public.menu_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price DECIMAL(10,2),
  prep_time_minutes INTEGER DEFAULT 0,
  is_special BOOLEAN DEFAULT false,
  is_bestseller BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create queue tickets table
CREATE TABLE public.queue_tickets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  ticket_number INTEGER NOT NULL,
  ticket_code TEXT NOT NULL UNIQUE,
  customer_name TEXT,
  customer_phone TEXT,
  status public.queue_status NOT NULL DEFAULT 'waiting',
  estimated_wait_minutes INTEGER DEFAULT 0,
  actual_wait_minutes INTEGER,
  order_start_time TIMESTAMP WITH TIME ZONE,
  prep_start_time TIMESTAMP WITH TIME ZONE,
  ready_time TIMESTAMP WITH TIME ZONE,
  completed_time TIMESTAMP WITH TIME ZONE,
  abandoned_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id UUID NOT NULL REFERENCES public.queue_tickets(id) ON DELETE CASCADE,
  menu_item_id UUID NOT NULL REFERENCES public.menu_items(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  special_instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id UUID NOT NULL REFERENCES public.queue_tickets(id) ON DELETE CASCADE,
  type public.notification_type NOT NULL,
  message TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  delivered BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create daily stats table
CREATE TABLE public.daily_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_customers INTEGER DEFAULT 0,
  avg_wait_minutes DECIMAL(5,2) DEFAULT 0,
  abandonment_rate DECIMAL(5,2) DEFAULT 0,
  peak_hour INTEGER, -- hour of day (0-23)
  revenue DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(vendor_id, date)
);

-- Enable Row Level Security
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.queue_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_stats ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for staff access
CREATE POLICY "Staff can view their vendor data" ON public.vendors FOR SELECT TO authenticated USING (
  id IN (SELECT vendor_id FROM public.staff WHERE user_id = auth.uid())
);

CREATE POLICY "Staff can view their own record" ON public.staff FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Staff can view their vendor's menu items" ON public.menu_items FOR SELECT TO authenticated USING (
  vendor_id IN (SELECT vendor_id FROM public.staff WHERE user_id = auth.uid())
);

CREATE POLICY "Owners can manage menu items" ON public.menu_items FOR ALL TO authenticated USING (
  vendor_id IN (SELECT vendor_id FROM public.staff WHERE user_id = auth.uid() AND role = 'owner')
) WITH CHECK (
  vendor_id IN (SELECT vendor_id FROM public.staff WHERE user_id = auth.uid() AND role = 'owner')
);

CREATE POLICY "Staff can view their vendor's tickets" ON public.queue_tickets FOR SELECT TO authenticated USING (
  vendor_id IN (SELECT vendor_id FROM public.staff WHERE user_id = auth.uid())
);

CREATE POLICY "Staff can update their vendor's tickets" ON public.queue_tickets FOR UPDATE TO authenticated USING (
  vendor_id IN (SELECT vendor_id FROM public.staff WHERE user_id = auth.uid())
) WITH CHECK (
  vendor_id IN (SELECT vendor_id FROM public.staff WHERE user_id = auth.uid())
);

CREATE POLICY "Staff can view orders for their vendor" ON public.orders FOR SELECT TO authenticated USING (
  ticket_id IN (
    SELECT id FROM public.queue_tickets WHERE vendor_id IN (
      SELECT vendor_id FROM public.staff WHERE user_id = auth.uid()
    )
  )
);

CREATE POLICY "Staff can view notifications for their vendor" ON public.notifications FOR SELECT TO authenticated USING (
  ticket_id IN (
    SELECT id FROM public.queue_tickets WHERE vendor_id IN (
      SELECT vendor_id FROM public.staff WHERE user_id = auth.uid()
    )
  )
);

CREATE POLICY "Staff can create notifications" ON public.notifications FOR INSERT TO authenticated WITH CHECK (
  ticket_id IN (
    SELECT id FROM public.queue_tickets WHERE vendor_id IN (
      SELECT vendor_id FROM public.staff WHERE user_id = auth.uid()
    )
  )
);

CREATE POLICY "Staff can view their vendor's stats" ON public.daily_stats FOR SELECT TO authenticated USING (
  vendor_id IN (SELECT vendor_id FROM public.staff WHERE user_id = auth.uid())
);

-- Create indexes for performance
CREATE INDEX idx_staff_user_id ON public.staff(user_id);
CREATE INDEX idx_staff_vendor_id ON public.staff(vendor_id);
CREATE INDEX idx_queue_tickets_vendor_id ON public.queue_tickets(vendor_id);
CREATE INDEX idx_queue_tickets_status ON public.queue_tickets(status);
CREATE INDEX idx_queue_tickets_created_at ON public.queue_tickets(created_at);
CREATE INDEX idx_menu_items_vendor_id ON public.menu_items(vendor_id);
CREATE INDEX idx_orders_ticket_id ON public.orders(ticket_id);
CREATE INDEX idx_notifications_ticket_id ON public.notifications(ticket_id);
CREATE INDEX idx_daily_stats_vendor_date ON public.daily_stats(vendor_id, date);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON public.vendors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_staff_updated_at BEFORE UPDATE ON public.staff FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON public.menu_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_queue_tickets_updated_at BEFORE UPDATE ON public.queue_tickets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_daily_stats_updated_at BEFORE UPDATE ON public.daily_stats FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.vendors (name, api_endpoint) VALUES 
('Demo Food Truck', 'https://your-server.com/vendor-api');

-- Insert sample menu items
INSERT INTO public.menu_items (vendor_id, name, price, prep_time_minutes, is_special, is_bestseller) VALUES 
((SELECT id FROM public.vendors LIMIT 1), 'Guacamole Tacos', 12.99, 8, true, true),
((SELECT id FROM public.vendors LIMIT 1), 'Chicken Quesadilla', 10.99, 6, false, false),
((SELECT id FROM public.vendors LIMIT 1), 'Beef Burrito', 13.99, 10, true, false),
((SELECT id FROM public.vendors LIMIT 1), 'Fish Tacos', 14.99, 12, false, false);

-- Insert sample queue tickets for demo
INSERT INTO public.queue_tickets (vendor_id, ticket_number, ticket_code, customer_name, status, estimated_wait_minutes) VALUES 
((SELECT id FROM public.vendors LIMIT 1), 8, 'A3F5', 'Maria', 'ordering', 0),
((SELECT id FROM public.vendors LIMIT 1), 9, 'B4G6', 'John', 'waiting', 3),
((SELECT id FROM public.vendors LIMIT 1), 10, 'C5H7', 'Sarah', 'waiting', 6),
((SELECT id FROM public.vendors LIMIT 1), 11, 'D6I8', 'Mike', 'waiting', 9);