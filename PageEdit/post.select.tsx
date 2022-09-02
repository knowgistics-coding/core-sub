import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { collection, getDocs, query, where } from "firebase/firestore";
import {
  cloneElement,
  Fragment,
  ReactElement,
  useEffect,
  useState,
} from "react";
import { useCore } from "../context";
import { KuiButton } from "../KuiButton";
import { PostOptions, usePE } from "./context";

interface PostSelectProps {
  open?: boolean;
  onOpen?: (open: boolean) => void;
  value?: string;
  onChange?: (post: PostOptions) => void;
  children?: ReactElement;
  clearValueAfterConfirm?: boolean;
}

export const PostSelect = ({
  open: defaultOpen,
  onOpen,
  value: defaultValue,
  onChange,
  children,
  clearValueAfterConfirm,
}: PostSelectProps) => {
  const { fb, user } = useCore();
  const { prefix } = usePE();
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");
  const [posts, setPosts] = useState<PostOptions[]>([]);

  const handleOpen = (open: boolean) => () => {
    setOpen(open);
    onOpen?.(open);
  };
  const handleChangeValue = ({ target: { value } }: SelectChangeEvent) => {
    setValue(value);
  };
  const handleConfirm = () => {
    if (value && onChange) {
      const post = posts.find((post) => post.id === value);
      if (post) {
        onChange(post);
      }
    }
    setOpen(false);
    if (clearValueAfterConfirm) {
      setValue("");
    }
  };

  useEffect(() => {
    if (open && fb?.db && user.data) {
      getDocs(
        query(
          collection(fb.db, "clients", `${prefix}`, `websites`),
          where("type", "==", "post"),
          where("user", "==", user.data.uid)
        )
      ).then((snapshot) => {
        const posts = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as PostOptions[];
        setPosts(posts);
      });
    }
  }, [open, user, fb?.db, prefix]);

  useEffect(() => {
    if (defaultOpen !== undefined) {
      setOpen(defaultOpen);
    }
  }, [defaultOpen]);

  useEffect(() => {
    if (open === true && defaultValue !== undefined) {
      setValue(defaultValue);
    }
  }, [defaultValue, open]);

  return (
    <Fragment>
      {children &&
        cloneElement(children, {
          onClick: handleOpen(true),
        })}
      <Dialog fullWidth maxWidth="xs" open={open} onClose={handleOpen(false)}>
        <DialogTitle>Post Select</DialogTitle>
        <DialogContent>
          <Box pt={2} />
          <FormControl fullWidth>
            <InputLabel>Post</InputLabel>
            <Select label="Post" value={value} onChange={handleChangeValue}>
              <MenuItem value="" disabled>
                -- Select Post --
              </MenuItem>
              {posts.map((item) => (
                <MenuItem value={item.id} key={item.id}>
                  {item.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <KuiButton tx="confirm" disabled={!value} onClick={handleConfirm} />
          <KuiButton tx="close" onClick={handleOpen(false)} />
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};
