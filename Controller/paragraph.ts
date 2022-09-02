export class ParagraphController {
  static stripHtml(htmlText: string):string {
    const elem = document.createElement("div");
    elem.innerHTML = htmlText;
    return (elem.textContent || elem.innerText || "").trim();
  }
}
