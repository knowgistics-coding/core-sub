import { library, IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faAlignCenter,
  faAlignLeft,
  faAlignRight,
  faArrows,
  faArrowsMinimize,
  faArrowsUpDown,
  faArrowsV,
  faBagShopping,
  faBan,
  faBars,
  faBed,
  faBicycle,
  faBook,
  faBookAlt,
  faBookOpen,
  faBriefcase,
  faBrowser,
  faBus,
  faCactus,
  faCalendar,
  faCamera,
  faCar,
  faCaretDown,
  faChalkboard,
  faChalkboardTeacher,
  faCheck,
  faCheckCircle,
  faCheckSquare,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faChevronUp,
  faChild,
  faCircle,
  faCircleCheck,
  faClock,
  faCodeBranch,
  faCog,
  faCopy,
  faCopyright,
  faCrop,
  faDiagramPredecessor,
  faDownload,
  faDrawPolygon,
  faEdit,
  faEllipsisV,
  faEnvelope,
  faExchangeAlt,
  faExclamationTriangle,
  faEye,
  faEyeSlash,
  faFileAlt,
  faFileCircleXmark,
  faFileDownload,
  faFileSlash,
  faFolder,
  faFolderOpen,
  faFolderPlus,
  faGraduationCap,
  faGripDotsVertical,
  faGripLines,
  faHeading,
  faHome,
  faHorizontalRule,
  faHospital,
  faImage,
  faImages,
  faInfoCircle,
  faLink,
  faLinkSlash,
  faListOl,
  faMagnifyingGlassMinus,
  faMagnifyingGlassPlus,
  faMapMarkerAlt,
  faMobile,
  faMugSaucer,
  faNewspaper,
  faPaperclip,
  faPaperPlane,
  faParagraph,
  faPlane,
  faPlus,
  faPlusCircle,
  faQuestion,
  faQuestionCircle,
  faRedo,
  faRetweet,
  faRoute,
  faSave,
  faSchool,
  faShip,
  faSignIn,
  faSignOut,
  faSpinner,
  faSubway,
  faSyncAlt,
  faTable,
  faTrain,
  faTrash,
  faTv,
  faUnlink,
  faUpload,
  faUserEdit,
  faUserPlus,
  faUtensils,
  faVideo,
  faWalking,
  faXmark,
  faXmarkCircle,
} from "@fortawesome/pro-regular-svg-icons";
import { faYoutube, faFacebook } from "@fortawesome/free-brands-svg-icons";
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";

const iconLists = [
  faChevronLeft,
  faSave,
  faPaperclip,
  faPaperPlane,
  faRedo,
  faArrows,
  faMobile,
  faTv,
  faFolder,
  faFileAlt,
  faCalendar,
  faClock,
  faBookOpen,
  faFolderOpen,
  faLink,
  faFacebook,
  faYoutube,
  faVideo,
  faImages,
  faCopyright,
  faBars,
  faUserPlus,
  faEye,
  faEyeSlash,
  faXmark,
  faSignIn,
  faSave,
  faChevronRight,
  faChevronDown,
  faXmarkCircle,
  faEdit,
  faCamera,
  faTrash,
  faPlusCircle,
  faExclamationTriangle,
  faQuestionCircle,
  faChevronUp,
  faDiagramPredecessor,
  faEllipsisV,
  faGripDotsVertical,
  faArrowsV,
  faCog,
  faPlus,
  faRetweet,
  faLinkSlash,
  faCrop,
  faHeading,
  faParagraph,
  faImage,
  faNewspaper,
  faTable,
  faHorizontalRule,
  faCheckSquare,
  faCactus,
  faQuestion,
  faDrawPolygon,
  faPlane,
  faTrain,
  faBus,
  faShip,
  faUtensils,
  faMugSaucer,
  faBagShopping,
  faChild,
  faBriefcase,
  faBed,
  faHospital,
  faSchool,
  faSubway,
  faCar,
  faBicycle,
  faWalking,
  faBan,
  faSignOut,
  faUnlink,
  faDownload,
  faUpload,
  faCopy,
  faInfoCircle,
  faAlignLeft,
  faAlignCenter,
  faAlignRight,
  faArrowsUpDown,
  faFileSlash,
  faChalkboard,
  faListOl,
  faCaretDown,
  faFileDownload,
  faFolderPlus,
  faBrowser,
  faSpinner,
  faCheck,
  faCheckCircle,
  faCircle,
  faMagnifyingGlassPlus,
  faMagnifyingGlassMinus,
  faBookAlt,
  faBook,
  faUserEdit,
  faCircleCheck,
  faHome,
  faGraduationCap,
  faChalkboardTeacher,
  faEnvelope,
  faFileCircleXmark,
  faGripLines,
  faArrowsMinimize,
  faExchangeAlt,
  faSyncAlt,
  faRoute,
  faMapMarkerAlt,
  faCodeBranch
] as IconDefinition[];

library.add(...iconLists);

export type PickIconName =
  | "align-center"
  | "align-right"
  | "align-left"
  | "arrows"
  | "arrows-minimize"
  | "arrows-up-down"
  | "arrows-v"
  | "bag-shopping"
  | "ban"
  | "bars"
  | "bed"
  | "bicycle"
  | "book"
  | "book-alt"
  | "book-open"
  | "briefcase"
  | "browser"
  | "bus"
  | "cactus"
  | "calendar"
  | "camera"
  | "car"
  | "caret-down"
  | "chalkboard"
  | "chalkboard-teacher"
  | "check"
  | "check-circle"
  | "check-square"
  | "chevron-down"
  | "chevron-left"
  | "chevron-right"
  | "chevron-up"
  | "child"
  | "circle"
  | "circle-check"
  | "clock"
  | "code-branch"
  | "cog"
  | "copy"
  | "copyright"
  | "crop"
  | "diagram-predecessor"
  | "download"
  | "draw-polygon"
  | "edit"
  | "ellipsis-v"
  | "envelope"
  | "exchange-alt"
  | "exclamation-triangle"
  | "eye"
  | "eye-slash"
  | "facebook"
  | "file-alt"
  | "file-circle-xmark"
  | "file-download"
  | "file-slash"
  | "folder"
  | "folder-open"
  | "folder-plus"
  | "graduation-cap"
  | "grip-dots-vertical"
  | "grip-lines"
  | "heading"
  | "home"
  | "horizontal-rule"
  | "hospital"
  | "info-circle"
  | "image"
  | "images"
  | "link"
  | "link-slash"
  | "list-ol"
  | "magnifying-glass-minus"
  | "magnifying-glass-plus"
  | "map-marker-alt"
  | "mobile"
  | "mug-saucer"
  | "newspaper"
  | "paperclip"
  | "paragraph"
  | "paper-plane"
  | "plane"
  | "plus"
  | "plus-circle"
  | "question"
  | "question-circle"
  | "redo"
  | "retweet"
  | "route"
  | "save"
  | "school"
  | "ship"
  | "sign-in"
  | "sign-out"
  | "spinner"
  | "subway"
  | "sync-alt"
  | "table"
  | "train"
  | "trash"
  | "tv"
  | "unlink"
  | "upload"
  | "user-edit"
  | "user-plus"
  | "utensils"
  | "video"
  | "walking"
  | "xmark"
  | "xmark-circle"
  | "youtube";
export type PickIconProps = Omit<FontAwesomeIconProps, "icon"> & {
  icon: PickIconName;
};
export const PickIcon = ({ icon, ...props }: PickIconProps) => {
  return <FontAwesomeIcon icon={["far", icon]} {...props} />;
};
