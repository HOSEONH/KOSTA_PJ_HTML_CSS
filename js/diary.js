import { fetchDiaryEntry } from "./supabase.js";
import { saveDiaryEntry, uploadImage } from "./supabase.js";

export async function updateDiaryContent(dateString) {
  const data = await fetchDiaryEntry(dateString);
  const diaryImageContainer = document.getElementById("diaryImageContainer");

  diaryImageContainer.innerHTML = "";

  if (data.image_url && data.image_url !== "default") {
      const imgElement = document.createElement("img");
      imgElement.src = data.image_url;
      imgElement.alt = "사진";
      diaryImageContainer.appendChild(imgElement);
      diaryImageContainer.style.display = "block";
  } else {
      diaryImageContainer.style.display = "none";
  }

  document.getElementById("existingImage").value = data.image_url || "";

  document.getElementById("currentDate").textContent = dateString;
  document.getElementById("diaryContent").textContent = data.content || "아직 작성된 일기가 없습니다.";
  document.getElementById("newDiaryContent").value = data.content || "";
  document.getElementById("photoUpload").value = "";
}


export function setupDiarySaveButton() {
    const saveButton = document.getElementById("saveButton");

    saveButton.removeEventListener("click", handleSaveClick);

    saveButton.addEventListener("click", handleSaveClick);
}

async function handleSaveClick() {
  const content = document.getElementById("newDiaryContent").value;
  const imageFile = document.getElementById("photoUpload").files[0];
  const selectedDate = document.querySelector(".calendar-day.active")?.dataset.date;

  if (!selectedDate) {
      alert("날짜를 선택해주세요!");
      return;
  }

  let imageUrl = document.getElementById("existingImage").value;

  if (imageFile) {
      imageUrl = await uploadImage(imageFile);
  }

  await saveDiaryEntry(selectedDate, content, imageUrl);

  document.getElementById("existingImage").value = imageUrl;

  updateDiaryContent(selectedDate);
  updateCalendarImage(selectedDate, imageUrl);
}


function updateCalendarImage(dateString, imageUrl) {
    const dayElement = document.querySelector(`[data-date="${dateString}"]`);
    if (dayElement) {
        dayElement.classList.add("has-photo");

        const oldImg = dayElement.querySelector("img");
        if (oldImg) oldImg.remove();

        if (imageUrl) {
            const imgElement = document.createElement("img");
            imgElement.src = imageUrl;
            imgElement.alt = "사진";
            dayElement.appendChild(imgElement);
        }
    }
}

document.getElementById("photoUpload").addEventListener("change", function (event) {
    const file = event.target.files[0];
    const diaryImageContainer = document.getElementById("diaryImageContainer");

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            diaryImageContainer.innerHTML = "";
            const imgElement = document.createElement("img");
            imgElement.src = e.target.result;
            imgElement.alt = "업로드된 사진";
            diaryImageContainer.appendChild(imgElement);
            diaryImageContainer.style.display = "block";
        };
        reader.readAsDataURL(file);
    }
});
