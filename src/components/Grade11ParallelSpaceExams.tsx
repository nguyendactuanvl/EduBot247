import React from 'react';
import { OnlineAiExamRoom, OnlineAiExamRoomConfig } from './OnlineAiExamRoom';
import { generateGrade11ParallelSpaceExamDirect } from '../services/geminiDirectClient';
import {
  GRADE11_PARALLEL_LESSON_BLUEPRINTS,
  GRADE11_PARALLEL_REVIEW_BLUEPRINTS,
  GRADE11_PARALLEL_TN_BLUEPRINTS,
  PARALLEL_SPACE_11_SCORES_KEY,
} from '../data/exams/grade11ParallelSpaceCatalog';

interface Grade11ParallelSpaceExamsProps {
  onBack?: () => void;
}

const GRADE11_PARALLEL_SPACE_CONFIG: OnlineAiExamRoomConfig = {
  scoresStorageKey: PARALLEL_SPACE_11_SCORES_KEY,
  backLabel: 'Quay lại Lớp 11',
  gradeTag: 'Toán 11 · KNTT (GDPT 2018)',
  chapterKicker: 'Chương IV · Hình học không gian',
  heading: 'Quan hệ song song trong không gian (Toán 11)',
  description:
    'Hệ thống phòng thi Online gồm 5 đề luyện tập theo bài học (Bài 10 – Bài 14, 45 phút/đề) và 15 đề Ôn tập chương chuẩn cấu trúc Bộ GD&ĐT (90 phút · 22 câu · 10,0 điểm: Phần I: 12 TN · Phần II: 4 Đúng/Sai · Phần III: 6 Trả lời ngắn). Tự động lưu cache và hỗ trợ sinh đề mới tương tự.',
  lessonSubtitle:
    'Thời lượng 45 phút/đề · 17 câu (10 Trắc nghiệm + 3 Đúng/Sai + 4 Trả lời ngắn) · Bài 10 đến Bài 14',
  tnSubtitle:
    'Thời lượng 90 phút/đề · Đúng 22 câu (10,0 điểm) · Phủ đều cả 5 bài & tích hợp thực tế kiến trúc, xây dựng, phép chiếu song song',
  reviewSubtitle:
    'Đúng 22 câu (10,0 điểm) · Tăng cường Vận dụng & Vận dụng cao (giao tuyến, thiết diện, tỉ số đoạn thẳng bằng định lí Thales trong không gian)',
  lessonBlueprints: GRADE11_PARALLEL_LESSON_BLUEPRINTS,
  tnBlueprints: GRADE11_PARALLEL_TN_BLUEPRINTS,
  reviewBlueprints: GRADE11_PARALLEL_REVIEW_BLUEPRINTS,
  generateExam: generateGrade11ParallelSpaceExamDirect,
};

export const Grade11ParallelSpaceExams: React.FC<Grade11ParallelSpaceExamsProps> = ({ onBack }) => {
  return <OnlineAiExamRoom config={GRADE11_PARALLEL_SPACE_CONFIG} onBack={onBack} />;
};
