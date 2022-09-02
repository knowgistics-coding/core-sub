# Alert

```tsx

const { addAlert } = useAlerts();

...
addAlert({ label:'Some Text', severity: 'success' })
```

| Name | Type | Default | Description |
| -- | -- | -- | -- |
| label | string | | text to show in alert |
| severity | "success" \| "warning" \| "info" \| "error" | "success" | The severity of the alert. This defines the color and icon used |

## inheritance
[Alert](https://mui.com/material-ui/api/alert/)