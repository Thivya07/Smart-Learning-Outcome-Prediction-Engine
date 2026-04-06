package com.smartlearning.model;

import jakarta.persistence.*;

@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="student_id")
    private Long id;
    
    @Column(name="student_name")
    private String name;
    
    @Column(unique = true)
    private String email;
    
    private String password;
    
    private String department;
    
    private Double cgpa;
    
    @Column(name="ut_score")
    private Integer utScore;
    
    @Column(name="assessment_score")
    private Integer assessmentScore;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public Double getCgpa() { return cgpa; }
    public void setCgpa(Double cgpa) { this.cgpa = cgpa; }
    public Integer getUtScore() { return utScore; }
    public void setUtScore(Integer utScore) { this.utScore = utScore; }
    public Integer getAssessmentScore() { return assessmentScore; }
    public void setAssessmentScore(Integer assessmentScore) { this.assessmentScore = assessmentScore; }
}
