import { Button } from "@/components/ui/button";
import { Heart, Shield, Activity, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-heart.jpg";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Heart health" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 medical-gradient opacity-90" />
        </div>
        
        <div className="relative container mx-auto px-4 py-24 text-center text-primary-foreground">
          <Heart className="w-20 h-20 mx-auto mb-6 animate-pulse" />
          <h1 className="text-5xl md:text-7xl font-bold mb-6">Hridamrit</h1>
          <p className="text-2xl md:text-3xl mb-4 font-semibold">
            Heart Attack Prediction & Prevention
          </p>
          <p className="text-xl mb-12 opacity-90 max-w-2xl mx-auto">
            AI-powered heart health monitoring with personalized precautions, recommendations, and real-time SMS alerts
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="hero" 
              size="lg" 
              onClick={() => navigate("/auth")}
              className="text-lg px-8 py-6 bg-card text-primary hover:bg-card/90 hover:scale-105"
            >
              Get Started
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate("/auth")}
              className="text-lg px-8 py-6 border-2 border-card text-primary-foreground hover:bg-card/20"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-medical-light">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            Comprehensive Heart Health Protection
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-card rounded-2xl shadow-medical hover:shadow-glow transition-smooth">
              <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Precautions</h3>
              <p className="text-muted-foreground">
                Personalized preventive measures based on your health profile and risk factors
              </p>
            </div>

            <div className="text-center p-8 bg-card rounded-2xl shadow-medical hover:shadow-glow transition-smooth">
              <div className="w-16 h-16 mx-auto mb-6 bg-secondary/10 rounded-full flex items-center justify-center">
                <Activity className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Recommendations</h3>
              <p className="text-muted-foreground">
                AI-powered lifestyle and health recommendations tailored to your needs
              </p>
            </div>

            <div className="text-center p-8 bg-card rounded-2xl shadow-medical hover:shadow-glow transition-smooth">
              <div className="w-16 h-16 mx-auto mb-6 bg-warning/10 rounded-full flex items-center justify-center">
                <Bell className="w-8 h-8 text-warning" />
              </div>
              <h3 className="text-2xl font-bold mb-4">SMS Alerts</h3>
              <p className="text-muted-foreground">
                Real-time SMS notifications for critical health changes and emergencies
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 medical-gradient text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Start Protecting Your Heart Today
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of users who trust Hridamrit for their heart health monitoring
          </p>
          <Button 
            variant="hero"
            size="lg"
            onClick={() => navigate("/auth")}
            className="text-lg px-12 py-6 bg-card text-primary hover:bg-card/90 hover:scale-105"
          >
            Create Free Account
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-card border-t border-medical-border">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 Hridamrit. Your heart health companion.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
