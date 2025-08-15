export interface DowntimeAlertData {
  service_name: string;
  detected_at: string;
  timezone: string;
  incident_id: string;
  check_name: string;
  target_url: string;
  region: string;
  environment: string;
  outage_duration_human: string;
  outage_duration_seconds: number;
  current_status: string;
  status_code: number;
  error_summary: string;
  incident_url: string;
  affected_checks: string;
  uptime_24h: string;
  uptime_30d: string;
  notes_or_preliminary_rca: string;
  org_name: string;
  org_address: string;
}

export function generateDowntimeAlertHTML(data: Partial<DowntimeAlertData>): string {
  // Default values for missing data
  const defaults: DowntimeAlertData = {
    service_name: data.service_name || "Service",
    detected_at: data.detected_at || new Date().toISOString(),
    timezone: data.timezone || "UTC",
    incident_id: data.incident_id || Math.random().toString(36).substr(2, 9),
    check_name: data.check_name || "Health Check",
    target_url: data.target_url || "https://example.com",
    region: data.region || "Global",
    environment: data.environment || "Production",
    outage_duration_human: data.outage_duration_human || "Unknown",
    outage_duration_seconds: data.outage_duration_seconds || 0,
    current_status: data.current_status || "DOWN",
    status_code: data.status_code || 500,
    error_summary: data.error_summary || "Service is not responding",
    incident_url: data.incident_url || "#",
    affected_checks: data.affected_checks || "Primary health check",
    uptime_24h: data.uptime_24h || "Unknown",
    uptime_30d: data.uptime_30d || "Unknown",
    notes_or_preliminary_rca: data.notes_or_preliminary_rca || "We are investigating this issue and will provide updates as they become available.",
    org_name: data.org_name || "Avadhi v0.1",
    org_address: data.org_address || "avadhi.pro"
  };

  const template = `<!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${defaults.service_name} is DOWN</title>
  <!-- Preheader (hidden in most clients) -->
  <style>
    .preheader { display:none!important; visibility:hidden; opacity:0; color:transparent; height:0; width:0; overflow:hidden; mso-hide:all; }
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; }
      .px { padding-left: 16px !important; padding-right: 16px !important; }
      .stack { display: block !important; width: 100% !important; }
      .hide-sm { display: none !important; }
    }
    /* Some dark-mode friendly defaults (supported by Apple Mail, iOS Mail, some Outlooks) */
    @media (prefers-color-scheme: dark) {
      body, .email-body { background: #0b0f14 !important; }
      .card { background: #111827 !important; color: #e5e7eb !important; }
      .muted { color: #9ca3af !important; }
      .divider { border-color: #1f2937 !important; }
    }
  </style>
</head>
<body style="margin:0; padding:0; background:#f5f7fb;">
  <div class="preheader">
    ${defaults.service_name} is currently DOWN. Detected at ${defaults.detected_at} (${defaults.timezone}). Incident #${defaults.incident_id}.
  </div>

  <!-- Wrapper -->
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f5f7fb;">
    <tr>
      <td align="center" style="padding:24px;">
        <!-- Container -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" class="container" style="width:600px; max-width:600px;">
          <!-- Header -->
          <tr>
            <td class="px" style="padding:24px 32px; background:#0f172a; color:#fff; border-radius:12px 12px 0 0; font-family:Segoe UI, Roboto, Helvetica, Arial, sans-serif;">
              <table role="presentation" width="100%">
                <tr>
                  <td align="left" style="font-size:20px; font-weight:700;">
                    ${defaults.service_name} — Downtime Alert
                  </td>
                  <td align="right" class="hide-sm" style="font-size:12px; color:#cbd5e1;">
                    Incident #${defaults.incident_id}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Status Banner -->
          <tr>
            <td style="height:6px; background:#ef4444; line-height:6px;">&nbsp;</td>
          </tr>

          <!-- Body Card -->
          <tr>
            <td class="px card email-body" style="padding:24px 32px; background:#ffffff; border:1px solid #e5e7eb; border-top:none; border-radius:0 0 12px 12px; font-family:Segoe UI, Roboto, Helvetica, Arial, sans-serif; color:#111827;">
              <h1 style="margin:0 0 8px; font-size:20px; line-height:1.4;">We detected an outage</h1>
              <p class="muted" style="margin:0 0 16px; color:#6b7280; font-size:14px; line-height:1.6;">
                Our monitors reported that <strong>${defaults.service_name}</strong> is <strong>DOWN</strong> for the check <strong>${defaults.check_name}</strong>.
              </p>

              <!-- Key Facts -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 16px;">
                <tr>
                  <td class="stack" style="padding:12px 0; border-top:1px solid #e5e7eb;">
                    <strong>URL / Target:</strong> <a href="${defaults.target_url}" style="color:#2563eb; text-decoration:none;">${defaults.target_url}</a>
                  </td>
                </tr>
                <tr>
                  <td class="stack" style="padding:12px 0; border-top:1px solid #e5e7eb;">
                    <strong>Region:</strong> ${defaults.region} &nbsp;&nbsp;|&nbsp;&nbsp; <strong>Environment:</strong> ${defaults.environment}
                  </td>
                </tr>
                <tr>
                  <td class="stack" style="padding:12px 0; border-top:1px solid #e5e7eb;">
                    <strong>Detected at:</strong> ${defaults.detected_at} (${defaults.timezone})
                  </td>
                </tr>
                <tr>
                  <td class="stack" style="padding:12px 0; border-top:1px solid #e5e7eb;">
                    <strong>Current duration:</strong> ${defaults.outage_duration_human} (${defaults.outage_duration_seconds}s)
                  </td>
                </tr>
                <tr>
                  <td class="stack" style="padding:12px 0; border-top:1px solid #e5e7eb;">
                    <strong>Status / Code:</strong> ${defaults.current_status} / ${defaults.status_code}
                  </td>
                </tr>
                <tr>
                  <td class="stack" style="padding:12px 0; border-top:1px solid #e5e7eb;">
                    <strong>Error:</strong> ${defaults.error_summary}
                  </td>
                </tr>
              </table>

              <!-- CTA (bulletproof) -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="left" style="margin:8px 0 16px;">
                <tr>
                  <td align="center" bgcolor="#2563eb" style="border-radius:8px;">
                    <!--[if mso]>
                    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="${defaults.incident_url}" style="height:44px;v-text-anchor:middle;width:220px;" arcsize="12%" strokecolor="#2563eb" fillcolor="#2563eb">
                      <w:anchorlock/>
                      <center style="color:#ffffff;font-family:Segoe UI, Roboto, Helvetica, Arial, sans-serif;font-size:14px;font-weight:700;">View Incident</center>
                    </v:roundrect>
                    <![endif]-->
                    <![if !mso]><a href="${defaults.incident_url}" style="display:inline-block; padding:12px 20px; color:#ffffff; background:#2563eb; border:1px solid #2563eb; border-radius:8px; font-size:14px; font-weight:700; text-decoration:none; font-family:Segoe UI, Roboto, Helvetica, Arial, sans-serif;">View Incident</a><![endif]>
                    <br/>
                  </td>
                  <br/>
                </tr>
                <br/>
              </table>
              <br/>

              <!-- Extra details -->
              <p style="margin:0 0 12px; font-size:14px; line-height:1.6;">
                <strong>Affected checks:</strong> ${defaults.affected_checks}
              </p>
              <p style="margin:0 0 16px; font-size:14px; line-height:1.6;">
                <strong>Last 24h uptime:</strong> ${defaults.uptime_24h} &nbsp;&nbsp;|&nbsp;&nbsp; <strong>30d uptime:</strong> ${defaults.uptime_30d}
              </p>

              <!-- Notes / Root cause placeholder -->
              <div style="margin:16px 0; padding:12px; background:#f9fafb; border:1px solid #e5e7eb; border-radius:8px;">
                <div style="font-size:13px; color:#6b7280; margin-bottom:6px; text-transform:uppercase; letter-spacing:.02em;">Notes</div>
                <div style="font-size:14px; color:#111827; line-height:1.6;">
                  ${defaults.notes_or_preliminary_rca}
                </div>
              </div>

              <!-- Footer -->
              <hr class="divider" style="border:none; border-top:1px solid #e5e7eb; margin:16px 0;">
              <table role="presentation" width="100%">
                <tr>
                  <td class="stack" style="font-size:12px; color:#6b7280; line-height:1.6;">
                    You're receiving this because you're subscribed to <strong>${defaults.service_name}</strong> incident alerts.
                    <br>
                    <a href="https://avadhi.pro" style="color:#2563eb; text-decoration:none;">Avadhi</a>
                  </td>
                  <td class="stack" align="right" style="font-size:12px; color:#6b7280;">
                    ${defaults.org_name} · ${defaults.org_address}
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Tiny legal padding for Outlook -->
          <tr><td style="line-height:24px; font-size:0;">&nbsp;</td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return template;
}
