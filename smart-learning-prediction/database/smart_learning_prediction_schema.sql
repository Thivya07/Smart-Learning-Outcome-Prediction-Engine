DROP DATABASE IF EXISTS smart_learning_prediction;
CREATE DATABASE smart_learning_prediction;
USE smart_learning_prediction;

CREATE TABLE courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_name VARCHAR(100) NOT NULL,
    levels INT NOT NULL,
    category VARCHAR(50) NOT NULL
);

CREATE TABLE faculty (
    faculty_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    department VARCHAR(100)
);

CREATE TABLE students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    student_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    department VARCHAR(100),
    cgpa DECIMAL(3,2),
    ut_score INT,
    assessment_score INT
);

INSERT INTO faculty (name, email, password, department) VALUES
('Admin','faculty@college.com','123456','Computer Science'),
('Dr. Alan Turing','alan@university.edu','password123','Computer Science');

INSERT INTO students (student_name, email, password, department, cgpa, ut_score, assessment_score) VALUES 
('Alex Johnson', 'alex.j@university.edu', 'student123', 'Computer Science', 3.8, 88, 92),
('Maria Garcia', 'maria.g@university.edu', 'student123', 'Mathematics', 2.7, 64, 55),
('James Smith', 'james.s@university.edu', 'student123', 'Physics', 3.1, 72, 68),
('Emily Davis', 'emily.d@university.edu', 'student123', 'Engineering', 3.9, 94, 95);

INSERT INTO courses (course_name, levels, category) VALUES
('C Programming',7,'Software'),
('Cloud Infrastructure',6,'Software'),
('Computer Networking',5,'Software'),
('Creative Media',1,'Software'),
('Data Science',1,'Software'),
('Data Structure',11,'Software'),
('Database Programming',4,'Software'),
('Digital Assurance',1,'Software'),
('HTML / CSS',1,'Software'),
('Linux',4,'Software'),
('Maths for Machine Learning',1,'Software'),
('Mobile App Development - Android (Java)',1,'Software'),
('Operating Systems',1,'Software'),
('Programming C++',3,'Software'),
('Programming Java',4,'Software'),
('Programming Python',5,'Software');
