const express = require("express");
const multer = require("multer");
const { google } = require("googleapis");
const dotenv = require("dotenv");
const cors = require("cors");
const fs = require("fs");
const { Pool } = require("pg");
const Joi = require("joi");
const createDOMPurify = require("isomorphic-dompurify");
const { JSDOM } = require("jsdom");
const axios = require("axios");
const {
  monitoringMiddleware,
  getMetrics,
  reqrestime,
  contentType,
  totalReqCounter,
} = require("./monitoring");
const responsetime = require("response-time");
const { logger } = require("./logging");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use(monitoringMiddleware);
app.use(
  responsetime((req, res, time) => {
    totalReqCounter.inc();
    reqrestime
      .labels({
        method: req.method,
        route: req.url,
        status_code: res.statusCode,
      })
      .observe(time);
  })
);

app.get("/metrics", async (req, res) => {
  res.setHeader("content-Type", contentType);
  const metrics = await getMetrics();
  res.send(metrics);
});

const upload = multer({ dest: "uploads/" });
const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);
oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

const drive = google.drive({ version: "v3", auth: oauth2Client });

const FOLDER_ID = process.env.FOLDER_TO_SAVE;

app.post("/check", (req, res) => {
  try {
    let uname = req.body.username.trim();
    let pass = req.body.password.trim();
    if (
      uname === process.env.USERNAME1.trim() &&
      pass === process.env.PASSWORD.trim()
    ) {
      console.log("in");
      return res.status(200).send(true);
    } else {
      return res.status(401).send(false);
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error !");
  }
});

app.get("/health", (req, res) => {
  logger.info("Req came on Health route");
  console.log(process.env.SECRET_KEY,"env working");
  const response = {
    status: "healthy",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
    test: "ok",
  };

  res.status(200).json(response);
});

app.get("/testdeployment", (req, res) => {
  try {
    logger.info("Req came on Test route");

    console.log(process.env.ENV_TEST || "not working!");
    const response = {
      status: "dev ********************** test ok",
      version: "1.0.0",
      environment: process.env.ENV_TEST || "not working!",
    };

    res.status(200).json(response);
  } catch (err) {
    logger.error(err);
    res.status(500);
  }
});

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const fileMetadata = {
      name: req.file.originalname ? req.file.originalname : "",
      parents: [FOLDER_ID],
    };
    console.log(fileMetadata);
    const media = {
      mimeType: req.file.mimetype,
      body: fs.createReadStream(req.file.path),
    };

    const file = await drive.files.create({
      resource: fileMetadata,
      media,
      fields: "id, webViewLink, webContentLink",
    });

    fs.unlinkSync(req.file.path);

    res.json({
      fileId: file.data.id,
      driveLink: file.data.webViewLink,
      directDownloadLink: file.data.webContentLink,
      message: "File uploaded successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/saveEmail", async (req, res) => {
  try {
    const schema = Joi.object({
      email: Joi.string().email().required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: "Invalid input",
        details: error.details[0].message,
      });
    }

    const sanitizedData = Object.keys(value).reduce((acc, key) => {
      acc[key] =
        typeof value[key] === "string"
          ? DOMPurify.sanitize(value[key])
          : value[key];
      return acc;
    }, {});

    const client = await pool.connect();
    try {
      const emailCheckQuery =
        "SELECT id FROM subscribers_list WHERE email = $1";
      const emailCheckResult = await client.query(emailCheckQuery, [
        sanitizedData.email,
      ]);
      if (emailCheckResult.rows.length > 0) {
        const updateQuery = `
          UPDATE subscribers_list 
          SET count = count + 1 
          WHERE email = $1 
          RETURNING id, count
        `;
        const updateResult = await client.query(updateQuery, [
          sanitizedData.email,
        ]);

        return res.status(200).json({
          updated: true,
          message: "Email already exists, incremented count.",
          id: updateResult.rows[0].id,
          count: updateResult.rows[0].count,
        });
      }

      await client.query("BEGIN");

      const query = `
  INSERT INTO subscribers_list (
    email, subscribed_at, count
  ) 
  VALUES ($1, $2, 1) 
  RETURNING id, subscribed_at, count
`;
      const values = [sanitizedData.email, new Date()];

      const result = await client.query(query, values);
      await client.query("COMMIT");

      res.status(201).json({
        created: true,
        message: "Subsribed successfully",
        id: result.rows[0].id,
      });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/savedetails", async (req, res) => {
  try {
    const schema = Joi.object({
      firstName: Joi.string().max(100).required(),
      lastName: Joi.string().max(100).required(),
      email: Joi.string().email().required(),
      phoneNumber: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .required(),
      city: "sample",
      state: "sample",
      linkedin: Joi.string().uri().required(),
      portfolio: Joi.alternatives()
        .try(Joi.string().uri(), Joi.string().allow(""))
        .optional(),
      resume: Joi.string().uri().required(),
      message: Joi.string().max(1000).required(),
      selectedRoles: Joi.array()
        .items(
          Joi.string().valid(
            "User Research",
            "Website Design",
            "Content Writer",
            "Marketing",
            "UX Design",
            "Others"
          )
        )
        .default([]),
    });

    console.log(req.body);

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: "Invalid input",
        details: error.details[0].message,
      });
    }

    const sanitizedData = Object.keys(value).reduce((acc, key) => {
      acc[key] =
        typeof value[key] === "string"
          ? DOMPurify.sanitize(value[key])
          : value[key];
      return acc;
    }, {});
    sanitizedData.selectedRoles = Array.isArray(sanitizedData.selectedRoles)
      ? sanitizedData.selectedRoles
      : [];

    const client = await pool.connect();
    try {
      const emailCheckQuery = "SELECT id FROM resumes WHERE email = $1";
      const emailCheckResult = await client.query(emailCheckQuery, [
        sanitizedData.email,
      ]);

      if (emailCheckResult.rows.length > 0) {
        return res.status(400).json({
          error: "Email already exists",
          message:
            "The provided email is already associated with another application.",
        });
      }

      await client.query("BEGIN");

      const query = `
        INSERT INTO resumes (
          first_name, last_name, email, phone_number, city, state, linkedin, portfolio, resume, message,selectedRoles, created_at
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,$11, $12) 
        RETURNING id, created_at`;

      const values = [
        sanitizedData.firstName,
        sanitizedData.lastName,
        sanitizedData.email,
        sanitizedData.phoneNumber,
        sanitizedData.city || "test",
        sanitizedData.state || "test",
        sanitizedData.linkedin,
        sanitizedData.portfolio || null,
        sanitizedData.resume,
        sanitizedData.message,
        sanitizedData.selectedRoles,
        new Date(),
      ];
      const result = await client.query(query, values);
      await client.query("COMMIT");

      res.status(201).json({
        created: true,
        message: "Application submitted successfully",
        applicationId: result.rows[0].id,
      });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error saving application:", error);
    res.status(500).json({
      error: "Unable to process your application at this time",
    });
  }
});

app.get("/getlist", async (req, res) => {
  const client = await pool.connect();
  const { page = 1, limit = 10 } = req.query;
  try {
    const offset = (page - 1) * limit;
    const query =
      "SELECT * FROM resumes ORDER BY created_at DESC LIMIT $1 OFFSET $2";

    const { rows } = await client.query(query, [limit, offset]);

    res.json({
      success: true,
      count: rows.length,
      page: parseInt(page),
      limit: parseInt(limit),
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching resumes:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  } finally {
    client.release();
  }
});

app.put("/updateReviewed", async (req, res) => {
  try {
    const updates = req.body.updates;
    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      for (const { id, reviewed } of updates) {
        await client.query("UPDATE resumes SET reviewed = $1 WHERE id = $2", [
          reviewed,
          id,
        ]);
      }

      await client.query("COMMIT");
      res
        .status(200)
        .json({ success: true, message: "Review status updated successfully" });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error updating review status:", error);
    res.status(500).json({ error: "Unable to update review status" });
  }
});

app.listen(process.env.SERVER_PORT, () =>
  console.log(`Server running on port ${process.env.SERVER_PORT}`)
);

// app.post('/verify-recaptcha', async (req, res) => {
//   const { recaptchaToken } = req.body;
//   if (!recaptchaToken) {
//       return res.status(400).json({ error: "reCAPTCHA token missing" });
//   }

//   try {
//       const secretKey = process.env.SECRET_KEY;
//       const response = await axios.post(
//           `https://www.google.com/recaptcha/api/siteverify`,
//           null,
//           {
//               params: {
//                   secret: secretKey,
//                   response: recaptchaToken,
//               },
//           }
//       );

//       const data = response.data;

//       if (data.success && data.score >= 0.5) {
//           return res.json({ success: true, message: "Valid reCAPTCHA", score: data.score });
//       } else {
//           return res.status(400).json({ success: false, message: "Failed reCAPTCHA", score: data.score });
//       }
//   } catch (error) {
//       console.error("reCAPTCHA verification failed:", error);
//       return res.status(500).json({ error: "Internal Server Error" });
//   }
// });

app.post("/verify-recaptcha", async (req, res) => {
  console.log(process.env.SECRET_KEY);
  const { recaptchaToken } = req.body;
  console.log(recaptchaToken, "-------------------------");
  const secretKey = process.env.SECRET_KEY;
  console.log(secretKey, "--------------");
  const response = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`,
    {
      method: "POST",
    }
  );
  const data = await response.json();
  if (data.success) {
    res.json({ success: true, message: "Valid reCAPTCHA" });
  } else {
    res.status(400).json({ success: false, message: "reCAPTCHA failed" });
  }
});
