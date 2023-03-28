import { BackLink } from "../BackLink";
import { CourseView } from "../Controller";
import MainContainer, { MainContainerProps } from "../MainContainer";
import { StockDisplay } from "../StockDisplay";
import { ButtonHome } from "./btn.home";

export type CourseDisplayProps = { back?: string; data?: CourseView } & Pick<
  MainContainerProps,
  "title" | "loading"
>;

export const CourseDisplay = (props: CourseDisplayProps) => {
  return (
    <MainContainer
      loading={props.loading}
      title={props.title}
      sidebar={
        <>
          {props.back && <BackLink to={props.back} />}
          {props.data?.feature && (
            <StockDisplay {...props.data.feature} ratio={1 / 4} />
          )}
          <ButtonHome
            primary={props.data?.title}
            secondary={props.data?.sectionName}
          />
        </>
      }
    ></MainContainer>
  );
};
