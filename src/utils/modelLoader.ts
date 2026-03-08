import fs from "node:fs";
import path from "node:path";
import sequelize from "../config/database";

export async function loadModels() {
  const modulesPath = path.join(__dirname, "../modules");
  const modules = fs.readdirSync(modulesPath);

  for (const mod of modules) {
    const modPath = path.join(modulesPath, mod);
    if (fs.statSync(modPath).isDirectory()) {
      const files = fs
        .readdirSync(modPath)
        .filter(
          (file) => file.endsWith(".model.ts") || file.endsWith(".model.js")
        );
      for (const file of files) {
        const filePath = path.join(modPath, file);
        const fileUrl =
          process.platform === "win32"
            ? "file:///" + filePath.replace(/\\/g, "/")
            : filePath;
        await import(fileUrl);
      }
    }
  }

  // Initialize associations dynamically
  Object.values(sequelize.models).forEach((model: any) => {
    if (typeof model.associate === "function") {
      model.associate(sequelize.models);
    }
  });
}
