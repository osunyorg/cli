import { getAll } from "./sites/getAll";
import { run } from "./sites/run";
import { compare } from "./sites/compare";
import { update } from "./sites/update";
import { code } from "./sites/code";
import { gitStatus } from "./sites/gitStatus";

export const sitesManager = {
  getAll,
  run,
  compare,
  update,
  code,
  gitStatus
};
