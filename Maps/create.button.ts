export const CreateButton = ():HTMLElement => {
  const newbutton = document.createElement("DIV");
  newbutton.style.marginTop = "11px";
  newbutton.style.borderRadius = "2px";
  newbutton.style.border = "none";
  newbutton.style.backgroundColor = "white";
  newbutton.style.fontSize = "17px";
  newbutton.style.color = "rgb(86, 86, 86)";
  newbutton.style.height = "40px";
  newbutton.style.paddingLeft = "17px";
  newbutton.style.paddingRight = "17px";
  newbutton.style.display = "flex";
  newbutton.style.alignItems = "center";
  newbutton.style.cursor = "pointer";
  newbutton.innerText = "Minimal";
  newbutton.addEventListener(
    "mouseover",
    function () {
      newbutton.style.color = "#000";
      newbutton.style.backgroundColor = "#DDD";
    },
    false
  );
  newbutton.addEventListener(
    "mouseout",
    function () {
      newbutton.style.color = "rgb(86, 86, 86)";
      newbutton.style.backgroundColor = "white";
    },
    false
  );
  return newbutton;
};
