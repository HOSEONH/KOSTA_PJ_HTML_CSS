import { fetchDiaryEntry } from "./supabase.js";

export function generateCalendar(year, month, updateDiaryContent) {
    const calendarGrid = document.getElementById("calendarGrid");
    calendarGrid.innerHTML = "";

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    document.getElementById("calendarTitle").textContent = `${year}년 ${month + 1}월`;

    for (let i = 0; i < startingDay; i++) {
        const emptyDay = document.createElement("div");
        emptyDay.className = "calendar-day";
        calendarGrid.appendChild(emptyDay);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement("div");
        dayElement.className = "calendar-day";
        const dateString = `${year}-${(month + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
        dayElement.dataset.date = dateString;

        dayElement.addEventListener("click", async function () {
            document.querySelector(".calendar-day.active")?.classList.remove("active");
            this.classList.add("active");
            updateDiaryContent(dateString);
        });


          const spanElement = document.createElement("span");
          spanElement.textContent = day;
          dayElement.appendChild(spanElement);

        fetchDiaryEntry(dateString).then(data => {
            if (data.image_url && data.image_url !== "images/default.jpg") {
                dayElement.classList.add("has-photo");

                const imgElement = document.createElement("img");
                imgElement.src = data.image_url;
                imgElement.alt = "사진";
                dayElement.appendChild(imgElement);

                spanElement.classList.add("photo-number");

            } 
        });

        calendarGrid.appendChild(dayElement);
    }
}
