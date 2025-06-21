import { Router } from "express";

const websitesRouter = Router();
import { prismaClient } from "store/client";

websitesRouter.get("/", async (req, res) => {
  const websites = await prismaClient.website.findMany();

  res.status(200).json({
    message: "Websites fetched successfully",
    data: websites,
  });
});

websitesRouter.post("/", async (req, res) => {

  const website = await prismaClient.website.create({
    data: { name:req.body.name, url: req.body.url.trim() },
  });

  res.status(201).json({
    message: "Website created successfully",
    data: website,
  });
});

websitesRouter.get("/status/:websiteId", async (req, res) => {
  const { websiteId } = req.params;

  const website = await prismaClient.website.findUnique({
    where: { id: websiteId },
  });
});

export default websitesRouter;