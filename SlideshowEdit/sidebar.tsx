import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, ListItem } from "@mui/material";
import { useSlideshow } from ".";
import { BackLink } from "../BackLink";
import { useCore } from "../context";
import { FeatureImageEdit } from "../FeatureImage";
import { TitleEdit } from "../TitleEdit";
import { VisibilityEdit } from "../VisibilityEdit";

export const SlideshowEditSidebar = () => {
  const { t } = useCore();
  const { back, value, onChange, onPreview } = useSlideshow();

  return (
    <>
      <BackLink divider to={back} />
      {onPreview && (
        <ListItem divider>
          <Button
            fullWidth
            variant="outlined"
            color="neutral"
            onClick={onPreview}
            size="large"
            startIcon={<FontAwesomeIcon icon={["far", "eye"]} />}
          >
            {t("Preview")}
          </Button>
        </ListItem>
      )}
      <TitleEdit
        value={value.title}
        onChange={(title) => onChange(value.set("title", title))}
      />
      <FeatureImageEdit
        value={value.feature}
        onChange={(val) => onChange(value.set("feature", val))}
        onRemove={() => onChange(value.set("feature", null))}
      />
      <VisibilityEdit
        value={value.visibility}
        onChange={(val) => onChange(value.set("visibility", val))}
      />
    </>
  );
};
