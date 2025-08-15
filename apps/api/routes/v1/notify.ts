  import { Router } from "express";
import { nextAuthSessionAuth } from "../../middlewares/nextauth";
import prismaClient from "store/client";
import { sendMail } from "../../utils/notifier";
import { generateDowntimeAlertHTML } from "../../utils/email-templates";
import type { DowntimeAlertData } from "../../utils/email-templates";

const notifyRouter = Router();

notifyRouter.post("/sms",nextAuthSessionAuth, async (req, res) => {
  try {
    const { message, number } = req.body;
    console.log(message, number);
    res.status(200).json({ message: "Message received" });
  } catch (error) {
    console.error("SMS notification error:", error);
    res.status(500).json({ message: "Failed to send SMS" });
  }
});

notifyRouter.post("/email", async (req, res) => {
  try { 
    // const user = req.user;
    const { 
      error, 
      currentStatus, 
      statusCode, 
      statusText, 
      region, 
      website, 
      detectedAt, 
      affectedTicks,
      serviceName,
      checkName,
      targetUrl,
      environment,
      outageDuration,
      outageSeconds,
      incidentId,
      uptime24h,
      uptime30d,
      notes
    } = {
      error: "Connection timeout after 30 seconds",
      currentStatus: "DOWN",
      statusCode: 503,
      statusText: "Connection timeout",
      region: "US-East",
      website: "https://mywebsite.com",
      detectedAt: new Date().toISOString(),
      affectedTicks: "Homepage, API Health Check",
      serviceName: "My Website",
      checkName: "Homepage Health Check",
      targetUrl: "https://mywebsite.com",
      environment: "Production",
      outageDuration: "5 minutes",
      outageSeconds: 300,
      incidentId: "INC-123456",
      uptime24h: "99.2%",
      uptime30d: "99.8%",
      notes: "Our monitoring detected connectivity issues with the primary server. The team is investigating the root cause and will provide updates shortly."
    }

    // const alertMail = await prismaClient.user.findUnique({
    //   where: {
    //     id: user.id
    //   }
    // });

    // Prepare data for the email template
    const emailData: Partial<DowntimeAlertData> = {
      service_name: serviceName || website || "Unknown Service",
      detected_at: detectedAt || new Date().toISOString(),
      timezone: "UTC",
      incident_id: incidentId || Math.random().toString(36).substr(2, 9),
      check_name: checkName || "Health Check",
      target_url: targetUrl || website || "Unknown URL",
      region: region || "Global",
      environment: environment || "Production",
      outage_duration_human: outageDuration || "Unknown",
      outage_duration_seconds: outageSeconds || 0,
      current_status: currentStatus || "DOWN",
      status_code: statusCode || 500,
      error_summary: error || statusText || "Service is not responding",
      affected_checks: affectedTicks || "Primary health check",
      uptime_24h: uptime24h || "Unknown",
      uptime_30d: uptime30d || "Unknown",
      notes_or_preliminary_rca: notes || "We are investigating this issue and will provide updates as they become available.",
      org_name: "Avadhi v0.1",
      org_address: "avadhi.pro"
    };

    const subject = `${emailData.service_name} - Downtime Alert`;
    const html = generateDowntimeAlertHTML(emailData);
    const text = `Downtime Alert: ${emailData.service_name} is DOWN. Status: ${emailData.current_status} (${emailData.status_code}). Error: ${emailData.error_summary}. Detected at: ${emailData.detected_at}`;

    // Send email if user email exists
    // if (alertMail?.email) {
    //   await sendMail(alertMail.email, subject, text, html);
    // }

    await sendMail('work.ankit189@gmail.com', subject, text, html);
    
    // Return the HTML template as text for testing/preview
    res.status(200).json({ 
      message: "Mail sent successfully",
    });
  } catch (error) {
    console.error("Email notification error:", error);
    res.status(500).json({ message: "Failed to send email" });
  }
});

// Test endpoint to preview the email template without authentication
notifyRouter.get("/email/preview", async (req, res) => {
  try {
    // Sample data for testing
    const sampleData: Partial<DowntimeAlertData> = {
      service_name: "My Website",
      detected_at: new Date().toISOString(),
      timezone: "UTC",
      incident_id: "INC-123456",
      check_name: "Homepage Health Check",
      target_url: "https://mywebsite.com",
      region: "US-East",
      environment: "Production",
      outage_duration_human: "5 minutes",
      outage_duration_seconds: 300,
      current_status: "DOWN",
      status_code: 503,
      error_summary: "Connection timeout after 30 seconds",
      affected_checks: "Homepage, API Health Check",
      uptime_24h: "99.2%",
      uptime_30d: "99.8%",
      notes_or_preliminary_rca: "Our monitoring detected connectivity issues with the primary server. The team is investigating the root cause and will provide updates shortly.",
      org_name: "Avadhi Monitoring",
      org_address: "monitoring@avadhi.com"
    };

    const html = generateDowntimeAlertHTML(sampleData);
    
    // Return as HTML content type for browser preview
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    console.error("Email preview error:", error);
    res.status(500).json({ message: "Failed to generate email preview" });
  }
});

export default notifyRouter;