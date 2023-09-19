const express = require("express");
const router = express.Router();

import { createSignature } from "@uploadcare/rest-client";

router.get("/sign-request", async (req, res) => {
  const signature = await createSignature(
    process.env.UC_SECRET,
    req.query.signString
  );
  res.send(signature);
});

module.exports = router;
