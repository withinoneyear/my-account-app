import express, { Request, Response } from "express";
import { authenticateToken, AuthRequest } from "../middleware/auth";
import { attempt, create } from "../services/sensitiveSession";

const router = express.Router();

router.get("/", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const session = create(req.userId!)
    res.json({ code: session.code });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error creating session:", error);
    res.status(500).json({ error });
  }
});

router.post("/", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const valid = attempt(req.userId!, req.body.code)

    if (!valid) {
      return res.status(403).json({ error: "Not allowed!" });
    }
    
    res.status(200);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error verifying code:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


export default router;