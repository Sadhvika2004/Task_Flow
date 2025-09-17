import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Tag, Users, Trash2, Edit3 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';



export function TaskDetailDialog({ task, open, onOpenChange, onUpdateTask, onDeleteTask }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(null);

  const handleEdit = () => {
    setEditedTask(task);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editedTask && onUpdateTask) {
      onUpdateTask(editedTask.id, editedTask);
      toast({
        title: "Task updated",
        description: "Your changes have been saved",
      });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTask(task);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (task && onDeleteTask) {
      onDeleteTask(task.id);
      onOpenChange(false);
    }
  };

  const handlePriorityChange = (priority) => {
    if (editedTask) {
      setEditedTask({ ...editedTask, priority });
    }
  };

  if (!task) return null;

  const displayTask = isEditing ? editedTask : task;
  if (!displayTask) return null;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'highest': return 'bg-destructive text-destructive-foreground';
      case 'high': return 'bg-destructive/80 text-destructive-foreground';
      case 'medium': return 'bg-accent text-accent-foreground';
      case 'low': return 'bg-secondary text-secondary-foreground';
      case 'lowest': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl card-soft max-h-[80vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-foreground flex-1">
            {isEditing ? "Edit Task" : "Task Details"}
          </DialogTitle>
          <div className="flex gap-2">
            {!isEditing ? (
              <>
                <Button variant="ghost" size="sm" onClick={handleEdit}>
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleDelete} className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSave} className="gradient-primary text-primary-foreground">
                  Save
                </Button>
              </>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Title */}
          <div className="space-y-2">
            <Label className="text-foreground">Title</Label>
            {isEditing ? (
              <Input
                value={displayTask.title}
                onChange={(e) => setEditedTask(prev => prev ? { ...prev, title: e.target.value } : null)}
                className="text-lg font-semibold"
              />
            ) : (
              <h2 className="text-xl font-semibold text-foreground">{displayTask.title}</h2>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-foreground">Description</Label>
            {isEditing ? (
              <Textarea
                value={displayTask.description}
                onChange={(e) => setEditedTask(prev => prev ? { ...prev, description: e.target.value } : null)}
                rows={3}
                className="resize-none"
              />
            ) : (
              <p className="text-muted-foreground leading-relaxed">{displayTask.description}</p>
            )}
          </div>

          {/* Priority and Due Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-foreground flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Priority
              </Label>
              {isEditing ? (
                <Select value={displayTask.priority} onValueChange={handlePriorityChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="highest">Highest</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="lowest">Lowest</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge className={getPriorityColor(displayTask.priority)} variant="secondary">
                  {displayTask.priority.charAt(0).toUpperCase() + displayTask.priority.slice(1)}
                </Badge>
              )}
            </div>
            
            <div className="space-y-2">
              <Label className="text-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Due Date
              </Label>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{displayTask.dueDate}</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          {displayTask.tags.length > 0 && (
            <div className="space-y-2">
              <Label className="text-foreground">Tags</Label>
              <div className="flex flex-wrap gap-2">
                {displayTask.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Assignees */}
          {displayTask.assignees.length > 0 && (
            <div className="space-y-2">
              <Label className="text-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Assignees
              </Label>
              <div className="flex flex-wrap gap-3">
                {displayTask.assignees.map((assignee, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={assignee.avatar} />
                      <AvatarFallback className="text-xs">{assignee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-foreground">{assignee.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status */}
          <div className="space-y-2">
            <Label className="text-foreground">Status</Label>
            <Badge variant="outline" className="capitalize">
              {displayTask.status.replace('-', ' ')}
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}