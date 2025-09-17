import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';

export function CreateProjectDialog({ onCreateProject }) {
  const [open, setOpen] = useState(false);
  const [projectName, setProjectName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (projectName.trim()) {
      onCreateProject(projectName.trim());
      setProjectName('');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full gradient-secondary text-secondary-foreground font-medium button-glow" size="lg">
          <Plus className="h-4 w-4 mr-2" />
          Create New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md card-soft">
        <DialogHeader>
          <DialogTitle className="text-foreground">Create New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project-name" className="text-foreground">Project Name</Label>
            <Input
              id="project-name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name..."
              className="w-full"
              autoFocus
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="gradient-primary text-primary-foreground button-glow"
              disabled={!projectName.trim()}
            >
              Create Project
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}