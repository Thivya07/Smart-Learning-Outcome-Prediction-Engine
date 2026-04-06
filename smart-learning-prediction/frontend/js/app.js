document.addEventListener('DOMContentLoaded', () => {

    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    const currentPath = window.location.pathname.split('/').pop() || 'dashboard.html';
    
    if (currentPath && navItems.length > 0) {
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === currentPath) {
                item.classList.add('active');
            }
        });
    }

    const API_BASE_URL = 'http://localhost:8080/api';

    if (currentPath === 'students.html') {
        fetchStudentsPage();
    } else if (currentPath === 'dashboard.html' || currentPath === '') {
        fetchDashboardSummary();
        fetchDashboardAlerts();
    } else if (currentPath === 'reports.html') {
        fetchReportsPage();
    } else if (currentPath === 'predictions.html') {
        initPredictions();
    }

    function calculatePredictionForDisplay(student) {
        const cgpa = student.cgpa || 0;
        const ut = student.utScore || 0;
        const assess = student.assessmentScore || 0;
        let predFloat = (cgpa * 20.0) + (ut * 0.4) + (assess * 0.4);
        let predScore = Math.round(predFloat);
        if (predScore > 100) predScore = 100;
        if (predScore < 0) predScore = 0;
        
        let riskLevel = "At Risk";
        let statusClass = "status-low";
        let badgeClass = "badge-risk";
        let color = "var(--danger)";
        let textClass = "";

        if (predScore >= 80) {
            riskLevel = "Excellent";
            statusClass = "status-high";
            badgeClass = "badge-good";
            color = "var(--success)";
            textClass = "text-success";
        } else if (predScore >= 60) {
            riskLevel = "Average";
            statusClass = "status-medium";
            badgeClass = "badge-average";
            color = "var(--warning)";
            textClass = "text-warning";
        }

        return { score: predScore, riskLevel, statusClass, badgeClass, color, textClass };
    }

    async function fetchStudentsPage() {
        const tableBody = document.querySelector('.data-table tbody');
        const countText = document.getElementById('students-count-text');
        if (!tableBody) return;

        try {
            const response = await fetch(`${API_BASE_URL}/students`);
            if (!response.ok) throw new Error('Network response was not ok');
            const students = await response.json();
            
            if (countText) countText.textContent = `Showing 1 to ${students.length} of ${students.length} students`;

            if (students.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 2rem; color: var(--text-muted);">No student records found in database.</td></tr>';
                return;
            }

            tableBody.innerHTML = '';
            students.forEach(student => {
                const tr = document.createElement('tr');
                const p = calculatePredictionForDisplay(student);

                tr.innerHTML = `
                    <td style="color: var(--text-muted); font-size: 0.85rem;">#ST${student.id}</td>
                    <td style="font-weight: 500;">${student.name}</td>
                    <td>${student.department}</td>
                    <td>${(student.cgpa || 0).toFixed(2)}</td>
                    <td>${student.utScore || 0}%</td>
                    <td>${student.assessmentScore || 0}%</td>
                    <td style="font-weight: 600; color: ${p.color};">${p.score}%</td>
                    <td><span class="status-badge ${p.statusClass}">${p.riskLevel}</span></td>
                    <td>
                        <div class="action-btns">
                            <button class="btn-view" onclick="viewStudent(${student.id})"><i data-lucide="eye" style="width: 14px;"></i> View</button>
                            <button class="btn-edit" onclick="editStudent(${student.id})"><i data-lucide="edit-2" style="width: 14px;"></i> Edit</button>
                        </div>
                    </td>
                `;
                tableBody.appendChild(tr);
            });
            if (typeof lucide !== 'undefined') lucide.createIcons();
            
            setupStudentModal();

        } catch (error) {
            console.error("Failed to fetch students:", error);
            tableBody.innerHTML = `<tr><td colspan="9" style="text-align: center; padding: 2rem; color: var(--danger);">Failed to connect to backend.</td></tr>`;
        }
    }

    function setupStudentModal() {
        const modal = document.getElementById('studentModal');
        const addBtn = document.getElementById('addStudentBtn');
        const closeBtn = document.getElementById('closeModalBtn');
        const cancelBtn = document.getElementById('cancelModalBtn');
        const form = document.getElementById('studentForm');

        if (!modal || !addBtn) return;

        function openModal() {
            form.reset();
            document.getElementById('modalTitle').textContent = 'Add New Student';
            document.getElementById('studentId').value = '';
            modal.classList.add('active');
        }

        function closeModal() {
            modal.classList.remove('active');
        }

        // Avoid adding multiple listeners if fetch is called again
        addBtn.onclick = openModal;
        closeBtn.onclick = closeModal;
        cancelBtn.onclick = closeModal;

        form.onsubmit = async (e) => {
            e.preventDefault();
            
            const studentData = {
                name: document.getElementById('stuName').value,
                email: document.getElementById('stuEmail').value,
                password: document.getElementById('stuPassword').value,
                department: document.getElementById('stuDept').value,
                cgpa: parseFloat(document.getElementById('stuCgpa').value) || 0,
                utScore: parseFloat(document.getElementById('stuUt').value) || 0,
                assessmentScore: parseFloat(document.getElementById('stuAssess').value) || 0
            };

            const id = document.getElementById('studentId').value;
            const method = id ? 'PUT' : 'POST';
            const url = id ? `${API_BASE_URL}/students/${id}` : `${API_BASE_URL}/students`;

            try {
                const response = await fetch(url, {
                    method: method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(studentData)
                });

                if (response.ok) {
                    closeModal();
                    fetchStudentsPage(); // Refresh list
                } else {
                    alert('Failed to save student.');
                }
            } catch (error) {
                console.error("Error saving student:", error);
                alert('An error occurred while saving the student.');
            }
        };

        // Redefine edit inside closure to have access to this context
        window.editStudent = async function(id) {
            try {
                const response = await fetch(`${API_BASE_URL}/students`);
                const students = await response.json();
                const student = students.find(s => s.id === id);
                if (student) {
                    document.getElementById('modalTitle').textContent = 'Edit Student';
                    document.getElementById('studentId').value = student.id;
                    document.getElementById('stuName').value = student.name;
                    document.getElementById('stuEmail').value = student.email || '';
                    document.getElementById('stuPassword').value = student.password || '';
                    document.getElementById('stuDept').value = student.department;
                    document.getElementById('stuCgpa').value = student.cgpa;
                    document.getElementById('stuUt').value = student.utScore;
                    document.getElementById('stuAssess').value = student.assessmentScore;
                    modal.classList.add('active');
                }
            } catch (e) {
                console.error("Error fetching student for edit:", e);
            }
        };
    }

    async function fetchDashboardSummary() {
        try {
            const response = await fetch(`${API_BASE_URL}/reports/summary`);
            if (response.ok) {
                const data = await response.json();
                document.getElementById('dash-total-students').textContent = data.totalStudents || 0;
                document.getElementById('dash-at-risk').textContent = data.atRiskStudents || 0;
                
                // Estimate remaining values
                const good = data.goodStudents || 0;
                const avg = data.averageStudents || 0;
                const risk = data.atRiskStudents || 0;
                const total = data.totalStudents || 1;
                
                const estOutcome = ((good*90) + (avg*70) + (risk*45)) / total;
                document.getElementById('dash-avg-outcome').textContent = isNaN(estOutcome) ? '0%' : estOutcome.toFixed(1) + '%';
                
                const comp = ((good+avg)/total * 100);
                document.getElementById('dash-est-completion').textContent = isNaN(comp) ? '0%' : comp.toFixed(1) + '%';
                document.getElementById('dash-remedial').textContent = risk; // Use risk count as remedial
            }
        } catch (error) {
            console.error("Dashboard backend syncing failed", error);
        }
    }

    async function fetchDashboardAlerts() {
        const tbody = document.getElementById('dash-alerts-tbody');
        if (!tbody) return;
        try {
            const response = await fetch(`${API_BASE_URL}/students`);
            if (response.ok) {
                const students = await response.json();
                const atRisk = students.filter(s => calculatePredictionForDisplay(s).riskLevel === "At Risk").slice(0, 5);
                
                tbody.innerHTML = '';
                if(atRisk.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 1rem;">No high-priority cases found.</td></tr>';
                    return;
                }
                atRisk.forEach(s => {
                    const tr = document.createElement('tr');
                    const p = calculatePredictionForDisplay(s);
                    tr.innerHTML = `
                        <td>#ST${s.id}</td>
                        <td>${s.name}</td>
                        <td>${s.department}</td>
                        <td><span class="status-badge ${p.statusClass}">High Risk (${p.score}%)</span></td>
                        <td><button style="padding: 4px 12px; background: rgba(59, 130, 246, 0.1); border: 1px solid var(--accent); color: var(--accent); border-radius: 4px; cursor: pointer;">Pending Review</button></td>
                    `;
                    tbody.appendChild(tr);
                });
            }
        } catch(e) {}
    }

    async function fetchReportsPage() {
        const tbody = document.getElementById('reports-tbody');
        const countText = document.getElementById('reports-count-text');
        const applyBtn = document.getElementById('applyFilterBtn');
        const deptFilter = document.getElementById('deptFilter');
        const statusFilter = document.getElementById('statusFilter');
        if (!tbody) return;

        let allStudents = [];

        async function loadData() {
            try {
                tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 2rem;">Loading student performance data...</td></tr>';
                const response = await fetch(`${API_BASE_URL}/students`);
                if (response.ok) {
                    allStudents = await response.json();
                    renderTable(allStudents);
                }
            } catch(e) {
                tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: var(--danger); padding: 2rem;">Failed to load data.</td></tr>';
            }
        }

        function renderTable(data) {
            if (countText) countText.textContent = `Showing 1 to ${data.length} of ${data.length} entries`;
            tbody.innerHTML = '';
            
            if (data.length === 0) {
                 tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 2rem;">No entries match your filter.</td></tr>';
                 return;
            }

            data.forEach(s => {
                const initials = s.name ? s.name.split(' ').map(n => n[0]).join('') : '?';
                const tr = document.createElement('tr');
                const p = calculatePredictionForDisplay(s);
                
                let badgeIcon = p.badgeClass === 'badge-good' ? 'shield-check' : (p.badgeClass === 'badge-average' ? 'alert-circle' : 'alert-triangle');

                tr.innerHTML = `
                    <td style="padding-left: 1.5rem;">
                        <div class="student-details">
                            <div class="student-avatar" style="${p.badgeClass === 'badge-average' ? 'background: rgba(245, 158, 11, 0.1); color: #f59e0b;' : (p.badgeClass === 'badge-risk' ? 'background: rgba(239, 68, 68, 0.1); color: #ef4444;' : '')}">${initials.substring(0,2)}</div>
                            <div class="student-info">
                                <h4>${s.name}</h4>
                                <p>#ST${s.id}</p>
                            </div>
                        </div>
                    </td>
                    <td>${s.department}</td>
                    <td>Course Assigned</td>
                    <td class="score-col">${(s.cgpa || 0).toFixed(1)}</td>
                    <td class="score-col" style="color: #cbd5e1;">${s.utScore || 0}%</td>
                    <td class="score-col" style="color: #cbd5e1;">${s.assessmentScore || 0}%</td>
                    <td class="score-col" style="color: var(--text-primary); font-weight: 600;">${p.score}%</td>
                    <td>
                        <div class="badge ${p.badgeClass}">
                            <i data-lucide="${badgeIcon}" style="width: 14px;"></i> ${p.riskLevel}
                        </div>
                    </td>
                `;
                tbody.appendChild(tr);
            });
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }

        if (applyBtn) {
            applyBtn.addEventListener('click', () => {
                const deptVal = deptFilter ? deptFilter.value : '';
                const statusVal = statusFilter ? statusFilter.value : '';

                let filtered = allStudents;
                
                if (deptVal) {
                    filtered = filtered.filter(s => s.department === deptVal);
                }
                
                if (statusVal) {
                    filtered = filtered.filter(s => {
                        const p = calculatePredictionForDisplay(s);
                        return p.riskLevel === statusVal;
                    });
                }
                
                renderTable(filtered);
            });
        }

        loadData();
    }

    function initPredictions() {
        const form = document.getElementById('simulatorForm');
        const resultCard = document.getElementById('resultCard');
        if (!form) return;

        // Optional logic to fetch student data via ID
        const nameInput = document.getElementById('studentName');
        nameInput.addEventListener('blur', async () => {
            const val = nameInput.value.trim();
            if(val.startsWith('#ST') || val.startsWith('ST') || !isNaN(val)) {
                let id = val.replace('#ST', '').replace('ST', '');
                try {
                    const res = await fetch(`${API_BASE_URL}/students`);
                    const students = await res.json();
                    const s = students.find(st => st.id == id);
                    if(s) {
                        document.getElementById('cgpa').value = s.cgpa;
                        document.getElementById('utScore').value = s.utScore;
                        document.getElementById('assessmentScore').value = s.assessmentScore;
                        nameInput.value = s.name;
                    }
                } catch(e) {}
            }
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const cgpa = parseFloat(document.getElementById('cgpa').value) || 0;
            const utScore = parseFloat(document.getElementById('utScore').value) || 0;
            const assessmentScore = parseFloat(document.getElementById('assessmentScore').value) || 0;
            const studentName = document.getElementById('studentName').value.trim();

            try {
                const response = await fetch(`${API_BASE_URL}/predict`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ cgpa: cgpa, ut_score: utScore, assessment_score: assessmentScore })
                });

                if (response.ok) {
                    const data = await response.json();
                    
                    document.getElementById('resultStudentName').textContent = studentName ? `Analysis for: ${studentName}` : 'Anonymous Analysis';
                    document.getElementById('finalScore').textContent = data.predicted_score + '%';
                    
                    const pText = document.getElementById('perfText');
                    const rText = document.getElementById('riskText');
                    const scoreCircle = document.getElementById('scoreCircle');
                    const pBadge = document.getElementById('perfBadge');
                    const rBadge = document.getElementById('riskBadge');

                    let circleColor = '#ef4444';
                    if (data.predicted_score >= 80) {
                        pText.textContent = "Excellent"; rText.textContent = "Low Risk";
                        circleColor = '#22c55e';
                        pBadge.className = 'badge badge-excellent'; rBadge.className = 'badge badge-excellent';
                    } else if (data.predicted_score >= 60) {
                        pText.textContent = "Average"; rText.textContent = "Medium Risk";
                        circleColor = '#f59e0b';
                        pBadge.className = 'badge badge-average'; rBadge.className = 'badge badge-average';
                    } else {
                        pText.textContent = "At Risk"; rText.textContent = "High Risk";
                        circleColor = '#ef4444';
                        pBadge.className = 'badge badge-risk'; rBadge.className = 'badge badge-risk';
                    }
                    scoreCircle.style.borderColor = circleColor;
                    scoreCircle.style.boxShadow = `0 0 20px -5px ${circleColor}`;

                    // Set contributions from backend breakdown
                    if(data.breakdown) {
                        const maxCgpa = 100; // cgpa contrib max is 100 (5.0 * 20)
                        const maxUt = 40;   // ut contrib max is 40
                        const maxAss = 40;  // ass contrib max is 40
                        
                        document.getElementById('cont-cgpa').textContent = `+${data.breakdown.cgpa_contribution.toFixed(1)}%`;
                        document.getElementById('bar-cgpa').style.width = `${(data.breakdown.cgpa_contribution / maxCgpa) * 100}%`;
                        
                        document.getElementById('cont-ut').textContent = `+${data.breakdown.ut_contribution.toFixed(1)}%`;
                        document.getElementById('bar-ut').style.width = `${(data.breakdown.ut_contribution / maxUt) * 100}%`;
                        
                        document.getElementById('cont-assessment').textContent = `+${data.breakdown.assessment_contribution.toFixed(1)}%`;
                        document.getElementById('bar-assessment').style.width = `${(data.breakdown.assessment_contribution / maxAss) * 100}%`;
                    }

                    resultCard.classList.add('active');
                }
            } catch(e) { console.error('Prediction failed', e); }
        });

        document.getElementById('resetBtn').addEventListener('click', () => {
            form.reset();
            resultCard.classList.remove('active');
        });
    }
});

window.viewStudent = function(id) {
    alert('Initiating view function for backend student ID: ' + id);
};
window.editStudent = function(id) {
    alert('Initiating edit mode for backend student ID: ' + id);
};
