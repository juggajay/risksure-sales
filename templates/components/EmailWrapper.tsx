import { UnsubscribeFooter } from "./UnsubscribeFooter";

interface EmailWrapperProps {
  content: string;
  unsubscribeUrl: string;
}

export function wrapEmail({ content, unsubscribeUrl }: EmailWrapperProps): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 15px; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  ${content}
  ${UnsubscribeFooter({ unsubscribeUrl })}
</body>
</html>
  `.trim();
}
