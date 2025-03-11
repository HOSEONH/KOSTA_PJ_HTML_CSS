import { generateCalendar } from "./calendar.js";
import { updateDiaryContent, setupDiarySaveButton } from "./diary.js";

document.addEventListener("DOMContentLoaded", () => {
    const today = new Date();
    let currentYear = today.getFullYear();
    let currentMonth = today.getMonth();

    generateCalendar(currentYear, currentMonth, updateDiaryContent);
    setupDiarySaveButton();

    document.getElementById("prevMonth").addEventListener("click", () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        generateCalendar(currentYear, currentMonth, updateDiaryContent);
    });

    document.getElementById("nextMonth").addEventListener("click", () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        generateCalendar(currentYear, currentMonth, updateDiaryContent);
    });
});
