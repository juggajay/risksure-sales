interface UnsubscribeFooterProps {
  unsubscribeUrl: string;
}

export function UnsubscribeFooter({ unsubscribeUrl }: UnsubscribeFooterProps) {
  return `
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; line-height: 18px;">
      <p style="margin: 0;">
        RiskSure.AI | Sydney, Australia
      </p>
      <p style="margin-top: 10px;">
        You're receiving this because you may benefit from compliance automation.<br />
        <a href="${unsubscribeUrl}" style="color: #666; text-decoration: underline;">
          Unsubscribe from future emails
        </a>
      </p>
    </div>
  `;
}
