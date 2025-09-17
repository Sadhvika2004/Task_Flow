import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Bell, Palette, Clock, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useTheme } from '@/contexts/ThemeContext';

export function SettingsDialog({ open, onOpenChange }) {
  const { theme, setTheme } = useTheme();
  
  const [settings, setSettings] = useState({
    profile: {
      name: 'Asha Patel',
      email: 'asha@taskflow.com',
      timezone: 'UTC-8'
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      taskReminders: true,
      projectUpdates: false
    },
    appearance: {
      theme: theme,
      compactMode: false,
      showAvatars: true
    },
    productivity: {
      focusSessionDuration: '25',
      breakDuration: '5',
      autoStartBreaks: true,
      soundEnabled: true
    }
  });

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully",
    });
    onOpenChange(false);
  };

  const updateSetting = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
    
    // Handle theme change immediately
    if (category === 'appearance' && key === 'theme') {
      setTheme(value);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl card-soft max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">Settings</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="profile" className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="productivity" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Focus</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <Card className="p-6 card-soft">
              <h3 className="text-lg font-semibold text-foreground mb-4">Profile Information</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={settings.profile.name}
                    onChange={(e) => updateSetting('profile', 'name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.profile.email}
                    onChange={(e) => updateSetting('profile', 'email', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={settings.profile.timezone} onValueChange={(value) => updateSetting('profile', 'timezone', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                      <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                      <SelectItem value="UTC+0">Greenwich Mean Time (UTC+0)</SelectItem>
                      <SelectItem value="UTC+1">Central European Time (UTC+1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="mt-6">
            <Card className="p-6 card-soft">
              <h3 className="text-lg font-semibold text-foreground mb-4">Notification Preferences</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={settings.notifications.emailNotifications}
                    onCheckedChange={(checked) => updateSetting('notifications', 'emailNotifications', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Browser push notifications</p>
                  </div>
                  <Switch
                    checked={settings.notifications.pushNotifications}
                    onCheckedChange={(checked) => updateSetting('notifications', 'pushNotifications', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Task Reminders</Label>
                    <p className="text-sm text-muted-foreground">Get reminded about due tasks</p>
                  </div>
                  <Switch
                    checked={settings.notifications.taskReminders}
                    onCheckedChange={(checked) => updateSetting('notifications', 'taskReminders', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Project Updates</Label>
                    <p className="text-sm text-muted-foreground">Notifications about project changes</p>
                  </div>
                  <Switch
                    checked={settings.notifications.projectUpdates}
                    onCheckedChange={(checked) => updateSetting('notifications', 'projectUpdates', checked)}
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="mt-6">
            <Card className="p-6 card-soft">
              <h3 className="text-lg font-semibold text-foreground mb-4">Appearance Settings</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select value={settings.appearance.theme} onValueChange={(value) => updateSetting('appearance', 'theme', value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Compact Mode</Label>
                    <p className="text-sm text-muted-foreground">Use smaller spacing and fonts</p>
                  </div>
                  <Switch
                    checked={settings.appearance.compactMode}
                    onCheckedChange={(checked) => updateSetting('appearance', 'compactMode', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show Avatars</Label>
                    <p className="text-sm text-muted-foreground">Display user avatars in task cards</p>
                  </div>
                  <Switch
                    checked={settings.appearance.showAvatars}
                    onCheckedChange={(checked) => updateSetting('appearance', 'showAvatars', checked)}
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="productivity" className="mt-6">
            <Card className="p-6 card-soft">
              <h3 className="text-lg font-semibold text-foreground mb-4">Focus Session Settings</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Focus Duration (minutes)</Label>
                    <Select value={settings.productivity.focusSessionDuration} onValueChange={(value) => updateSetting('productivity', 'focusSessionDuration', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="25">25 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">60 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Break Duration (minutes)</Label>
                    <Select value={settings.productivity.breakDuration} onValueChange={(value) => updateSetting('productivity', 'breakDuration', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 minutes</SelectItem>
                        <SelectItem value="10">10 minutes</SelectItem>
                        <SelectItem value="15">15 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-start Breaks</Label>
                    <p className="text-sm text-muted-foreground">Automatically start break sessions</p>
                  </div>
                  <Switch
                    checked={settings.productivity.autoStartBreaks}
                    onCheckedChange={(checked) => updateSetting('productivity', 'autoStartBreaks', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Sound Notifications</Label>
                    <p className="text-sm text-muted-foreground">Play sounds for session transitions</p>
                  </div>
                  <Switch
                    checked={settings.productivity.soundEnabled}
                    onCheckedChange={(checked) => updateSetting('productivity', 'soundEnabled', checked)}
                  />
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border/50">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="gradient-primary text-primary-foreground">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}