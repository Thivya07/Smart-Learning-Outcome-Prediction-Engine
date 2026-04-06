-- Database schema for Smart Learning Outcome Prediction Engine

CREATE DATABASE IF NOT EXISTS smart_learning_db;
USE smart_learning_db;

-- 1. Faculty Table
CREATE TABLE IF NOT EXISTS faculty (
    faculty_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    department VARCHAR(100)
);

-- 2. Students Table
CREATE TABLE IF NOT EXISTS students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    student_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    department VARCHAR(100),
    cgpa DECIMAL(3,2),
    ut_score INT,
    assessment_score INT
);

-- 3. Courses Table
CREATE TABLE IF NOT EXISTS courses (
    course_id INT AUTO_INCREMENT PRIMARY KEY,
    course_name VARCHAR(100) NOT NULL,
    category VARCHAR(100),
    levels INT,
    total_students INT
);

-- 4. Assessments Table
CREATE TABLE IF NOT EXISTS assessments (
    assessment_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    course_id INT,
    score INT,
    date DATE,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
);

-- 5. Predictions Table
CREATE TABLE IF NOT EXISTS predictions (
    prediction_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    predicted_score INT,
    risk_level VARCHAR(20),
    prediction_date DATE,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);

-- ==========================================
-- DUMMY DATA FOR TESTING STUDENT DASHBOARD
-- ==========================================

-- Insert a default Faculty member for testing
INSERT IGNORE INTO faculty (name, email, password, department) 
VALUES ('Dr. Alan Turing', 'alan@university.edu', 'password123', 'Computer Science');

-- Insert dummy Students for testing the Student Dashboard
INSERT IGNORE INTO students (student_name, email, password, department, cgpa, ut_score, assessment_score) VALUES 
('Alex Johnson', 'alex.j@university.edu', 'student123', 'Computer Science', 3.8, 88, 92),
('Maria Garcia', 'maria.g@university.edu', 'student123', 'Mathematics', 2.7, 64, 55),
('James Smith', 'james.s@university.edu', 'student123', 'Physics', 3.1, 72, 68),
('Emily Davis', 'emily.d@university.edu', 'student123', 'Engineering', 3.9, 94, 95);

