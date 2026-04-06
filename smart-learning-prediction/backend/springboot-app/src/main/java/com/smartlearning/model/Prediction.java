package com.smartlearning.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "predictions")
public class Prediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="prediction_id")
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="student_id")
    private Student student;
    
    @Column(name="predicted_score")
    private Integer predictedScore;
    
    @Column(name="risk_level")
    private String riskLevel;
    
    @Column(name="prediction_date")
    private LocalDate predictionDate;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
    public Integer getPredictedScore() { return predictedScore; }
    public void setPredictedScore(Integer predictedScore) { this.predictedScore = predictedScore; }
    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }
    public LocalDate getPredictionDate() { return predictionDate; }
    public void setPredictionDate(LocalDate predictionDate) { this.predictionDate = predictionDate; }
}
