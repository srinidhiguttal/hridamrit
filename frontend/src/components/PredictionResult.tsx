import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, Heart, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

interface PredictionResultProps {
  result: {
    predicted_class: number;
    probability: number;
  };
}

const PredictionResult = ({ result }: PredictionResultProps) => {
  const navigate = useNavigate();
  const isHighRisk = result.predicted_class === 1;
  const riskPercentage = (result.probability * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <Card className={`border-2 ${isHighRisk ? 'border-warning bg-warning/5' : 'border-success bg-success/5'}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            {isHighRisk ? (
              <>
                <AlertTriangle className="w-8 h-8 text-warning" />
                <span className="text-warning">High Risk Detected</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-8 h-8 text-success" />
                <span className="text-success">Low Risk</span>
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Risk Probability</span>
              <span className="text-2xl font-bold">{riskPercentage}%</span>
            </div>
            <Progress value={result.probability * 100} className="h-3" />
          </div>

          <div className="bg-card p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              {isHighRisk ? (
                <>
                  Your health data indicates a higher risk of heart-related issues. 
                  Please review the precautions and recommendations below, and consult 
                  with a healthcare professional immediately.
                </>
              ) : (
                <>
                  Your current health metrics show a lower risk. Continue maintaining 
                  a healthy lifestyle and regular checkups to keep your heart healthy.
                </>
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/precautions')}
              className="flex items-center gap-2"
            >
              <Heart className="w-4 h-4" />
              View Precautions
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/recommendations')}
              className="flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              Get Recommendations
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/alerts')}
              className="flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              Set Up Alerts
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictionResult;
