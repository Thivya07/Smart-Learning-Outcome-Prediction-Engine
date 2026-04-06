package com.smartlearning.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/reports")
public class ReportController {

    // Placeholder mock data endpoints intended to be tied to DB count queries later

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Integer>> getSummary() {
        Map<String, Integer> summary = new HashMap<>();
        summary.put("totalStudents", 1492);
        summary.put("goodStudents", 845);    // Mock data representation
        summary.put("averageStudents", 523); // Mock data representation
        summary.put("atRiskStudents", 124);  // Mock data representation
        
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStudentStatusDistribution() {
        Map<String, Object> data = new HashMap<>();
        
        String[] labels = {"Good", "Average", "At Risk"};
        int[] values = {845, 523, 124};

        data.put("labels", labels);
        data.put("values", values);
        
        return ResponseEntity.ok(data);
    }
}
