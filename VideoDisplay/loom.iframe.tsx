export const LoomIframe = ({ src }: { src: string }) => {
  return (
    <>
      <iframe
        src={src}
        frameBorder="0"
        allowFullScreen
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
        title={window.btoa(src).slice(0, 16)}
      ></iframe>
    </>
  );
};
