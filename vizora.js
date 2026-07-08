const ADMIN_EMAIL =
    "admin@vizora.com";

const ADMIN_PASSWORD =
    "admin123";
function openRegisterModal() {
    document.getElementById("authModal").style.display = "none";
    document.getElementById("registerModal").style.display = "flex";
}

function backToLogin() {
    document.getElementById("registerModal").style.display = "none";
    document.getElementById("authModal").style.display = "flex";
}

function registerUser() {

    const name = document.getElementById("regName").value;
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;

    if (name && email && password) {

        let users =
            JSON.parse(
                localStorage.getItem("vizora_users")
            ) || [];

        if (users.some(u => u.email === email)) {
            showAlert(
                "Account Exists",
                "Email already registered"
            );
            return;
        }

        const role =
            document.getElementById("regRole").value;

        users.push({
            name,
            email,
            password,
            role
        });

        localStorage.setItem(
            "vizora_users",
            JSON.stringify(users)
        );

        showAlert(
            "Account Created",
            "Registration completed successfully"
        );

        backToLogin();

    } else {

        showAlert(
            "Validation Error",
            "Please fill all fields"
        );
    }
}

function login() {

    const email =
        document.getElementById("email").value;

    const password =
        document.getElementById("password").value;

    // Admin Login
    if (
        email === ADMIN_EMAIL &&
        password === ADMIN_PASSWORD
    ) {

        localStorage.setItem(
            "vizora_role",
            "Admin"
        );

        localStorage.setItem(
            "vizora_user",
            email
        );

        document.getElementById(
            "authModal"
        ).style.display = "none";

        showAlert(
            "Admin Login",
            "Welcome Administrator"
        );

        checkRole();
        checkViewerAccess();
        return;
    }

    // User Login
    const users =
        JSON.parse(
            localStorage.getItem("vizora_users")
        ) || [];

    const user = users.find(u =>
        u.email === email &&
        u.password === password
    );

    if (user) {

        localStorage.setItem(
            "vizora_role",
            user.role
        );

        localStorage.setItem(
            "vizora_user",
            user.email
        );

        document.getElementById(
            "authModal"
        ).style.display = "none";

        showAlert(
            "Login Successful",
            "Welcome " + user.name
        );

        checkRole();
        checkViewerAccess();

    } else {

        showAlert(
            "Login Failed",
            "Invalid Email or Password"
        );
    }
}

function logout() {

    localStorage.removeItem("vizora_user");

    document.getElementById("authModal").style.display = "flex";

    document.getElementById("email").value = "";
    document.getElementById("password").value = "";

    showAlert(
        "Logged Out",
        "You have been logged out successfully"
    );
}

function checkRole() {

    const role =
        localStorage.getItem(
            "vizora_role"
        );

    const usersBtn =
        document.getElementById(
            "usersBtn"
        );

    if (!usersBtn) return;

    if (role === "Admin") {

        usersBtn.style.display =
            "block";

    } else {

        usersBtn.style.display =
            "none";
    }
}

function checkViewerAccess() {

    const role =
        localStorage.getItem("vizora_role");

    if (role === "Viewer") {

        document.getElementById("usersBtn").style.display = "none";

        document.getElementById("monitoringBtn").style.display = "none";

        document.getElementById("reportsBtn").style.display = "none";

        document.getElementById("settingsBtn").style.display = "none";

    }

}

setInterval(() => {
    document.getElementById("clock").innerText =
        new Date().toLocaleTimeString();
}, 1000);

document.querySelector(".search").addEventListener("keyup", function () {

    const value = this.value.toLowerCase();

    document.querySelectorAll(".menu button").forEach(btn => {

        btn.style.display =
            btn.innerText.toLowerCase().includes(value)
                ? "block"
                : "none";
    });
});

document.querySelectorAll(".menu button").forEach(btn => {

    btn.addEventListener("click", () => {

        document.querySelectorAll(".menu button")
            .forEach(b => b.classList.remove("active"));

        btn.classList.add("active");
    });
});

function animate(el, target) {

    let c = 0;

    let t = setInterval(() => {

        c += target / 50;

        if (c >= target) {

            c = target;
            clearInterval(t);
        }

        el.innerText = Math.floor(c);

    }, 30);
}

animate(document.getElementById("servers"), 128);

new Chart(document.getElementById("trafficChart"), {

    type: "line",

    data: {

        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],

        datasets: [{

            label: "Requests",

            data: [120, 190, 300, 250, 280, 350, 420],

            borderWidth: 3,

            tension: .4
        }]
    },

    options: {

        responsive: true,

        maintainAspectRatio: false
    }
});
setTimeout(() => {

    const t = document.getElementById("toast");

    t.style.display = "block";

    setTimeout(() => {

        t.style.display = "none";

    }, 4000);

}, 2000);
let dark = true;

document.getElementById("themeBtn").onclick = () => {

    dark = !dark;

    if (!dark) {

        document.body.style.background = "#f3f4f6";
        document.body.style.color = "#111";

    } else {

        location.reload();
    }
};
function showProfile() {
    hideAllPages();

    document.getElementById("dashboardPage").style.display = "block";
    document.getElementById("profilePage").style.display = "block";
}
function showSettings() {
    hideAllPages();

    document.getElementById("dashboardPage").style.display = "block";
    document.getElementById("settingsPage").style.display = "block";
}

function showDashboard() {

    hideAllPages();

    document.getElementById("dashboardPage").style.display = "block";
}

function saveProfile() {

    localStorage.setItem(
        "vizora_name",
        document.getElementById("profileName").value
    );

    localStorage.setItem(
        "vizora_user",
        document.getElementById("profileEmail").value
    );

    showAlert(
        "Profile Updated",
        "Your profile has been saved"
    );
}

function saveSettings() {

    const theme =
        document.getElementById("themeSelect").value;

    const cpuThreshold =
        document.getElementById("cpuThreshold").value;

    const memoryThreshold =
        document.getElementById("memoryThreshold").value;

    localStorage.setItem("theme", theme);
    localStorage.setItem("cpuThreshold", cpuThreshold);
    localStorage.setItem("memoryThreshold", memoryThreshold);

    showAlert(
        "Settings Saved",
        "Alert configuration updated successfully"
    );
}
function showAlert(title, message) {

    document.getElementById("alertTitle").innerText = title;

    document.getElementById("alertMessage").innerText = message;

    document.getElementById("customAlert").style.display = "flex";
}
window.onload = function () {

    checkRole();
    checkViewerAccess();

    const currentUser =
        localStorage.getItem("vizora_user");

    if (currentUser) {

        document.getElementById(
            "authModal"
        ).style.display = "none";

    } else {

        document.getElementById(
            "authModal"
        ).style.display = "flex";
    }

    if (localStorage.getItem("cpuThreshold")) {

        document.getElementById(
            "cpuThreshold"
        ).value =
            localStorage.getItem(
                "cpuThreshold"
            );
    }

    if (localStorage.getItem("memoryThreshold")) {

        document.getElementById(
            "memoryThreshold"
        ).value =
            localStorage.getItem(
                "memoryThreshold"
            );
    }
};
function closeAlert() {

    document.getElementById("customAlert").style.display = "none";
}
// STEP 6 ALERT CENTER

let alerts = [];

let drawerOpen = false;

function toggleAlerts() {

    const drawer =
        document.getElementById("alertDrawer");

    if (!drawerOpen) {

        drawer.style.right = "0";
        drawerOpen = true;

    } else {

        drawer.style.right =
            window.innerWidth <= 768 ? "-100%" : "-400px";

        drawerOpen = false;
    }
}

function addAlert(message) {

    alerts.unshift({

        text: message,

        time: new Date().toLocaleTimeString()
    });

    renderAlerts();
}

function renderAlerts() {

    const container =
        document.getElementById("alertList");

    container.innerHTML = "";

    alerts.forEach(alert => {

        container.innerHTML += `

<div class="alert-item">

<strong>${alert.text}</strong>

<br>

<small>${alert.time}</small>

</div>

`;
    });

    document.getElementById(
        "alertCount"
    ).innerText = alerts.length;
}

function clearAlerts() {

    alerts = [];

    renderAlerts();

    document.getElementById("alertDrawer").style.right = "-400px";

    drawerOpen = false;

    showAlert(
        "Alerts Cleared",
        "All alerts marked as read"
    );
}

// STEP 10 - ALERT CONFIGURATION ENGINE

setInterval(() => {

    const cpuValue =
        40 + Math.floor(Math.random() * 50);

    const memoryValue =
        50 + Math.floor(Math.random() * 50);

    document.getElementById("cpu").innerText =
        cpuValue + "%";

    document.getElementById("req").innerText =
        (20 + Math.random() * 10).toFixed(1) + "K";

    const cpuThreshold =
        parseInt(
            localStorage.getItem("cpuThreshold")
        ) || 80;

    const memoryThreshold =
        parseInt(
            localStorage.getItem("memoryThreshold")
        ) || 90;

    if (cpuValue > cpuThreshold) {

        addAlert(
            `CPU Usage High (${cpuValue}%)`
        );
    }

    if (memoryValue > memoryThreshold) {

        addAlert(
            `Memory Usage High (${memoryValue}%)`
        );
    }

}, 1000);
document.addEventListener("click", function (e) {

    const drawer =
        document.getElementById("alertDrawer");

    const bell =
        document.querySelector(".bell");

    if (
        drawerOpen &&
        !drawer.contains(e.target) &&
        !bell.contains(e.target)
    ) {

        drawer.style.right = "-400px";

        drawerOpen = false;
    }
});
function hideAllPages() {

    document.getElementById("dashboardPage").style.display = "none";
    document.getElementById("analyticsPage").style.display = "none";
    document.getElementById("monitoringPage").style.display = "none";
    document.getElementById("alertsPage").style.display = "none";
    document.getElementById("reportsPage").style.display = "none";

    document.getElementById("profilePage").style.display = "none";
    document.getElementById("settingsPage").style.display = "none";
    document.getElementById("logsPage").style.display = "none";
    document.getElementById("usersPage").style.display = "none";
}


function showAnalytics() {

    hideAllPages();

    document.getElementById(
        "analyticsPage"
    ).style.display = "block";

    if(!cpuChart){
        initAnalyticsCharts();
    }
}


function showMonitoring() {

    hideAllPages();

    document.getElementById(
        "monitoringPage"
    ).style.display = "block";
}


function showAlertsPage() {

    hideAllPages();

    document.getElementById(
        "alertsPage"
    ).style.display = "block";

    loadAlertHistory();
}

function loadAlertHistory() {

    const container =
        document.getElementById(
            "alertsHistoryContainer"
        );

    container.innerHTML = "";

    alerts.forEach(alert => {

        container.innerHTML += `

        <div class="alert-item">

            <strong>${alert.text}</strong>

            <br>

            <small>${alert.time}</small>

        </div>

        `;

    });
}
function showReports() {

    hideAllPages();

    document.getElementById(
        "reportsPage"
    ).style.display = "block";
}

function exportCSV() {

    let csv =

        `Report,Date,Status
System Report,Today,Generated
Analytics Report,Yesterday,Generated
Monitoring Report,This Week,Pending`;

    let blob = new Blob(
        [csv],
        { type: "text/csv" }
    );

    let a =
        document.createElement("a");

    a.href =
        URL.createObjectURL(blob);

    a.download =
        "vizora-report.csv";

    a.click();

    showAlert(
        "Export Complete",
        "CSV report downloaded successfully"
    );
}

function exportAlerts() {

    let csv = "Message,Time\n";

    alerts.forEach(alert => {
        csv += `${alert.text},${alert.time}\n`;
    });

    downloadCSV(csv, "alerts-report.csv");
}

function exportServers() {

    let csv =
        `Server,Status,CPU,Memory
Server-01,Online,42%,3.2GB
Server-02,Offline,0%,0GB
Server-03,Online,78%,7.4GB`;

    downloadCSV(csv, "server-report.csv");
}

function downloadCSV(content, fileName) {

    const blob = new Blob([content], {
        type: "text/csv"
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = fileName;

    a.click();

    URL.revokeObjectURL(url);
}

let systemLogs = [];

function addLog(message) {

    systemLogs.unshift({
        text: message,
        time: new Date().toLocaleTimeString()
    });

    renderLogs();
}

function renderLogs() {

    const container =
        document.getElementById("logsContainer");

    if (!container) return;

    container.innerHTML = "";

    systemLogs.forEach(log => {

        container.innerHTML += `
        <div class="log">
            [${log.time}] ${log.text}
        </div>`;
    });
}

function showLogs() {

    hideAllPages();

    document.getElementById(
        "logsPage"
    ).style.display = "block";

    renderLogs();
}

function clearLogs() {

    systemLogs = [];

    renderLogs();

    showAlert(
        "Logs Cleared",
        "All logs removed successfully"
    );
}

setInterval(() => {

    const logMessages = [

        "API Request Received",
        "Database Connected",
        "Monitoring Synced",
        "User Login Success",
        "Server Health Checked",
        "Analytics Updated"

    ];

    addLog(
        logMessages[
        Math.floor(
            Math.random() *
            logMessages.length
        )
        ]
    );

}, 10000);

// STEP 12 - MULTI SERVER CONTROL PANEL

function startServer(serverId) {

    document.getElementById(
        serverId + "Status"
    ).innerText = "Online";

    document.getElementById(
        serverId + "Status"
    ).style.color = "lime";

    document.getElementById(
        serverId + "Cpu"
    ).innerText =
        (30 + Math.floor(Math.random() * 50)) + "%";

    addLog(
        serverId.toUpperCase() + " Started"
    );

    addAlert(
        serverId.toUpperCase() + " Back Online"
    );

    showAlert(
        "Server Started",
        serverId.toUpperCase() + " is now running"
    );
}

function stopServer(serverId) {

    document.getElementById(
        serverId + "Status"
    ).innerText = "Offline";

    document.getElementById(
        serverId + "Status"
    ).style.color = "red";

    document.getElementById(
        serverId + "Cpu"
    ).innerText = "0%";

    addLog(
        serverId.toUpperCase() + " Stopped"
    );

    addAlert(
        serverId.toUpperCase() + " Offline"
    );

    showAlert(
        "Server Stopped",
        serverId.toUpperCase() + " has been stopped"
    );
}
// STEP 13 - USER MANAGEMENT MODULE

function showUsers() {

    hideAllPages();

    document.getElementById(
        "usersPage"
    ).style.display = "block";

    loadUsers();
}

function loadUsers() {

    const table =
        document.getElementById("usersTable");

    table.innerHTML = "";

    const users =
        JSON.parse(
            localStorage.getItem("vizora_users")
        ) || [];

    users.forEach((user, index) => {

        table.innerHTML += `
        <tr>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>
                <button onclick="deleteUser(${index})">
                    Delete
                </button>
            </td>
        </tr>
        `;
    });

    document.getElementById(
        "totalUsers"
    ).innerText = users.length;
}

function deleteUser(index) {

    let users =
        JSON.parse(
            localStorage.getItem("vizora_users")
        ) || [];

    users.splice(index, 1);

    localStorage.setItem(
        "vizora_users",
        JSON.stringify(users)
    );

    loadUsers();

    addLog("User Deleted");
    addAlert("User Account Removed");

    showAlert(
        "User Deleted",
        "User removed successfully"
    );
}

function toggleMenu() {

    const menu = document.getElementById("mobileMenu");

    if (menu.style.display === "flex") {
        menu.style.display = "none";
    } else {
        menu.style.display = "flex";
    }
}

// STEP 15 - REAL TIME ANALYTICS

let cpuData = [20, 30, 40, 50, 60];
let memoryData = [45, 50, 55, 60, 65];
let requestData = [10, 15, 20, 25, 30];

let labels = ["1", "2", "3", "4", "5"];

let cpuChart;
let memoryChart;
let requestChart;

function initAnalyticsCharts() {

    if (document.getElementById("cpuChart")) {

        cpuChart = new Chart(
            document.getElementById("cpuChart"),
            {
                type: "line",
                data: {
                    labels: labels,
                    datasets: [{
                        label: "CPU %",
                        data: cpuData,
                        borderWidth: 3,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            }
        );

        memoryChart = new Chart(
            document.getElementById("memoryChart"),
            {
                type: "line",
                data: {
                    labels: labels,
                    datasets: [{
                        label: "Memory %",
                        data: memoryData,
                        borderWidth: 3
                    }]
                }
            }
        );

        requestChart = new Chart(
            document.getElementById("requestChart"),
            {
                type: "line",
                data: {
                    labels: labels,
                    datasets: [{
                        label: "Requests",
                        data: requestData,
                        borderWidth: 3
                    }]
                }
            }
        );
    }
}

setTimeout(initAnalyticsCharts, 1000);

setInterval(() => {

    if (!cpuChart) return;

    let cpu =
        Math.floor(Math.random() * 100);

    let memory =
        Math.floor(Math.random() * 100);

    let requests =
        Math.floor(Math.random() * 50);

    document.getElementById(
        "liveCpu"
    ).innerText = cpu + "%";

    document.getElementById(
        "liveMemory"
    ).innerText = memory + "%";

    document.getElementById(
        "liveRequests"
    ).innerText = requests + "K";

    cpuData.push(cpu);
    memoryData.push(memory);
    requestData.push(requests);

    if (cpuData.length > 10) {

        cpuData.shift();
        memoryData.shift();
        requestData.shift();

        cpuChart.data.labels.shift();
        memoryChart.data.labels.shift();
        requestChart.data.labels.shift();
    }

    let next =
        Number(cpuChart.data.labels.at(-1)) + 1;

    cpuChart.data.labels.push(next);
    memoryChart.data.labels.push(next);
    requestChart.data.labels.push(next);

    cpuChart.data.datasets[0].data = cpuData;
    memoryChart.data.datasets[0].data = memoryData;
    requestChart.data.datasets[0].data = requestData;

    cpuChart.update();
    memoryChart.update();
    requestChart.update();

}, 3000);

function resetAnalytics(){

    cpuData = [20,30,40,50,60];
    memoryData = [45,50,55,60,65];
    requestData = [10,15,20,25,30];

    labels = ["1","2","3","4","5"];

    cpuChart.data.labels = [...labels];
    memoryChart.data.labels = [...labels];
    requestChart.data.labels = [...labels];

    cpuChart.data.datasets[0].data = cpuData;
    memoryChart.data.datasets[0].data = memoryData;
    requestChart.data.datasets[0].data = requestData;

    cpuChart.update();
    memoryChart.update();
    requestChart.update();

    showAlert(
        "Analytics Reset",
        "Analytics data cleared successfully"
    );
}

let generatedReport = "";
function generateReport(type) {

    let report = "";

    const time =
        new Date().toLocaleString();

    if (type === "system") {

        report =
`VIZORA SYSTEM REPORT
Generated : ${time}

Active Servers : ${document.getElementById("servers").innerText}

CPU Usage : ${document.getElementById("cpu").innerText}

Requests/min : ${document.getElementById("req").innerText}

System Health : 99.9%
`;
    }

    else if (type === "analytics") {

        report =
`VIZORA ANALYTICS REPORT
Generated : ${time}

CPU : ${document.getElementById("liveCpu").innerText}

Memory : ${document.getElementById("liveMemory").innerText}

Requests : ${document.getElementById("liveRequests").innerText}
`;
    }

    else if (type === "monitoring") {

        report =
`VIZORA MONITORING REPORT
Generated : ${time}

Server-01 : ${document.getElementById("server1Status").innerText}

Server-02 : ${document.getElementById("server2Status").innerText}

Server-03 : ${document.getElementById("server3Status").innerText}
`;
    }

    generatedReport = report;

    document.getElementById(
        "reportPreview"
    ).innerText = report;

    addLog(
        type.toUpperCase() +
        " Report Generated"
    );

    showAlert(
        "Report Generated",
        type.toUpperCase() +
        " report created successfully"
    );
}

function downloadReport() {

    if (generatedReport === "") {

        showAlert(
            "No Report",
            "Please generate a report first"
        );

        return;
    }

    const blob =
        new Blob(
            [generatedReport],
            {
                type: "text/plain"
            }
        );

    const url =
        URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    a.href = url;

    a.download =
        "vizora-report.txt";

    a.click();

    URL.revokeObjectURL(url);

    showAlert(
        "Download Complete",
        "Report downloaded successfully"
    );
}