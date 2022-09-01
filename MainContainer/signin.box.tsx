import { useCore } from "../context";
import { SignIn } from "../SignIn";
import { useMC } from "./ctx";

export const MCSignInBox = () => {
  const { user } = useCore();
  const {
    state: { anchorProfile },
    setState,
  } = useMC();

  return user.loading === false &&
    !Boolean(user.data) &&
    Boolean(anchorProfile) ? (
    <SignIn onClose={() => setState((s) => ({ ...s, anchorProfile: null }))} />
  ) : null;
};
