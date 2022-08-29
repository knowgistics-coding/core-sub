import { Typography } from "@mui/material";
import { useCore } from '../context'
import { quizAnswerCheck } from "../func";
import { QuizAnswerTypes } from "../QuizAnswer";
import { QuizDocument } from "../QuizEditor";

export const ScoreDisplay = ({
  questions,
  answers,
}: {
  answers: Record<string, QuizAnswerTypes>;
  questions: (QuizDocument & { id: string })[];
}) => {
  const { t } = useCore();

  return (
    <>
      <Typography variant="h4" textAlign="center" sx={{ mb: 3 }}>
        {t("Score")}&nbsp;
        {questions.reduce((score, question) => {
          return quizAnswerCheck(question, answers[question.id])
            ? score + 1
            : score;
        }, 0)}
        /{questions.length || 0}
      </Typography>
    </>
  );
};
