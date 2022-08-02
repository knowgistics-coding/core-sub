export const toolbar = (inDropdown: boolean = false) => ({
  options: ['inline', 'textAlign', 'history'],
  inline: {
    inDropdown,
    options: ['bold', 'italic', 'underline', 'strikethrough']
  },
  history: {
    inDropdown: false,
    options: ['undo', 'redo']
  },
  textAlign: {
    inDropdown,
    options: ['left', 'center', 'right']
  }
})
