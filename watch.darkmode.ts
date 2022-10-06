export const watchDarkmode = (callback: (darkmode: boolean) => void) => {
  const elem = window.matchMedia("(prefers-color-scheme: dark)") ?? false;
  callback(elem.matches);
  elem.addEventListener("change", () => {
    callback(elem.matches);
  });
  return () => elem.removeEventListener("change", () => {});
};
