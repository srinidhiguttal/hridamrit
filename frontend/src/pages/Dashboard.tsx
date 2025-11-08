import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Activity, Shield, AlertTriangle, Bell, TrendingUp, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";
import HealthDataForm from "@/components/HealthDataForm";
import PredictionResult from "@/components/PredictionResult";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState<string>("User");
  const [predictionResult, setPredictionResult] = useState<any>(null);
  const [showForm, setShowForm] = useState(true);

  useEffect(() => {
    // Check authentication
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        fetchUserProfile(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          navigate("/auth");
        } else {
          setUser(session.user);
          fetchUserProfile(session.user.id);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching profile:", error);
    } else if (data) {
      setUserName(data.full_name || "User");
    }

    // Check for existing predictions
    const { data: predictions } = await supabase
      .from('health_predictions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1);

    if (predictions && predictions.length > 0) {
      const latest = predictions[0];
      setPredictionResult({
        predicted_class: latest.prediction_result === "High Risk" ? 1 : 0,
        probability: latest.risk_score || 0
      });
      setShowForm(false);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error logging out");
    } else {
      toast.success("Logged out successfully");
      navigate("/");
    }
  };

  const handlePredictionComplete = (result: any) => {
    setPredictionResult(result);
    setShowForm(false);
  };

  const handleNewPrediction = () => {
    setPredictionResult(null);
    setShowForm(true);
  };

  const stats = [
    {
      title: "Heart Rate",
      value: "72 bpm",
      icon: Heart,
      status: "normal",
      trend: "+2%"
    },
    {
      title: "Blood Pressure",
      value: "120/80",
      icon: Activity,
      status: "normal",
      trend: "stable"
    },
    {
      title: "Risk Level",
      value: "Low",
      icon: Shield,
      status: "good",
      trend: "-5%"
    },
    {
      title: "Alerts",
      value: "0",
      icon: Bell,
      status: "normal",
      trend: "none"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-medical-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold">Hridamrit</h1>
          </div>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back, {userName}!</h2>
          <p className="text-muted-foreground">
            {showForm ? "Enter your health data for heart attack risk prediction" : "Your heart health dashboard"}
          </p>
        </div>

        {showForm ? (
          <div className="max-w-4xl mx-auto">
            <HealthDataForm onPredictionComplete={handlePredictionComplete} />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold">Your Prediction Results</h3>
              <Button onClick={handleNewPrediction} variant="outline">
                New Prediction
              </Button>
            </div>
            
            <PredictionResult result={predictionResult} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <Card className="shadow-medical border-medical-border hover:shadow-glow transition-smooth cursor-pointer" onClick={() => navigate("/precautions")}>
                <CardHeader>
                  <Shield className="w-12 h-12 text-secondary mb-4" />
                  <CardTitle>Precautions</CardTitle>
                  <CardDescription>
                    View India-specific health precautions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="secondary" className="w-full">
                    View Precautions
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-medical border-medical-border hover:shadow-glow transition-smooth cursor-pointer" onClick={() => navigate("/recommendations")}>
                <CardHeader>
                  <Heart className="w-12 h-12 text-primary mb-4" />
                  <CardTitle>Recommendations</CardTitle>
                  <CardDescription>
                    Get personalized health recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="hero" className="w-full">
                    View Recommendations
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-medical border-medical-border hover:shadow-glow transition-smooth cursor-pointer" onClick={() => navigate("/alerts")}>
                <CardHeader>
                  <AlertTriangle className="w-12 h-12 text-warning mb-4" />
                  <CardTitle>Alert System</CardTitle>
                  <CardDescription>
                    Configure SMS alerts for emergencies
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Manage Alerts
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
