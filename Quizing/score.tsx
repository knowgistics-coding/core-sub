import { Typography } from "@mui/material";
import { useCore } from "../context";
import { Question, QuestionAnswer } from "../Controller";

export const ScoreDisplay = ({
  questions,
  answers,
}: {
  answers: Record<string, QuestionAnswer>;
  questions: Question[];
}) => {
  const { t } = useCore();

  return (
    <>
      <Typography variant="h4" textAlign="center" sx={{ mb: 3 }}>
        {t("Score")}&nbsp;
        {questions.reduce((score, question) => {
          if (question.id && answers[question.id]) {
            return answers[question.id].check(question) ? score + 1 : score;
          }
          return score;
        }, 0)}
        /{questions.length || 0}
      </Typography>
    </>
  );
};
