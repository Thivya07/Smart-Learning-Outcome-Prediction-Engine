package com.smartlearning.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin; // Added as per instruction

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
public class PredictionController {

    @PostMapping("/predict")
    public ResponseEntity<?> calculatePrediction(@RequestBody Map<String, Object> inputData) {
        try {
            // Get values from JSON body using standard keys, parsing safely
            double cgpa = Double.parseDouble(inputData.getOrDefault("cgpa", "0").toString());
            double utScore = Double.parseDouble(inputData.getOrDefault("ut_score", "0").toString());
            double assessmentScore = Double.parseDouble(inputData.getOrDefault("assessment_score", "0").toString());

            // Algorithm requested by user: predicted = (cgpa*20) + (ut_score*0.4) + (assessment_score*0.4)
            double cgpaComponent = cgpa * 20.0;
            double utComponent = utScore * 0.4;
            double assessmentComponent = assessmentScore * 0.4;
            
            double predictedScoreFloat = cgpaComponent + utComponent + assessmentComponent;
            int predictedScore = (int) Math.round(predictedScoreFloat);
            
            // Keep predicted score capped at 100 for percentage scale
            if (predictedScore > 100) predictedScore = 100;
            if (predictedScore < 0) predictedScore = 0;

            // Risk Assessment Logic
            String riskLevel;
            if (predictedScore >= 80) {
                riskLevel = "Excellent";
            } else if (predictedScore >= 60) {
                riskLevel = "Average";
            } else {
                riskLevel = "At Risk";
            }

            // Prepare JSON Response
            Map<String, Object> response = new HashMap<>();
            response.put("predicted_score", predictedScore);
            response.put("risk_level", riskLevel);
            
            Map<String, Double> breakdown = new HashMap<>();
            breakdown.put("cgpa_contribution", cgpaComponent);
            breakdown.put("ut_contribution", utComponent);
            breakdown.put("assessment_contribution", assessmentComponent);
            response.put("breakdown", breakdown);

            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid input format. Ensure cgpa, ut_score, and assessment_score are provided as numbers.");
            return ResponseEntity.badRequest().body(error);
        }
    }
}
