import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

const API = "http://127.0.0.1:8000/api";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "", first_name: "", last_name: "" });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password) {
      toast({ title: "Missing fields", description: "Username, email and password are required" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/signup/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const msg = typeof data === 'object' ? Object.values(data).flat().join("; ") : "Sign up failed";
        throw new Error(msg || "Sign up failed");
      }
      toast({ title: "Account created", description: "You can now sign in" });
      navigate("/login");
    } catch (err) {
      toast({ title: "Signup failed", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 card-soft">
        <h1 className="text-2xl font-bold mb-6 text-foreground">Create account</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First name</Label>
              <Input id="first_name" name="first_name" value={form.first_name} onChange={onChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last name</Label>
              <Input id="last_name" name="last_name" value={form.last_name} onChange={onChange} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" name="username" value={form.username} onChange={onChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" name="email" value={form.email} onChange={onChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" name="password" value={form.password} onChange={onChange} />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating..." : "Create account"}
          </Button>
        </form>
        <p className="text-sm text-muted-foreground mt-4">
          Already have an account? <Link to="/login" className="text-primary">Sign in</Link>
        </p>
      </Card>
    </div>
  );
}