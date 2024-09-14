import { Request, Response, NextFunction } from "express";
const asyncHandler = require("express-async-handler");
const db = require("../db/queries");
import { createClient } from "@supabase/supabase-js";
require("dotenv").config();
const supabaseUrl = "https://irlgvfewavoepdzhcgwq.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey!);
import { decode } from "base64-arraybuffer";
import https = require("https");

// Post request for new folder
exports.createFolder = asyncHandler(async (req: Request, res: Response) => {
  if (req.user === undefined) {
    res.render("login");
  } else {
    await db.createFolder(req.body.folder_name, req.user.id);
    res.redirect("/");
  }
});

// Get request for folder view
exports.viewFolder = asyncHandler(async (req: Request, res: Response) => {
  if (req.user === undefined) {
    res.render("login");
  } else {
    const folder = await db.findFolder(parseInt(req.params.id));
    let files = await db.getFiles(parseInt(req.params.id));

    // Compute filename from url for each file
    files.forEach((file: any) => {
      const split = file.url.split("/");
      file.filename = split[split.length - 1];
    });

    if (folder.userId !== parseInt(req.user.id)) {
      res.render("error", { user: req.user });
    } else {
      res.render("folder", { user: req.user, folder: folder, files: files });
    }
  }
});

// Get request for rename folder form
exports.folder_update_get = asyncHandler(
  async (req: Request, res: Response) => {
    if (req.user === undefined) {
      res.render("login");
    } else {
      const folder = await db.findFolder(parseInt(req.params.id));
      res.render("rename_folder", { user: req.user, folder: folder });
    }
  }
);

// Post request for folder update
exports.folder_update_post = asyncHandler(
  async (req: Request, res: Response) => {
    if (req.user === undefined) {
      res.render("login");
    } else {
      // Update folder and redirect.
      await db.updateFolder(parseInt(req.params.id), req.body.folder_name);
      res.redirect("/");
    }
  }
);

// Get request for folder deletion.
exports.folder_delete_get = asyncHandler(
  async (req: Request, res: Response) => {
    if (req.user === undefined) {
      res.render("login");
    } else {
      const folder = await db.findFolder(parseInt(req.params.id));
      res.render("delete_folder", { user: req.user, folder: folder });
    }
  }
);

// Post request for folder deletion.
exports.folder_delete_post = asyncHandler(
  async (req: Request, res: Response) => {
    if (req.user === undefined) {
      res.render("login");
    } else {
      await db.deleteFolder(parseInt(req.params.id));
      res.redirect("/");
    }
  }
);

exports.folder_upload = asyncHandler(async (req: Request, res: Response) => {
  if (req.user === undefined) {
    res.redirect("/login");
  } else {
    // Upload to supabase using multer's buffer
    const { data, error } = await supabase.storage
      .from("user_files")
      .upload(
        `${req.params.id}/${req.file?.originalname}`,
        decode(req.file?.buffer?.toString("base64")!),
        {
          // contentType: "image/png",
        }
      );
    // Retrieve file url
    const file = await supabase.storage
      .from("user_files")
      .getPublicUrl(`${req.params.id}/${req.file?.originalname}`);
    const url = file.data.publicUrl;

    try {
      await db.addFile(url, parseInt(req.params.id), req.file?.size);
    } catch (error) {
      console.log("No need to update database, file link already exists");
    }

    res.redirect(`/folder/${req.params.id}`);
  }
});

// Get request to see file details
exports.file_get = asyncHandler(async (req: Request, res: Response) => {
  if (req.user === undefined) {
    res.redirect("/login");
  } else {
    // Get the file
    const folder = await db.findFolder(parseInt(req.params.folder_id));
    // Redirect to error page if user doesn't own folder
    if (folder.userId !== parseInt(req.user.id)) {
      res.render("error", { user: req.user });
    } else {
      const file = await db.findFile(parseInt(req.params.file_id));
      const split = file.url.split("/");
      file.filename = split[split.length - 1];
      res.render("file", {
        file: file,
        user: req.user,
      });
    }
  }
});

// Download file
exports.download = asyncHandler(async (req: Request, res: Response) => {
  if (req.user === undefined) {
    res.redirect("/login");
  } else {
    // Get the file
    const folder = await db.findFolder(parseInt(req.params.folder_id));
    // Redirect to error page if user doesn't own folder
    if (folder.userId !== parseInt(req.user.id)) {
      res.render("error", { user: req.user });
    } else {
      // Prompt file download
      const dbfile = await db.findFile(parseInt(req.params.file_id));
      https.get(dbfile.url, function (file) {
        const split = dbfile.url.split("/");
        dbfile.filename = split[split.length - 1];
        res.set(
          "Content-disposition",
          "attachment; filename=" + dbfile.filename
        );
        file.pipe(res);
      });
    }
  }
});
