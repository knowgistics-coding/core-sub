import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useCore } from "../context";
import { Question, QuestionAnswer, Quiz } from "../Controller";
import { KuiButton } from "../KuiButton";
import { QuizDisplay } from "../QuizDisplay";
import { Progress } from "../Quizing/progress";

export type QuizDialogPreviewProps = {
  quizId?: string;
  onClose?: () => void;
};

export const QuizDialogPreview = (props: QuizDialogPreviewProps) => {
  const { t, user } = useCore();
  const [state, setState] = useState<{
    loading: boolean;
    quiz: null | Quiz;
    questions: Question[];
    step: number;
  }>({
    loading: true,
    quiz: null,
    questions: [],
    step: 0,
  });
  const [answers, setAnswers] = useState<Record<string, QuestionAnswer>>({});

  const handlePrev = () => setState((s) => ({ ...s, step: s.step - 1 }));
  const handleNext = () => setState((s) => ({ ...s, step: s.step + 1 }));

  useEffect(() => {
    if (props.quizId && user.data) {
      setAnswers({});
      Quiz.managerPreview(user.data, props.quizId).then(
        ({ quiz, questions }) => {
          setState((s) => ({ ...s, step: 0, loading: false, quiz, questions }));
        }
      );
    }
  }, [props.quizId, user.data]);

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={Boolean(props.quizId)}
      onClose={props?.onClose}
    >
      <DialogTitle>Preview: {state.quiz?.title}</DialogTitle>
      <DialogContent>
        <Progress
          loading={state.loading}
          step={state.step}
          length={state.questions.length}
        />
        {state.questions.map(
          (question, index) =>
            state.step === index && (
              <Box
                key={question.id}
                sx={{
                  mt: 3,
                  border: "solid 1px",
                  borderColor: "divider",
                  p: 2,
                  borderRadius: 2,
                }}
              >
                <QuizDisplay
                  quiz={question}
                  value={answers[question.id!]}
                  onChange={(answer) =>
                    setAnswers((s) => ({
                      ...s,
                      [question.id!]: answer(
                        s?.[question.id!] ?? new QuestionAnswer()
                      ),
                    }))
                  }
                />
              </Box>
            )
        )}
      </DialogContent>
      <DialogActions>
        {state.step > 0 && <Button onClick={handlePrev}>{t("Prev")}</Button>}
        {state.step < state.questions.length - 1 && (
          <Button onClick={handleNext}>{t("Next")}</Button>
        )}
        <KuiButton tx="close" onClick={props.onClose} />
      </DialogActions>
    </Dialog>
  );
};
