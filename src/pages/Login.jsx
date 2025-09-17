import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

const API = "http://127.0.0.1:8000/api";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      toast({ title: "Missing fields", description: "Enter username and password" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || "Invalid credentials");
      }
      const data = await res.json();
      // Persist token and a normalized user profile for UI
      localStorage.setItem("token", data.token);
      const profile = {
        id: data.user.id,
        username: data.user.username,
        email: data.user.email,
        first_name: data.user.first_name,
        last_name: data.user.last_name,
        name: `${data.user.first_name || ""} ${data.user.last_name || ""}`.trim() || data.user.username,
        avatar: "",
        role: "Member",
        department: "",
        location: "",
        phone: "",
        bio: "",
        skills: [],
        joinDate: new Date().toISOString(),
      };
      localStorage.setItem("user", JSON.stringify(profile));
      toast({ title: "Welcome", description: `Logged in as ${profile.name}` });
      navigate("/");
    } catch (err) {
      toast({ title: "Login failed", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 card-soft">
        <h1 className="text-2xl font-bold mb-6 text-foreground">Sign in</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" name="username" value={form.username} onChange={onChange} autoFocus />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" name="password" value={form.password} onChange={onChange} />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
        <p className="text-sm text-muted-foreground mt-4">
          No account? <Link to="/signup" className="text-primary">Create one</Link>
        </p>
      </Card>
    </div>
  );
}