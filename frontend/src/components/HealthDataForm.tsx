import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Activity, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface HealthDataFormProps {
  onPredictionComplete: (result: any) => void;
}

const HealthDataForm = ({ onPredictionComplete }: HealthDataFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [googleFitConnected, setGoogleFitConnected] = useState(false);
  const [formData, setFormData] = useState({
    age: "",
    gender: "1",
    height: "",
    weight: "",
    systolic_bp: "",
    diastolic_bp: "",
    cholesterol: "1",
    glucose: "1",
    smoking: "0",
    alcohol: "0",
    physical_activity: "1"
  });

  useEffect(() => {
    checkGoogleFitConnection();
    handleOAuthCallback();
  }, []);

  const checkGoogleFitConnection = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (user.user) {
        const { data } = await supabase
          .from('google_fit_data')
          .select('*')
          .eq('user_id', user.user.id)
          .maybeSingle();
        
        if (data) {
          setGoogleFitConnected(true);
          setFormData(prev => ({
            ...prev,
            height: data.height?.toString() || "",
            weight: data.weight?.toString() || "",
          }));
        }
      }
    } catch (error) {
      console.error("Error checking Google Fit connection:", error);
    }
  };

  const handleOAuthCallback = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (!code) return;

    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      // Exchange code for tokens
      const { data: tokens, error: tokenError } = await supabase.functions.invoke('google-fit-auth', {
        body: { code }
      });

      if (tokenError) throw tokenError;

      // Store tokens in database
      const { error: upsertError } = await supabase
        .from('google_fit_data')
        .upsert({
          user_id: user.user.id,
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          token_expiry: new Date(Date.now() + tokens.expires_in * 1000).toISOString()
        }, { onConflict: 'user_id' });

      if (upsertError) throw upsertError;

      // Clean URL and sync data
      window.history.replaceState({}, document.title, window.location.pathname);
      setGoogleFitConnected(true);
      toast.success("Google Fit connected successfully!");
      await syncGoogleFitData();
    } catch (error: any) {
      console.error("OAuth callback error:", error);
      toast.error("Failed to connect Google Fit");
    }
  };

  const handleGoogleFitAuth = () => {
    const CLIENT_ID = import.meta.env.VITE_GOOGLE_FIT_CLIENT_ID;
    const REDIRECT_URI = `${window.location.origin}/dashboard`;
    const SCOPE = "https://www.googleapis.com/auth/fitness.activity.read https://www.googleapis.com/auth/fitness.body.read";
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${CLIENT_ID}&` +
      `redirect_uri=${REDIRECT_URI}&` +
      `response_type=code&` +
      `scope=${SCOPE}&` +
      `access_type=offline&` +
      `prompt=consent`;
    
    window.location.href = authUrl;
  };

  const syncGoogleFitData = async () => {
    setIsSyncing(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        toast.error("Please login first");
        return;
      }

      const { data: fitData } = await supabase
        .from('google_fit_data')
        .select('access_token')
        .eq('user_id', user.user.id)
        .maybeSingle();

      if (!fitData) {
        toast.error("Please connect Google Fit first");
        return;
      }

      const { data, error } = await supabase.functions.invoke('fetch-google-fit-data', {
        body: { accessToken: fitData.access_token }
      });

      if (error) throw error;

      // Update form with Google Fit data
      setFormData(prev => ({
        ...prev,
        height: data.height?.toString() || prev.height,
        weight: data.weight?.toString() || prev.weight,
      }));

      // Update database
      await supabase
        .from('google_fit_data')
        .update({
          height: data.height,
          weight: data.weight,
          steps: data.steps,
          calories: data.calories,
          last_synced: new Date().toISOString()
        })
        .eq('user_id', user.user.id);

      toast.success("Google Fit data synced successfully!");
    } catch (error: any) {
      console.error("Sync error:", error);
      toast.error("Failed to sync Google Fit data");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Prepare data for prediction
      const height_m = parseFloat(formData.height) / 100; // convert cm to meters
      const weight_kg = parseFloat(formData.weight);
      const bmi = weight_kg / (height_m * height_m);

      const predictionData = {
        age: parseInt(formData.age),
        gender: parseInt(formData.gender),
        height: height_m,
        weight: weight_kg,
        ap_hi: parseInt(formData.systolic_bp),
        ap_lo: parseInt(formData.diastolic_bp),
        cholesterol: parseInt(formData.cholesterol),
        gluc: parseInt(formData.glucose),
        smoke: parseInt(formData.smoking),
        alco: parseInt(formData.alcohol),
        active: parseInt(formData.physical_activity),
        bmi: bmi
      };

      // Call edge function to get prediction
      const { data: prediction, error } = await supabase.functions.invoke('predict-heart-risk', {
        body: predictionData
      });

      if (error) throw error;

      // Store prediction in database
      const { data: user } = await supabase.auth.getUser();
      if (user.user) {
        const { error: insertError } = await supabase
          .from('health_predictions')
          .insert({
            user_id: user.user.id,
            age: predictionData.age,
            gender: predictionData.gender,
            height: predictionData.height,
            weight: predictionData.weight,
            systolic_bp: predictionData.ap_hi,
            diastolic_bp: predictionData.ap_lo,
            cholesterol: predictionData.cholesterol,
            glucose: predictionData.gluc,
            smoking: predictionData.smoke,
            alcohol: predictionData.alco,
            physical_activity: predictionData.active,
            prediction_result: prediction.predicted_class === 1 ? "High Risk" : "Low Risk",
            risk_score: prediction.probability
          });

        if (insertError) throw insertError;
      }

      toast.success("Prediction completed successfully!");
      onPredictionComplete(prediction);
    } catch (error: any) {
      console.error("Prediction error:", error);
      toast.error(error.message || "Failed to get prediction. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-medical-border shadow-medical">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-6 h-6 text-primary" />
          Health Data Input
        </CardTitle>
        <CardDescription>
          Connect Google Fit or enter your health information manually
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Google Fit Integration */}
        <div className="mb-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Google Fit Integration</h3>
            </div>
            {googleFitConnected && (
              <span className="text-xs bg-green-500/20 text-green-700 px-2 py-1 rounded">Connected</span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            {googleFitConnected 
              ? "Sync your latest health data from Google Fit" 
              : "Connect to automatically import height, weight, steps, and calories"}
          </p>
          <div className="flex gap-2">
            {!googleFitConnected ? (
              <Button type="button" variant="outline" onClick={handleGoogleFitAuth}>
                Connect Google Fit
              </Button>
            ) : (
              <Button 
                type="button" 
                variant="outline" 
                onClick={syncGoogleFitData}
                disabled={isSyncing}
              >
                {isSyncing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Sync Data
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age (years)</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                placeholder="30"
                required
                min="1"
                max="120"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Male</SelectItem>
                  <SelectItem value="2">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                placeholder="170"
                required
                min="50"
                max="250"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                placeholder="70"
                required
                min="20"
                max="300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="systolic_bp">Systolic BP (mmHg)</Label>
              <Input
                id="systolic_bp"
                type="number"
                value={formData.systolic_bp}
                onChange={(e) => setFormData({ ...formData, systolic_bp: e.target.value })}
                placeholder="120"
                required
                min="60"
                max="250"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="diastolic_bp">Diastolic BP (mmHg)</Label>
              <Input
                id="diastolic_bp"
                type="number"
                value={formData.diastolic_bp}
                onChange={(e) => setFormData({ ...formData, diastolic_bp: e.target.value })}
                placeholder="80"
                required
                min="40"
                max="150"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cholesterol">Cholesterol Level</Label>
              <Select value={formData.cholesterol} onValueChange={(value) => setFormData({ ...formData, cholesterol: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Normal</SelectItem>
                  <SelectItem value="2">Above Normal</SelectItem>
                  <SelectItem value="3">Well Above Normal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="glucose">Glucose Level</Label>
              <Select value={formData.glucose} onValueChange={(value) => setFormData({ ...formData, glucose: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Normal</SelectItem>
                  <SelectItem value="2">Above Normal</SelectItem>
                  <SelectItem value="3">Well Above Normal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="smoking">Smoking Status</Label>
              <Select value={formData.smoking} onValueChange={(value) => setFormData({ ...formData, smoking: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">No</SelectItem>
                  <SelectItem value="1">Yes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="alcohol">Alcohol Consumption</Label>
              <Select value={formData.alcohol} onValueChange={(value) => setFormData({ ...formData, alcohol: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">No</SelectItem>
                  <SelectItem value="1">Yes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="physical_activity">Physical Activity</Label>
              <Select value={formData.physical_activity} onValueChange={(value) => setFormData({ ...formData, physical_activity: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">No</SelectItem>
                  <SelectItem value="1">Yes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            variant="hero"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Get Prediction"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default HealthDataForm;
