import { resolve } from "node:path";
import { config } from "dotenv";
import { projectRoot } from "./paths";

config({ path: resolve(projectRoot, ".env") });
