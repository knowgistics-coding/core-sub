import { Box, styled } from "@mui/material";
import { grey } from "@mui/material/colors";
import { QDContext, QuizDisplayProps } from "./context";
import { QDInstruction } from "./instruction";
import { QDMatching } from "./matching";
import { QDMultiple } from "./multiple";
import { QDQuestion } from "./question";
import { QDSorting } from "./sorting";
import { QDTrueFalse } from "./truefalse";

const Root = styled(Box)(({ theme }) => ({
  border: `solid 1px ${grey[300]}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
}));

export type { QuizAnswerTypes } from "./context";
export const QuizDisplay = ({
  quiz,
  value,
  onChange,
  containerProps,
}: QuizDisplayProps) => {
  return (
    <QDContext.Provider value={{ quiz, value, onChange }}>
      <Box {...containerProps}>
        <QDInstruction />
        <Root>
          <QDQuestion />
          {(() => {
            switch (quiz.type) {
              case "multiple":
                return <QDMultiple />;
              case "truefalse":
                return <QDTrueFalse />;
              case "matching":
                return <QDMatching />;
              case "sorting":
                return <QDSorting />;
              default:
                return null;
            }
          })()}
        </Root>
      </Box>
    </QDContext.Provider>
  );
};
