import React from 'react';
import { OnlineAiExamRoom, OnlineAiExamRoomConfig } from './OnlineAiExamRoom';
import { generateGrade12SpaceVectorExamDirect } from '../services/geminiDirectClient';
import {
  CHAPTER_REVIEW_BLUEPRINTS,
  LESSON_BLUEPRINTS,
  SPACE_VECTORS_SCORES_KEY,
  TN_THPT_BLUEPRINTS,
} from '../data/exams/grade12SpaceVectorsCatalog';

interface Grade12SpaceVectorsExamsProps {
  onBack?: () => void;
}

const GRADE12_SPACE_VECTORS_CONFIG: OnlineAiExamRoomConfig = {
  scoresStorageKey: SPACE_VECTORS_SCORES_KEY,
  backLabel: 'Quay lại Lớp 12',
  gradeTag: 'Toán 12 · KNTT (GDPT 2018)',
  chapterKicker: 'Chương II · Hình học & Tọa độ không gian Oxyz',
  heading: 'Vectơ trong không gian (Toán 12)',
  description:
    'Hệ thống phòng thi Online gồm 3 đề luyện tập theo bài (45 phút) và 15 đề Ôn tập chương chuẩn Bộ GD&ĐT (90 phút · 22 câu · 10,0 điểm). Đề thi biên soạn theo cấu trúc mới nhất (Phần I: 12 TN · Phần II: 4 Đúng/Sai · Phần III: 6 Trả lời ngắn) và tự động lưu cache để không mất bài khi tải lại trang.',
  lessonSubtitle:
    'Thời lượng 45 phút/đề · 17 câu (10 Trắc nghiệm + 3 Đúng/Sai + 4 Trả lời ngắn) · Bài 6 đến Bài 8',
  tnSubtitle:
    'Thời lượng 90 phút/đề · Đúng 22 câu (10,0 điểm) · Phủ đều toàn chương & tích hợp bài toán thực tế Oxyz',
  reviewSubtitle:
    'Đúng 22 câu (10,0 điểm) · Tăng cường câu hỏi phân hóa Vận dụng & Vận dụng cao (mục tiêu 9+)',
  lessonBlueprints: LESSON_BLUEPRINTS,
  tnBlueprints: TN_THPT_BLUEPRINTS,
  reviewBlueprints: CHAPTER_REVIEW_BLUEPRINTS,
  generateExam: generateGrade12SpaceVectorExamDirect,
};

export const Grade12SpaceVectorsExams: React.FC<Grade12SpaceVectorsExamsProps> = ({ onBack }) => {
  return <OnlineAiExamRoom config={GRADE12_SPACE_VECTORS_CONFIG} onBack={onBack} />;
};
