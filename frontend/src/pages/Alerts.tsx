import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, ArrowLeft, Bell, Phone, MessageSquare, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Alerts = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [alertSettings, setAlertSettings] = useState({
    highHeartRate: true,
    abnormalBP: true,
    missedMedication: false,
    dailyReminder: true
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadAlertSettings();
  }, []);

  const loadAlertSettings = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (user.user) {
        const { data } = await supabase
          .from('alert_settings')
          .select('*')
          .eq('user_id', user.user.id)
          .maybeSingle();

        if (data) {
          setPhoneNumber(data.phone_number);
          setAlertSettings({
            highHeartRate: data.high_heart_rate,
            abnormalBP: data.abnormal_bp,
            missedMedication: data.missed_medication,
            dailyReminder: data.daily_reminder
          });
        }
      }
    } catch (error) {
      console.error("Error loading alert settings:", error);
    }
  };

  const handleSaveSettings = async () => {
    if (!phoneNumber || phoneNumber.trim() === "") {
      toast.error("Please enter a phone number");
      return;
    }

    setIsSaving(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        toast.error("Please login first");
        return;
      }

      const { error } = await supabase
        .from('alert_settings')
        .upsert({
          user_id: user.user.id,
          phone_number: phoneNumber,
          high_heart_rate: alertSettings.highHeartRate,
          abnormal_bp: alertSettings.abnormalBP,
          missed_medication: alertSettings.missedMedication,
          daily_reminder: alertSettings.dailyReminder
        });

      if (error) throw error;

      toast.success("Alert settings saved successfully!");
    } catch (error: any) {
      console.error("Save error:", error);
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestSMS = async () => {
    if (!phoneNumber || phoneNumber.trim() === "") {
      toast.error("Please enter a phone number first");
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('send-sms-alert', {
        body: {
          phoneNumber,
          message: "This is a test alert from Hridamrit. Your SMS alert system is working correctly!",
          alertType: "Test"
        }
      });

      if (error) throw error;

      toast.success("Test SMS sent to " + phoneNumber);
    } catch (error: any) {
      console.error("SMS error:", error);
      toast.error("Failed to send test SMS");
    }
  };

  const alertTypes = [
    {
      id: "highHeartRate",
      icon: Heart,
      title: "High Heart Rate Alert",
      description: "Get notified when your heart rate exceeds 100 bpm",
      color: "text-primary"
    },
    {
      id: "abnormalBP",
      icon: AlertTriangle,
      title: "Abnormal Blood Pressure",
      description: "Alerts for readings outside normal range (120/80)",
      color: "text-warning"
    },
    {
      id: "missedMedication",
      icon: Bell,
      title: "Medication Reminders",
      description: "Reminders when you miss your scheduled medication",
      color: "text-secondary"
    },
    {
      id: "dailyReminder",
      icon: MessageSquare,
      title: "Daily Health Check-in",
      description: "Daily reminder to log your health metrics",
      color: "text-accent"
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
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold mb-4">🇮🇳 SMS Alert System for India</h2>
          <p className="text-lg text-muted-foreground">
            Configure SMS notifications for critical health alerts. Compatible with all Indian mobile networks.
          </p>
        </div>

        {/* Phone Number Configuration */}
        <Card className="mb-8 shadow-medical border-medical-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-6 h-6 text-primary" />
              Emergency Contact Number
            </CardTitle>
            <CardDescription>
              SMS alerts will be sent to this number
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91 98765 43210"
                />
              </div>
              <div className="flex gap-3">
                <Button variant="hero" onClick={handleSaveSettings} className="flex-1">
                  Save Number
                </Button>
                <Button variant="outline" onClick={handleTestSMS}>
                  Send Test SMS
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alert Types */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-6">Alert Preferences</h3>
          <div className="space-y-4">
            {alertTypes.map((alert) => {
              const Icon = alert.icon;
              return (
                <Card 
                  key={alert.id}
                  className={`shadow-medical border-medical-border hover:shadow-glow transition-smooth ${
                    alertSettings[alert.id as keyof typeof alertSettings] ? 'border-l-4 border-l-primary' : ''
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <Icon className={`w-6 h-6 ${alert.color}`} />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{alert.title}</CardTitle>
                          <CardDescription>{alert.description}</CardDescription>
                        </div>
                      </div>
                      <Switch
                        checked={alertSettings[alert.id as keyof typeof alertSettings]}
                        onCheckedChange={(checked) =>
                          setAlertSettings(prev => ({ ...prev, [alert.id]: checked }))
                        }
                      />
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Emergency Protocol - India */}
        <Card className="bg-destructive/10 border-destructive shadow-medical">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="w-6 h-6" />
              🇮🇳 Emergency Response Protocol for India
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="font-semibold">In case of critical health alerts:</p>
            <ol className="space-y-3 list-decimal list-inside">
              <li className="text-sm">
                <strong>Immediate SMS notification</strong> will be sent to your registered number
              </li>
              <li className="text-sm">
                <strong>Emergency contacts</strong> will be notified automatically
              </li>
              <li className="text-sm">
                <strong>Call emergency services</strong> (108/102) if symptoms are severe
              </li>
              <li className="text-sm">
                <strong>Visit nearest hospital</strong> - Government hospitals provide emergency cardiac care
              </li>
            </ol>
            <div className="bg-card rounded-lg p-4 mt-4">
              <p className="text-sm font-semibold mb-3">🇮🇳 Emergency Hotlines in India:</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-bold text-destructive">108</p>
                  <p className="text-xs">National Ambulance Service</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-destructive">102</p>
                  <p className="text-xs">State Ambulance Service</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-destructive">1800-11-2356</p>
                  <p className="text-xs">National Tobacco Quitline</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-destructive">104</p>
                  <p className="text-xs">National Health Helpline</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <Button variant="hero" size="lg" onClick={handleSaveSettings} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save All Alert Settings"}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Alerts;
