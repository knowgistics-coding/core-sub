import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { List, ListItemText, ListItemIcon } from "@mui/material";
import { BackLink } from "../BackLink";
import { KuiListItemButton } from "../KuiListItemButton";
import { MainContainer } from "../MainContainer";
import { PageDocument } from "../PageEdit";
import { StockDisplay, StockDisplayProps } from "../StockDisplay";
import { ReactNode, useEffect } from "react";
import { To, useNavigate } from "react-router-dom";
import { IconName } from "@fortawesome/fontawesome-svg-core";
import { PageViewer } from "../PageViewer";
import { useCore } from "../context";
import { CourseAssignment, CourseAssignmentProps } from "./assignment";
import { Breadcrumb } from "../ContentHeader";
import { Timestamp } from "firebase/firestore";

const icons: Record<string, IconName> = {
  lesson: "chalkboard",
  quiz: "list-ol",
  assignment: "file-alt",
};

export type MaterialDocument = {
  id: string;
  title: string;
  type: string;
  content?: string;
  files?: { name: string; url: string }[];
  datedue: string;
  schedule?: { start: string; end: string; timezone: string };
  datemodified?: Timestamp
};

export type CourseViewerData = {
  title: string;
  feature?: StockDisplayProps;
  material: MaterialDocument[];
  syllabus?: PageDocument;
  datemodified?: Timestamp | Date | number;
};

export type CourseViewerProps = {
  loading?: boolean;
  restrict?: ReactNode;
  data?: CourseViewerData;
  selected?: string;
  links: {
    root: To;
  };
  breadcrumbs: Breadcrumb[];
  submit: CourseAssignmentProps["submit"];
  onAssignmentSubmit: CourseAssignmentProps["onSend"];
  onAssignmentUnsubmit: CourseAssignmentProps["onUnsend"];
};

export * from "./assignment";
export const CourseViewer = (props: CourseViewerProps) => {
  const { t } = useCore();
  const nav = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  }, [props.selected]);

  return (
    <MainContainer
      dense
      loading={props.loading}
      restrict={Boolean(props.restrict)}
      restrictProps={{
        icon: "file-slash",
        message: props.restrict,
        link: "/",
      }}
      signInOnly
      sidebar={
        <>
          <BackLink divider to="/" />
          {props.data?.feature && (
            <StockDisplay {...props.data?.feature} ratio={1 / 3} />
          )}
          <List dense>
            <KuiListItemButton
              divider
              selected={!Boolean(props.selected)}
              onClick={() => nav(props.links.root)}
            >
              <ListItemText
                primary={props.data?.title}
                secondary={props.data?.title}
                primaryTypographyProps={{ variant: "h6" }}
                secondaryTypographyProps={{
                  variant: "caption",
                  color: "inherit",
                }}
              />
            </KuiListItemButton>
            {props.data?.material
              .sort((a, b) => {
                const getSort = (a: any) =>
                  typeof a?.sort === "number" ? a.sort : 9999;
                return getSort(a) - getSort(b);
              })
              .map((item) => (
                <KuiListItemButton
                  divider
                  key={item.id}
                  selected={props.selected === item.id}
                  onClick={() =>
                    nav(`${props.links.root}/${item.type}/${item.id}`, {
                      state: {
                        data: item,
                        back: props.links.root,
                        breadcrumbs: props.breadcrumbs.concat([
                          {
                            label: props.data?.title,
                            to: `${props.links.root}`,
                          },
                          {
                            label: item.title,
                          },
                        ]),
                      },
                    })
                  }
                >
                  <ListItemIcon>
                    <FontAwesomeIcon
                      icon={["far", icons[item.type] || "question"]}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.title}
                    primaryTypographyProps={{
                      variant: "body2",
                      color: "textSecondary",
                    }}
                  />
                </KuiListItemButton>
              ))}
          </List>
        </>
      }
    >
      {props.selected ? (
        ((id: string): JSX.Element => {
          const item = (props.data?.material || []).find(
            (item) => item.id === id
          );
          if (item) {
            switch (item.type) {
              case "lesson":
                return (
                  <PageViewer
                    breadcrumbs={[
                      ...props.breadcrumbs,
                      { label: props.data?.title, to: props.links.root },
                      { label: item.title },
                    ]}
                    noContainer
                    data={item}
                  />
                );
              case "assignment":
                return (
                  <CourseAssignment
                    assignmentId={item.id}
                    item={item}
                    breadcrumbs={[
                      ...props.breadcrumbs,
                      { label: props.data?.title, to: props.links.root },
                      { label: item.title },
                    ]}
                    submit={props.submit}
                    onSend={props.onAssignmentSubmit}
                    onUnsend={props.onAssignmentUnsubmit}
                  />
                );
              default:
                return <></>;
            }
          }
          return <></>;
        })(props.selected)
      ) : (
        <PageViewer
          noContainer
          breadcrumbs={[...props.breadcrumbs, { label: props.data?.title }]}
          data={
            Object.assign({}, props.data?.syllabus, {
              title: t("Syllabus"),
              datemodified: props.data?.datemodified,
            }) as PageDocument
          }
        />
      )}
    </MainContainer>
  );
};
