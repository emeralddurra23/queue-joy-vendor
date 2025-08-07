import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Star, 
  Clock, 
  DollarSign, 
  Edit, 
  Trash2, 
  TrendingUp,
  Award
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  prepTime: number;
  isSpecial: boolean;
  isBestseller: boolean;
  active: boolean;
}

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: "1",
      name: "Guacamole Tacos",
      price: 12.99,
      prepTime: 8,
      isSpecial: true,
      isBestseller: true,
      active: true
    },
    {
      id: "2", 
      name: "Chicken Quesadilla",
      price: 10.99,
      prepTime: 6,
      isSpecial: false,
      isBestseller: false,
      active: true
    },
    {
      id: "3",
      name: "Beef Burrito",
      price: 13.99,
      prepTime: 10,
      isSpecial: true,
      isBestseller: false,
      active: true
    },
    {
      id: "4",
      name: "Fish Tacos",
      price: 14.99,
      prepTime: 12,
      isSpecial: false,
      isBestseller: false,
      active: true
    }
  ]);

  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    prepTime: "",
    isSpecial: false,
    isBestseller: false
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const addMenuItem = () => {
    if (!newItem.name || !newItem.price || !newItem.prepTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const item: MenuItem = {
      id: Date.now().toString(),
      name: newItem.name,
      price: parseFloat(newItem.price),
      prepTime: parseInt(newItem.prepTime),
      isSpecial: newItem.isSpecial,
      isBestseller: newItem.isBestseller,
      active: true
    };

    setMenuItems(prev => [...prev, item]);
    setNewItem({
      name: "",
      price: "",
      prepTime: "",
      isSpecial: false,
      isBestseller: false
    });
    setIsDialogOpen(false);

    toast({
      title: "Item Added!",
      description: `${item.name} has been added to the menu`,
    });
  };

  const toggleItemStatus = (id: string, field: keyof MenuItem) => {
    setMenuItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, [field]: !item[field] }
        : item
    ));
  };

  const deleteItem = (id: string) => {
    const item = menuItems.find(i => i.id === id);
    setMenuItems(prev => prev.filter(item => item.id !== id));
    
    toast({
      title: "Item Removed",
      description: `${item?.name} has been removed from the menu`,
    });
  };

  const bestseller = menuItems.find(item => item.isBestseller);
  const specials = menuItems.filter(item => item.isSpecial);

  return (
    <div className="space-y-6">
      {/* Today's Specials Header */}
      <Card className="bg-secondary/5 border-secondary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-secondary">
            <Star className="h-5 w-5" />
            Today's Specials
          </CardTitle>
          <CardDescription>
            Featured items and bestsellers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Bestseller Highlight */}
            {bestseller && (
              <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="h-5 w-5 text-amber-500" />
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                      🌟 Top Item
                    </Badge>
                  </div>
                  <h3 className="text-lg font-semibold">{bestseller.name}</h3>
                  <p className="text-amber-700 font-medium">${bestseller.price}</p>
                  <p className="text-sm text-muted-foreground">{bestseller.prepTime} min prep</p>
                </CardContent>
              </Card>
            )}

            {/* Quick Stats */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Active Items</span>
                    <span className="font-semibold">{menuItems.filter(i => i.active).length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Today's Specials</span>
                    <span className="font-semibold">{specials.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Avg. Prep Time</span>
                    <span className="font-semibold">
                      {Math.round(menuItems.reduce((acc, item) => acc + item.prepTime, 0) / menuItems.length)} min
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Menu Items Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Menu Items</CardTitle>
              <CardDescription>Manage your menu items, prices, and preparation times</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Menu Item</DialogTitle>
                  <DialogDescription>
                    Create a new item for your menu
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Item Name</Label>
                    <Input
                      id="name"
                      value={newItem.name}
                      onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Chicken Tacos"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price ($)</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={newItem.price}
                        onChange={(e) => setNewItem(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="12.99"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="prepTime">Prep Time (min)</Label>
                      <Input
                        id="prepTime"
                        type="number"
                        value={newItem.prepTime}
                        onChange={(e) => setNewItem(prev => ({ ...prev, prepTime: e.target.value }))}
                        placeholder="10"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="special"
                        checked={newItem.isSpecial}
                        onCheckedChange={(checked) => setNewItem(prev => ({ ...prev, isSpecial: checked }))}
                      />
                      <Label htmlFor="special">Today's Special</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="bestseller"
                        checked={newItem.isBestseller}
                        onCheckedChange={(checked) => setNewItem(prev => ({ ...prev, isBestseller: checked }))}
                      />
                      <Label htmlFor="bestseller">Bestseller</Label>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={addMenuItem}>Add Item</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {menuItems.map((item) => (
              <Card key={item.id} className={`${!item.active ? 'opacity-50' : ''}`}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{item.name}</h3>
                          {item.isBestseller && (
                            <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                              <Star className="h-3 w-3 mr-1" />
                              Bestseller
                            </Badge>
                          )}
                          {item.isSpecial && (
                            <Badge variant="outline" className="border-secondary text-secondary">
                              Special
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            <span>${item.price}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{item.prepTime} min</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={item.active}
                        onCheckedChange={() => toggleItemStatus(item.id, 'active')}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => toggleItemStatus(item.id, 'isSpecial')}
                        className={item.isSpecial ? 'bg-secondary/10 border-secondary' : ''}
                      >
                        <Star className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => toggleItemStatus(item.id, 'isBestseller')}
                        className={item.isBestseller ? 'bg-amber-100 border-amber-300' : ''}
                      >
                        <TrendingUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => deleteItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MenuManagement;