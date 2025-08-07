import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Users, 
  DollarSign,
  Award,
  Calendar
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const ReportingDashboard = () => {
  // Sample data for charts
  const dailyTraffic = [
    { time: "9:00", customers: 5 },
    { time: "10:00", customers: 8 },
    { time: "11:00", customers: 15 },
    { time: "12:00", customers: 28 }, // Peak lunch
    { time: "13:00", customers: 32 }, // Peak hour
    { time: "14:00", customers: 18 },
    { time: "15:00", customers: 12 },
    { time: "16:00", customers: 8 },
    { time: "17:00", customers: 6 },
  ];

  const waitTimeData = [
    { time: "9:00", avgWait: 3 },
    { time: "10:00", avgWait: 5 },
    { time: "11:00", avgWait: 8 },
    { time: "12:00", avgWait: 12 },
    { time: "13:00", avgWait: 15 }, // Peak wait time
    { time: "14:00", avgWait: 10 },
    { time: "15:00", avgWait: 6 },
    { time: "16:00", avgWait: 4 },
    { time: "17:00", avgWait: 3 },
  ];

  const popularItems = [
    { name: "Guacamole Tacos", orders: 24, revenue: 311.76 },
    { name: "Beef Burrito", orders: 18, revenue: 251.82 },
    { name: "Fish Tacos", orders: 12, revenue: 179.88 },
    { name: "Chicken Quesadilla", orders: 16, revenue: 175.84 },
  ];

  const weeklyStats = [
    { day: "Mon", customers: 38, revenue: 456 },
    { day: "Tue", customers: 42, revenue: 523 },
    { day: "Wed", customers: 35, revenue: 421 },
    { day: "Thu", customers: 48, revenue: 587 },
    { day: "Fri", customers: 52, revenue: 634 },
    { day: "Sat", customers: 67, revenue: 789 },
    { day: "Sun", customers: 45, revenue: 534 },
  ];

  const todaysDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="space-y-6">
      {/* Daily Summary Header */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Calendar className="h-5 w-5" />
            Daily Summary - {todaysDate}
          </CardTitle>
          <CardDescription>
            Auto-generated performance report
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">42</div>
              <p className="text-sm text-muted-foreground">Total Customers</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">$524</div>
              <p className="text-sm text-muted-foreground">Revenue</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">8.2 min</div>
              <p className="text-sm text-muted-foreground">Avg Wait</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">4%</div>
              <p className="text-sm text-muted-foreground">Abandonment</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Peak Hours Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Peak Hours Analysis
            </CardTitle>
            <CardDescription>Customer traffic throughout the day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyTraffic}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="customers" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4">
              <Badge variant="secondary" className="mr-2">
                Peak Hour: 1:00 PM (32 customers)
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Wait Time Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Wait Time Analysis
            </CardTitle>
            <CardDescription>Average wait times by hour</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={waitTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="avgWait" 
                  stroke="hsl(var(--secondary))" 
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4">
              <Badge variant="outline" className="mr-2">
                Longest Wait: 1:00 PM (15 min)
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Popular Items & Weekly Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Items Ranking */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Popular Items Ranking
            </CardTitle>
            <CardDescription>Best performing menu items today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {popularItems.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">{item.orders} orders</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${item.revenue.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Weekly Performance
            </CardTitle>
            <CardDescription>Last 7 days overview</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="customers" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="Customers"
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--secondary))" 
                  strokeWidth={2}
                  name="Revenue ($)"
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 flex gap-4">
              <Badge variant="default">
                Best Day: Saturday (67 customers)
              </Badge>
              <Badge variant="secondary">
                Total Week: $3,944
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Key Insights & Recommendations</CardTitle>
          <CardDescription>AI-generated insights from your data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <h4 className="font-semibold text-green-800">Growth Opportunity</h4>
                </div>
                <p className="text-sm text-green-700">
                  Saturday shows 25% higher traffic. Consider weekend specials.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <h4 className="font-semibold text-blue-800">Efficiency Tip</h4>
                </div>
                <p className="text-sm text-blue-700">
                  Peak wait times at 1 PM. Pre-prep popular items during lunch rush.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-5 w-5 text-amber-600" />
                  <h4 className="font-semibold text-amber-800">Menu Insight</h4>
                </div>
                <p className="text-sm text-amber-700">
                  Guacamole Tacos drive 30% of revenue. Promote similar items.
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportingDashboard;