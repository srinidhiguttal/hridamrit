import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, ArrowLeft, TrendingUp, Calendar, Target, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

const Recommendations = () => {
  const navigate = useNavigate();
  const [completedGoals, setCompletedGoals] = useState<number[]>([]);

  const recommendations = [
    {
      category: "Indian Diet & Nutrition",
      color: "text-primary",
      items: [
        {
          id: 1,
          title: "Traditional Indian Foods",
          description: "Moong dal, methi, karela, amla for heart health",
          priority: "high",
          timeframe: "Daily"
        },
        {
          id: 2,
          title: "Heart-Friendly Oils",
          description: "Use mustard/groundnut oil in moderation",
          priority: "high",
          timeframe: "Daily Cooking"
        },
        {
          id: 3,
          title: "Indian Spices",
          description: "Add turmeric, garlic, ginger, cinnamon daily",
          priority: "medium",
          timeframe: "Every Meal"
        },
        {
          id: 4,
          title: "Seasonal Fruits",
          description: "Guava, papaya, pomegranate, sapota",
          priority: "medium",
          timeframe: "Daily"
        }
      ]
    },
    {
      category: "Physical Activity (Indian Context)",
      color: "text-secondary",
      items: [
        {
          id: 5,
          title: "Morning/Evening Walks",
          description: "30 min walks in parks or residential areas",
          priority: "high",
          timeframe: "Daily"
        },
        {
          id: 6,
          title: "Yoga & Pranayama",
          description: "Surya Namaskar, Anulom Vilom (5-10 min)",
          priority: "high",
          timeframe: "Daily"
        },
        {
          id: 7,
          title: "Community Sports",
          description: "Cricket, badminton, kabaddi in local grounds",
          priority: "medium",
          timeframe: "3x per week"
        },
        {
          id: 8,
          title: "Indian Dance Forms",
          description: "Bharatanatyam, Kathak, Garba as cardio",
          priority: "medium",
          timeframe: "Weekly"
        }
      ]
    },
    {
      category: "Avoid These (Common in India)",
      color: "text-warning",
      items: [
        {
          id: 9,
          title: "Excessive Chai/Tea",
          description: "Limit to 2-3 cups with less sugar",
          priority: "high",
          timeframe: "Starting Now"
        },
        {
          id: 10,
          title: "Street Food",
          description: "Avoid high trans-fat unhygienic food",
          priority: "high",
          timeframe: "Ongoing"
        },
        {
          id: 11,
          title: "Tobacco Products",
          description: "No cigarettes, bidi, gutkha, paan masala",
          priority: "high",
          timeframe: "Immediately"
        },
        {
          id: 12,
          title: "Heavy Dinner",
          description: "Avoid rice and fried foods before sleep",
          priority: "medium",
          timeframe: "Daily"
        }
      ]
    }
  ];

  const metrics = [
    { label: "Goals Completed", value: completedGoals.length, total: 12, color: "success" },
    { label: "Risk Reduction", value: 15, unit: "%", color: "primary" },
    { label: "Days Active", value: 28, total: 30, color: "secondary" }
  ];

  const toggleGoal = (id: number) => {
    setCompletedGoals(prev =>
      prev.includes(id) ? prev.filter(gid => gid !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-medical-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Heart className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold">Hridamrit</h1>
          </div>
          <Button variant="ghost" onClick={() => navigate("/")}>
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold mb-4">🇮🇳 Personalized Recommendations for India</h2>
          <p className="text-lg text-muted-foreground">
            Health suggestions tailored for Indian lifestyle, diet, and healthcare system
          </p>
        </div>

        {/* Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {metrics.map((metric, index) => (
            <Card key={index} className="shadow-medical border-medical-border">
              <CardHeader className="pb-3">
                <CardDescription className="text-xs uppercase">{metric.label}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-4xl font-bold">{metric.value}</span>
                  {metric.unit && <span className="text-2xl text-muted-foreground mb-1">{metric.unit}</span>}
                  {metric.total && <span className="text-lg text-muted-foreground mb-1">/ {metric.total}</span>}
                </div>
                {metric.total && (
                  <Progress value={(metric.value / metric.total) * 100} className="h-2" />
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recommendations by Category */}
        <div className="space-y-8">
          {recommendations.map((category, catIndex) => (
            <div key={catIndex}>
              <div className="flex items-center gap-3 mb-6">
                <Target className={`w-6 h-6 ${category.color}`} />
                <h3 className="text-2xl font-bold">{category.category}</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {category.items.map((item) => {
                  const isCompleted = completedGoals.includes(item.id);
                  return (
                    <Card 
                      key={item.id}
                      className={`shadow-medical border-medical-border hover:shadow-glow transition-smooth cursor-pointer ${
                        isCompleted ? 'bg-success/5 border-success' : ''
                      }`}
                      onClick={() => toggleGoal(item.id)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {isCompleted && (
                                <CheckCircle2 className="w-5 h-5 text-success" />
                              )}
                              <CardTitle className={isCompleted ? 'line-through text-muted-foreground' : ''}>
                                {item.title}
                              </CardTitle>
                            </div>
                            <CardDescription>{item.description}</CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{item.timeframe}</span>
                          </div>
                          {item.priority === 'high' && (
                            <span className="text-xs font-semibold bg-primary/20 text-primary px-2 py-1 rounded-full">
                              High Priority
                            </span>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Button 
                          variant={isCompleted ? "success" : "hero"} 
                          size="sm" 
                          className="w-full"
                        >
                          {isCompleted ? "Completed ✓" : "Mark as Complete"}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Progress Summary */}
        <Card className="mt-12 medical-gradient text-primary-foreground shadow-glow">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3">
              <TrendingUp className="w-8 h-8" />
              Your Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-4">
              You're making great strides! Keep up the excellent work on your heart health journey.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <p className="font-semibold mb-1">Current Risk Level</p>
                <p className="text-2xl font-bold">Low</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <p className="font-semibold mb-1">Improvement Rate</p>
                <p className="text-2xl font-bold">+15%</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <p className="font-semibold mb-1">Next Milestone</p>
                <p className="text-2xl font-bold">7 days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Recommendations;
