package com.smartlearning.controller;

import com.smartlearning.model.Student;
import com.smartlearning.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/students")
public class StudentController {

    @Autowired
    private StudentRepository studentRepository;

    @GetMapping
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable Long id) {
        Optional<Student> studentOpt = studentRepository.findById(id);
        if (studentOpt.isPresent()) {
            return ResponseEntity.ok(studentOpt.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public Student addStudent(@RequestBody Student student) {
        return studentRepository.save(student);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Student> updateStudent(@PathVariable Long id, @RequestBody Student studentDetails) {
        Optional<Student> studentOpt = studentRepository.findById(id);
        
        if (studentOpt.isPresent()) {
            Student existingStudent = studentOpt.get();
            existingStudent.setName(studentDetails.getName());
            if(studentDetails.getEmail() != null) existingStudent.setEmail(studentDetails.getEmail());
            if(studentDetails.getPassword() != null) existingStudent.setPassword(studentDetails.getPassword());
            existingStudent.setDepartment(studentDetails.getDepartment());
            existingStudent.setCgpa(studentDetails.getCgpa());
            existingStudent.setUtScore(studentDetails.getUtScore());
            existingStudent.setAssessmentScore(studentDetails.getAssessmentScore());
            return ResponseEntity.ok(studentRepository.save(existingStudent));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable Long id) {
        if (studentRepository.existsById(id)) {
            studentRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
