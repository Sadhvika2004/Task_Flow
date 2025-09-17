import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ProfileProvider } from "@/contexts/ProfileContext";
import Home from "./pages/Home";
import Index from "./pages/Index";
import Backlog from "./pages/Backlog";
import Sprint from "./pages/Sprint";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";
import ProjectDetail from "./pages/ProjectDetail";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AuthRoute from "./components/AuthRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <ProfileProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Protected routes */}
              <Route path="/" element={<AuthRoute><Home /></AuthRoute>} />
              <Route path="/board" element={<AuthRoute><Index /></AuthRoute>} />
              <Route path="/backlog" element={<AuthRoute><Backlog /></AuthRoute>} />
              <Route path="/sprint" element={<AuthRoute><Sprint /></AuthRoute>} />
              <Route path="/reports" element={<AuthRoute><Reports /></AuthRoute>} />
              <Route path="/profile" element={<AuthRoute><Profile /></AuthRoute>} />
              <Route path="/project/:projectId" element={<AuthRoute><ProjectDetail /></AuthRoute>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ProfileProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
