import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';



export function CreateTaskDialog({ columnId, columnTitle, onCreateTask }) {
  const [open, setOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskTitle.trim()) {
      onCreateTask(columnId, taskTitle.trim(), taskDescription.trim());
      setTaskTitle('');
      setTaskDescription('');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full justify-start text-muted-foreground hover:text-foreground button-glow"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md card-soft">
        <DialogHeader>
          <DialogTitle className="text-foreground">Add Task to {columnTitle}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="task-title" className="text-foreground">Task Title</Label>
            <Input
              id="task-title"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="Enter task title..."
              className="w-full"
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="task-description" className="text-foreground">Description (optional)</Label>
            <Textarea
              id="task-description"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              placeholder="Add task description..."
              className="w-full resize-none"
              rows={3}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="gradient-primary text-primary-foreground button-glow"
              disabled={!taskTitle.trim()}
            >
              Add Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}