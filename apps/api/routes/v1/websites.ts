import { Router } from "express";
import { prismaClient } from "store/client";
import { auth } from "../../middlewares/user";

const websitesRouter = Router();

websitesRouter.get("/", auth, async (req, res) => {
  try {
    const userId = req.userId as string;

    const websites = await prismaClient.website.findMany({
      where: { user_id: userId },
    });

    res.status(200).json({
      message: "Websites fetched successfully",
      data: websites,
    });
  } catch (error) {
    console.error("Get websites error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

websitesRouter.post("/", auth, async (req, res) => {
  try {
    const userId = req.userId as string;
    const { name, url } = req.body;

    if (!name || !url) {
      res.status(400).json({ message: "Name and URL are required" });
      return;
    }

    const website = await prismaClient.website.create({
      data: { 
        name, 
        url: url.trim(),
        user_id: userId
      },
    });

    res.status(201).json({
      message: "Website created successfully",
      data: website,
    });
  } catch (error: any) {
    console.error("Create website error:", error);
    
    // Handle unique constraint violation (URL already exists)
    if (error.code === 'P2002' && error.meta?.target?.includes('url')) {
      res.status(409).json({ 
        message: "Website already added, try another URL" 
      });
      return;
    }
    
    res.status(500).json({ message: "Internal server error" });
  }
});

websitesRouter.patch("/:id", auth, async (req, res) => {
  try {
    const userId = req.userId as string;
    const { id } = req.params;
    const { name, url } = req.body;

    if (!name && !url) {
      res.status(400).json({ message: "At least one field (name or url) is required" });
      return;
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (url) updateData.url = url.trim();

    const website = await prismaClient.website.update({
      where: { 
        id,
        user_id: userId // Ensure user can only update their own websites
      },
      data: updateData,
    });

    res.status(200).json({
      message: "Website updated successfully",
      data: website,
    });
  } catch (error: any) {
    console.error("Update website error:", error);
    if (error.code === 'P2025') {
      res.status(404).json({ message: "Website not found" });
      return;
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

websitesRouter.delete("/:id", auth, async (req, res) => {
  try {
    const userId = req.userId as string;
    const { id } = req.params;

    await prismaClient.website.delete({
      where: { 
        id,
        user_id: userId // Ensure user can only delete their own websites
      },
    });

    res.status(200).json({
      message: "Website deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete website error:", error);
    if (error.code === 'P2025') {
      res.status(404).json({ message: "Website not found" });
      return;
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

websitesRouter.get("/status/:websiteId", auth, async (req, res) => {
  try {
    const userId = req.userId as string;
    const { websiteId } = req.params;

    const website = await prismaClient.website.findUnique({
      where: { 
        id: websiteId,
        user_id: userId // Ensure user can only view their own websites
      },
    });

    if (!website) {
      res.status(404).json({ message: "Website not found" });
      return;
    }

    res.status(200).json({
      message: "Website status fetched successfully",
      data: website,
    });
  } catch (error) {
    console.error("Get website status error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

websitesRouter.get("/:websiteId/logs", auth, async (req, res) => {
  try {
    const userId = req.userId as string;
    const { websiteId } = req.params;
    const after = req.query.after || new Date(Date.now() - 60 * 60 * 1000); // default: last 1 hour

    // First verify the website belongs to the user
    const website = await prismaClient.website.findUnique({
      where: { 
        id: websiteId,
        user_id: userId // Ensure user can only view their own websites
      },
    });

    if (!website) {
      res.status(404).json({ message: "Website not found" });
      return;
    }

    // Fetch 5-minute aggregated logs using raw SQL for efficiency
    const logs = await prismaClient.$queryRawUnsafe(`
      SELECT 
        date_trunc('minute', "createdAt") - (EXTRACT(minute from "createdAt")::int % 5) * interval '1 minute' AS interval_start,
        AVG("response_time_ms") AS avg_response_time_ms,
        COUNT(*) AS ping_count,
        BOOL_OR("status" = 'UP') AS is_up
      FROM "WebsiteTick"
      WHERE "website_id" = $1 AND "createdAt" > $2
      GROUP BY interval_start
      ORDER BY interval_start DESC
      LIMIT 12;
    `, websiteId, after);

    res.status(200).json({
      message: "Website logs fetched successfully",
      data: logs,
    });
  } catch (error) {
    console.error("Get website logs error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default websitesRouter;