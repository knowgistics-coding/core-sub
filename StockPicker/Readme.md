# StockPicker

```tsx
import React, { useState } from 'react';
import { StockPicker, StockImageTypes } from '@kgui/core';


export Example = () => {
  const [open,setOpen] = useState<boolean>(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const handleConfirm = (images: (StockImageTypes | undefined)[]) => {
    console.log({ images })
  }
  
  return (
    <StockPicker
      open={open}
      onClose={handleClose}
      onConfirm={handleConfirm}
    />
  )
}
```

## Multiple
```jsx
...
<StockPicker
  multiple
  open={open}
  onClose={handleClose}
  onConfirm={handleConfirm}
/>
...
```