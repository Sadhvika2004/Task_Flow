import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Mail, MapPin, Phone, Edit, Award, Clock, Target, Save, X } from "lucide-react";
import { useTaskFlow } from "@/hooks/useTaskFlow";
import { useProfile } from "@/contexts/ProfileContext";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const Profile = () => {
  const { tasks, activeProject } = useTaskFlow();
  const { userProfile, updateProfile } = useProfile();
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const [editForm, setEditForm] = useState({
    name: userProfile.name,
    email: userProfile.email,
    role: userProfile.role,
    department: userProfile.department,
    location: userProfile.location,
    phone: userProfile.phone,
    bio: userProfile.bio,
    skills: userProfile.skills.join(", ")
  });

  const handleEdit = () => {
    setEditForm({
      name: userProfile.name,
      email: userProfile.email,
      role: userProfile.role,
      department: userProfile.department,
      location: userProfile.location,
      phone: userProfile.phone,
      bio: userProfile.bio,
      skills: userProfile.skills.join(", ")
    });
    setEditDialogOpen(true);
  };

  const handleSave = () => {
    const updatedProfile = {
      ...userProfile,
      name: editForm.name,
      email: editForm.email,
      role: editForm.role,
      department: editForm.department,
      location: editForm.location,
      phone: editForm.phone,
      bio: editForm.bio,
      skills: editForm.skills.split(",").map(skill => skill.trim()).filter(skill => skill)
    };
    
    updateProfile(updatedProfile);
    setEditDialogOpen(false);
    
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved successfully",
    });
  };

  const handleCancel = () => {
    setEditForm({
      name: userProfile.name,
      email: userProfile.email,
      role: userProfile.role,
      department: userProfile.department,
      location: userProfile.location,
      phone: userProfile.phone,
      bio: userProfile.bio,
      skills: userProfile.skills.join(", ")
    });
    setEditDialogOpen(false);
  };

  const recentTasks = tasks.slice(0, 5);

  // Calculate stats
  const stats = {
    totalTasks: tasks.length,
    completedTasks: tasks.filter(task => task.status === 'done').length,
    activeProjects: 1,
    averageCompletionTime: "2.3 days"
  };

  return (
    <Layout showAnalytics={false}>
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Profile</h1>
          <p className="text-muted-foreground">Manage your account settings and view your activity</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <Card className="p-6 card-soft">
              <div className="text-center mb-6">
                <Avatar className="h-24 w-24 mx-auto mb-4 ring-4 ring-primary/20">
                  <AvatarImage src={userProfile.avatar} />
                  <AvatarFallback className="gradient-primary text-foreground font-semibold text-2xl">
                    {userProfile.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold text-foreground mb-1">{userProfile.name}</h2>
                <p className="text-muted-foreground mb-2">{userProfile.role}</p>
                <Badge variant="secondary" className="mb-4">{userProfile.department}</Badge>
                <Button variant="outline" size="sm" className="w-full" onClick={handleEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{userProfile.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{userProfile.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{userProfile.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">Joined {new Date(userProfile.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio */}
            <Card className="p-6 card-soft">
              <h3 className="text-lg font-semibold text-foreground mb-4">About</h3>
              <p className="text-muted-foreground leading-relaxed">{userProfile.bio}</p>
            </Card>

            {/* Skills */}
            <Card className="p-6 card-soft">
              <h3 className="text-lg font-semibold text-foreground mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {userProfile.skills.map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    {skill}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Stats */}
            <Card className="p-6 card-soft">
              <h3 className="text-lg font-semibold text-foreground mb-4">Activity Overview</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground mb-1">{stats.totalTasks}</div>
                  <div className="text-sm text-muted-foreground">Total Tasks</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground mb-1">{stats.completedTasks}</div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground mb-1">{stats.activeProjects}</div>
                  <div className="text-sm text-muted-foreground">Active Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground mb-1">{stats.averageCompletionTime}</div>
                  <div className="text-sm text-muted-foreground">Avg. Completion</div>
                </div>
              </div>
            </Card>

            {/* Recent Tasks */}
            <Card className="p-6 card-soft">
              <h3 className="text-lg font-semibold text-foreground mb-4">Recent Tasks</h3>
              <div className="space-y-3">
                {recentTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        task.priority === 'highest' ? 'bg-red-500' :
                        task.priority === 'high' ? 'bg-orange-500' :
                        task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`} />
                      <div>
                        <div className="font-medium text-sm text-foreground">{task.title}</div>
                        <div className="text-xs text-muted-foreground">{task.status}</div>
                      </div>
                    </div>
                    <Badge variant={task.status === 'done' ? 'default' : 'secondary'}>
                      {task.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-2xl card-soft max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">Edit Profile</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-role">Role</Label>
                <Input
                  id="edit-role"
                  value={editForm.role}
                  onChange={(e) => setEditForm(prev => ({ ...prev, role: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-department">Department</Label>
                <Input
                  id="edit-department"
                  value={editForm.department}
                  onChange={(e) => setEditForm(prev => ({ ...prev, department: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-location">Location</Label>
                <Input
                  id="edit-location"
                  value={editForm.location}
                  onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={editForm.phone}
                  onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-bio">Bio</Label>
              <Textarea
                id="edit-bio"
                value={editForm.bio}
                onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                rows={4}
                placeholder="Tell us about yourself..."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-skills">Skills (comma-separated)</Label>
              <Input
                id="edit-skills"
                value={editForm.skills}
                onChange={(e) => setEditForm(prev => ({ ...prev, skills: e.target.value }))}
                placeholder="Product Strategy, User Research, Agile..."
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border/50">
            <Button variant="ghost" onClick={handleCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave} className="gradient-primary text-primary-foreground">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Profile;
