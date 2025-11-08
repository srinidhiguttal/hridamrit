import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, ArrowLeft, Shield, Activity, Salad, Brain, Stethoscope, Cigarette, Wine } from "lucide-react";
import { useNavigate } from "react-router-dom";
import precautionsIcon from "@/assets/precautions-icon.jpg";

const Precautions = () => {
  const navigate = useNavigate();

  const precautions = [
    {
      icon: Activity,
      title: "Regular Exercise (Vyayam)",
      description: "30 minutes of brisk walking or yoga daily. Include pranayama for heart health.",
      details: [
        "Morning walks ideal in Indian climate",
        "Avoid midday sun (11am-4pm)",
        "Yoga asanas: Surya Namaskar, Bhujangasana",
        "Pranayama: Anulom Vilom, Kapalbhati daily"
      ],
      priority: "high",
      indianTip: "Morning walks are ideal in Indian climate. Avoid midday sun."
    },
    {
      icon: Salad,
      title: "Heart-Healthy Indian Diet",
      description: "Include whole grains, dal, seasonal vegetables, and fruits",
      details: [
        "Traditional foods: moong dal, methi, karela, amla",
        "Limit ghee, reduce salt in pickles",
        "Prefer home-cooked meals over street food",
        "Add turmeric, garlic, ginger to cooking"
      ],
      priority: "high",
      indianTip: "Limit ghee, reduce salt in pickles, prefer home-cooked meals."
    },
    {
      icon: Brain,
      title: "Stress Management (Mann ki Shanti)",
      description: "Practice meditation, yoga, and deep breathing exercises daily",
      details: [
        "Try Vipassana or transcendental meditation",
        "Join local yoga centers",
        "Practice mindfulness daily",
        "Stay connected with family"
      ],
      priority: "high",
      indianTip: "Try Vipassana or transcendental meditation. Join local yoga centers."
    },
    {
      icon: Stethoscope,
      title: "Regular Health Checkups",
      description: "Monitor BP, cholesterol, and blood sugar every 3-6 months",
      details: [
        "Free health camps at govt hospitals",
        "Regular BP monitoring",
        "HbA1c tests for diabetes control",
        "Annual comprehensive checkup"
      ],
      priority: "high",
      indianTip: "Many government hospitals offer free health camps. Utilize them."
    },
    {
      icon: Cigarette,
      title: "Quit Smoking & Tobacco",
      description: "Avoid cigarettes, bidi, hookah, and chewing tobacco completely",
      details: [
        "Join tobacco cessation programs",
        "Call national quitline: 1800-11-2356",
        "Avoid gutkha and paan masala",
        "Seek support from local health centers"
      ],
      priority: "high",
      indianTip: "Join tobacco cessation programs. Call national quitline: 1800-11-2356."
    },
    {
      icon: Wine,
      title: "Limit Alcohol",
      description: "If you drink, limit to moderate amounts. Better to avoid completely",
      details: [
        "Choose buttermilk, coconut water instead",
        "Herbal teas: tulsi, ginger, cardamom",
        "Avoid heavy drinking culture",
        "Stay hydrated with Indian beverages"
      ],
      priority: "medium",
      indianTip: "Choose healthy Indian beverages like buttermilk, coconut water, herbal teas."
    },
    {
      icon: Shield,
      title: "Control Diabetes",
      description: "India has high diabetes rates. Keep blood sugar in check",
      details: [
        "Regular HbA1c tests",
        "Limit rice/roti portions",
        "Increase fiber intake",
        "Monitor fasting & post-meal glucose"
      ],
      priority: "high",
      indianTip: "Regular HbA1c tests, limit rice/roti portions, increase fiber intake."
    },
    {
      icon: Heart,
      title: "Monitor Blood Pressure",
      description: "Keep BP under 120/80 mmHg. Check regularly at home",
      details: [
        "Reduce salt in dal, sabzi",
        "Avoid packaged snacks and papad",
        "Home BP monitor recommended",
        "Track readings in diary"
      ],
      priority: "high",
      indianTip: "Reduce salt in dal, sabzi. Avoid packaged snacks and papad."
    }
  ];

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
        <div className="mb-12 text-center">
          <img 
            src={precautionsIcon} 
            alt="Precautions" 
            className="w-32 h-32 mx-auto mb-6 rounded-2xl shadow-medical"
          />
          <h2 className="text-4xl font-bold mb-4">🇮🇳 Heart Health Precautions for India</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Essential preventive measures tailored for Indian lifestyle and healthcare system
          </p>
        </div>

        {/* Precautions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {precautions.map((precaution, index) => {
            const Icon = precaution.icon;
            return (
              <Card 
                key={index} 
                className={`shadow-medical border-medical-border hover:shadow-glow transition-smooth ${
                  precaution.priority === 'high' ? 'border-l-4 border-l-primary' : ''
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    {precaution.priority === 'high' && (
                      <span className="text-xs font-semibold bg-primary/20 text-primary px-2 py-1 rounded-full">
                        High Priority
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-xl">{precaution.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {precaution.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ul className="space-y-2">
                    {precaution.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start text-sm">
                        <span className="text-primary mr-2">•</span>
                        <span className="text-muted-foreground">{detail}</span>
                      </li>
                    ))}
                  </ul>
                  {precaution.indianTip && (
                    <div className="bg-primary/5 p-3 rounded-lg border-l-4 border-primary mt-3">
                      <p className="text-xs font-semibold text-primary">🇮🇳 India-Specific Tip:</p>
                      <p className="text-xs mt-1">{precaution.indianTip}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Emergency Notice - India */}
        <Card className="mt-12 bg-destructive/10 border-destructive shadow-medical">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <Shield className="w-6 h-6" />
              🇮🇳 Emergency Warning Signs for India
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 font-semibold">Call emergency services immediately if you experience:</p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {[
                "Chest pain or discomfort (Seene mein dard)",
                "Shortness of breath (Saans lene mein taklif)",
                "Pain in arms, back, neck, or jaw",
                "Cold sweat or nausea (Pasina aana, ulti)",
                "Lightheadedness or dizziness (Chakkar aana)",
                "Unusual fatigue (Bahut zyada thakan)"
              ].map((symptom, idx) => (
                <li key={idx} className="flex items-center text-sm">
                  <span className="text-destructive mr-2 text-xl">⚠</span>
                  {symptom}
                </li>
              ))}
            </ul>
            <div className="bg-card rounded-lg p-4">
              <p className="text-sm font-semibold mb-2">🇮🇳 Emergency Numbers in India:</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="font-bold text-destructive text-xl">108</p>
                  <p className="text-xs">National Ambulance</p>
                </div>
                <div>
                  <p className="font-bold text-destructive text-xl">102</p>
                  <p className="text-xs">State Ambulance</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Precautions;
