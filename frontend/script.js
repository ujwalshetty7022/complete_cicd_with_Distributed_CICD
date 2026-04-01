const fileInput = document.getElementById("fileInput");
const cleanBtn = document.getElementById("cleanBtn");
const fileName = document.getElementById("fileName");

const loader = document.getElementById("loader");
const reportCard = document.getElementById("reportCard");
const tableCard = document.getElementById("tableCard");
const chartCard = document.getElementById("chartCard");

let chartInstance;

// File select
fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file) {
        fileName.textContent = file.name;
        cleanBtn.disabled = false;
    }
});

// Clean data
cleanBtn.addEventListener("click", async () => {
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("file", file);

    loader.classList.remove("hidden");

    const res = await fetch("http://127.0.0.1:8000/clean", {
        method: "POST",
        body: formData
    });

    const data = await res.json();

    loader.classList.add("hidden");

    // Report
    let reportHTML = `
      <p><b>Rows Before:</b> ${data.report.rows_before}</p>
      <p><b>Rows After:</b> ${data.report.rows_after}</p>
      <p><b>Duplicates Removed:</b> ${data.report.duplicates_removed}</p>
    `;

    if (data.suggestions.length > 0) {
        reportHTML += "<h3>💡 Suggestions</h3>";
        data.suggestions.forEach(s => {
            reportHTML += `<p>${s}</p>`;
        });
    }

    document.getElementById("report").innerHTML = reportHTML;
    reportCard.classList.remove("hidden");

    // Chart fix
    if (chartInstance) chartInstance.destroy();

    chartInstance = new Chart(document.getElementById("chart"), {
        type: "bar",
        data: {
            labels: ["Before", "After"],
            datasets: [{
                label: "Rows",
                data: [data.report.rows_before, data.report.rows_after],
                borderRadius: 8
            }]
        }
    });

    chartCard.classList.remove("hidden");

    // Table
    const preview = data.preview;
    let table = "<table><tr>";

    const cols = Object.keys(preview);
    cols.forEach(c => table += `<th>${c}</th>`);
    table += "</tr>";

    const rows = Object.keys(preview[cols[0]]);
    rows.forEach(i => {
        table += "<tr>";
        cols.forEach(c => {
            table += `<td>${preview[c][i]}</td>`;
        });
        table += "</tr>";
    });

    table += "</table>";

    document.getElementById("preview").innerHTML = table;
    tableCard.classList.remove("hidden");
});