import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import config from "../config/key.js";

const supabaseUrl = config.supabaseUrl;
const supabaseAnonKey = config.supabaseAnonKey;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Supabase에서 일기 데이터 가져오기
export async function fetchDiaryEntry(date) {
  try {
    const { data, error } = await supabase
      .from("diary_entries")
      .select("*")
      .eq("date", date)
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) {
      console.error("일기 가져오기 오류:", error);
      return { content: "아직 작성된 일기가 없습니다.", image_url: "" };
    }

    return data.length > 0
      ? data[0]
      : { content: "아직 작성된 일기가 없습니다.", image_url: "" };
  } catch (err) {
    console.error("API 요청 중 오류 발생:", err);
    return { content: "오류 발생", image_url: "" };
  }
}

// Supabase에 일기 저장하기
export async function saveDiaryEntry(selectedDate, content, image) {
  if (!content.trim()) {
    alert("일기 내용을 입력해주세요!");
    return;
  }

  const { data, error } = await supabase.from("diary_entries").insert([
    {
      date: selectedDate,
      content,
      image_url: image,
      created_at: new Date().toISOString(),
    },
  ]);

  if (error) {
    console.error("일기 저장 오류:", error);
    alert("일기 저장에 실패했습니다.");
  } else {
    alert("일기가 저장되었습니다!");
    return data;
  }
}

export async function uploadImage(file) {
  if (!file) return null;

  const fileName = `${Date.now()}_${file.name}`;
  const { data, error } = await supabase.storage
    .from("diary-images")
    .upload(fileName, file, { cacheControl: "3600", upsert: false });

  if (error) {
    console.error("이미지 업로드 오류:", error);
    return null;
  }

  return supabase.storage.from("diary-images").getPublicUrl(fileName).data
    .publicUrl;
}
