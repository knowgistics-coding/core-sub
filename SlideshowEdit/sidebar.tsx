import { useSlideshow } from ".";
import { BackLink } from "../BackLink";
import { FeatureImageEdit } from "../FeatureImage";
import { TitleEdit } from "../TitleEdit";
import { VisibilityEdit } from "../VisibilityEdit";

export const SlideshowEditSidebar = () => {
  const { back, value, onChange } = useSlideshow();

  return (
    <>
      <BackLink divider to={back} />
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
