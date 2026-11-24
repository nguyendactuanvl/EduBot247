import React, { useMemo } from 'react';
import { OnlineAiExamRoom, OnlineAiExamRoomConfig } from './OnlineAiExamRoom';
import {
  getOnlineChapterDefinition,
  OnlineChapterKey,
} from '../data/exams/onlineChaptersCatalog';
import { generateOnlineChapterExamDirect } from '../services/geminiDirectClient';

interface OnlineChapterExamPageProps {
  chapterKey: OnlineChapterKey;
  onBack?: () => void;
}

export const OnlineChapterExamPage: React.FC<OnlineChapterExamPageProps> = ({
  chapterKey,
  onBack,
}) => {
  const config = useMemo<OnlineAiExamRoomConfig>(() => {
    const def = getOnlineChapterDefinition(chapterKey);
    return {
      scoresStorageKey: def.scoresStorageKey,
      backLabel: def.backLabel,
      gradeTag: def.gradeTag,
      chapterKicker: def.chapterKicker,
      heading: def.heading,
      description: def.description,
      lessonSubtitle: def.lessonSubtitle,
      tnSubtitle: def.tnSubtitle,
      reviewSubtitle: def.reviewSubtitle,
      lessonBlueprints: def.lessonBlueprints,
      tnBlueprints: def.tnBlueprints,
      reviewBlueprints: def.reviewBlueprints,
      generateExam: (examId, variantNumber, onRotateNotice) =>
        generateOnlineChapterExamDirect(chapterKey, examId, variantNumber, onRotateNotice),
    };
  }, [chapterKey]);

  return <OnlineAiExamRoom key={chapterKey} config={config} onBack={onBack} />;
};
