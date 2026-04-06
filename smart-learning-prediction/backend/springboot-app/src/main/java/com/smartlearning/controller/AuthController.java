package com.smartlearning.controller;

import com.smartlearning.model.Faculty;
import com.smartlearning.model.Student;
import com.smartlearning.repository.FacultyRepository;
import com.smartlearning.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private FacultyRepository facultyRepository;

    @Autowired
    private StudentRepository studentRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        // Simple auth check without Spring Security for rapid MVP
        Optional<Faculty> facultyOpt = facultyRepository.findByEmail(email);
        
        if (facultyOpt.isPresent() && facultyOpt.get().getPassword().equals(password)) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("facultyId", facultyOpt.get().getId().toString());
            response.put("role", "FACULTY");
            return ResponseEntity.ok(response);
        } else {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid email or password");
            return ResponseEntity.status(401).body(error);
        }
    }

    @GetMapping("/faculty")
    public ResponseEntity<List<Faculty>> getAllFaculty() {
        return ResponseEntity.ok(facultyRepository.findAll());
    }

    @PostMapping("/student-login")
    public ResponseEntity<?> studentLogin(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        Optional<Student> studentOpt = studentRepository.findByEmail(email);
        
        if (studentOpt.isPresent() && password.equals(studentOpt.get().getPassword())) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("studentId", studentOpt.get().getId().toString());
            response.put("role", "STUDENT");
            return ResponseEntity.ok(response);
        } else {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid email or password");
            return ResponseEntity.status(401).body(error);
        }
    }
}
