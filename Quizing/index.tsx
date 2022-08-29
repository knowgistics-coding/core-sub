import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, Stack } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PrevButton, NextButton, SendButton } from "./button";
import { Progress } from "./progress";
import { ReactMaxAttemps } from "./reach.max.attemps";
import { ScoreDisplay } from "./score";
import { Breadcrumb, ContentHeader } from "../ContentHeader";
import { QuizDocument } from "../QuizEditor";
import { LoadingBox } from "./loading.box";
import { QuizAnswer, QuizAnswerTypes } from "../QuizAnswer";
import { useCore } from "../context";
import { useAlerts } from "../Alerts";
import { QuizDisplay } from "../QuizDisplay";

export type QuizingDataType = {
  title?: string;
  questions: (QuizDocument & { id: string })[];
};

export type QuizingProps = {
  loading?: boolean;
  data?: QuizingDataType;
  breadcrumbs?: Breadcrumb[];
  onConfirm: (answers: Record<string, QuizAnswerTypes>) => Promise<void>;
  onRedo: () => Promise<void>;
  back: string;
  limit?: Boolean;
};

export const Quizing = ({ data, ...props }: QuizingProps) => {
  const { t } = useCore();
  const [state, setState] = useState<{
    restrict: boolean;
    restrictMessage: "";
    loading: boolean;
    submit: boolean;
  }>({
    submit: false,
    restrict: false,
    restrictMessage: "",
    loading: true,
  });
  const [step, setStep] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, QuizAnswerTypes>>({});
  const { addAlert } = useAlerts();
  const nav = useNavigate();

  const isComplete = (): boolean => {
    if (data?.questions) {
      return data.questions
        .map((q) => q.id)
        .every((id) => Boolean(answers[id]));
    }
    return false;
  };
  const handleNext = () => {
    if (data?.questions.length) {
      const length = data?.questions.length - 1;
      if (step < length) {
        setStep((s) => s + 1);
      }
    }
  };
  const handleBack = () => setStep((s) => (s > 0 ? s - 1 : s));
  const handleConfirm = async () => {
    props
      .onConfirm(answers)
      .then(() => {
        setState((s) => ({ ...s, submit: true }));
      })
      .catch((err) => addAlert({ label: err.message, severity: "error" }));
  };
  const handleRedo = async () => {
    await props
      .onRedo()
      .then(() => {
        setState((s) => ({ ...s, submit: false }));
        setAnswers({});
        setStep(0);
      })
      .catch((err) => addAlert({ label: err.message, severity: "error" }));
  };

  return (
    <>
      <ContentHeader
        loading={props.loading}
        label={data?.title}
        breadcrumbs={props.breadcrumbs}
      />
      {state.submit ? (
        <>
          <ScoreDisplay questions={data?.questions || []} answers={answers} />
          {data?.questions.map((q) => (
            <QuizAnswer
              quiz={q}
              answer={answers[q.id]}
              key={q.id}
              containerProps={{ sx: { mb: 2 } }}
            />
          ))}
          <Stack spacing={1} direction="row" justifyContent={"center"}>
            <Button
              variant="outlined"
              color="neutral"
              startIcon={<FontAwesomeIcon icon={["far", "chevron-left"]} />}
              onClick={() => nav(props.back)}
            >
              {t("Back")}
            </Button>
            <Button
              variant="outlined"
              color="info"
              startIcon={<FontAwesomeIcon icon={["far", "redo"]} />}
              onClick={handleRedo}
            >
              {t("Redo")}
            </Button>
          </Stack>
        </>
      ) : Boolean(props.limit) === false ? (
        <>
          <Progress
            loading={props.loading}
            step={step}
            length={data?.questions.length}
          />
          {props.loading ? (
            <LoadingBox />
          ) : (
            data?.questions.map((question, index, array) => (
              <div hidden={index !== step} key={question.id}>
                <QuizDisplay
                  quiz={question}
                  value={answers[question.id]}
                  onChange={(value) =>
                    setAnswers((s) => ({ ...s, [question.id]: value }))
                  }
                  containerProps={{ sx: { my: 2 } }}
                />
                <Box display={"flex"}>
                  {index !== 0 && <PrevButton onClick={handleBack} />}
                  <Box flex={1} />
                  {array.length - 1 !== index && (
                    <NextButton
                      onClick={handleNext}
                      disabled={!Boolean(answers[question.id])}
                    />
                  )}
                  {array.length - 1 === index && (
                    <SendButton
                      disabled={!isComplete()}
                      onClick={handleConfirm}
                    />
                  )}
                </Box>
              </div>
            ))
          )}
        </>
      ) : (
        <ReactMaxAttemps back={props.back} />
      )}
    </>
  );
};
