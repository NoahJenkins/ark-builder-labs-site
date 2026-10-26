import { appendFileSync, readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const PATCH = "version-update:semver-patch";
const MINOR = "version-update:semver-minor";
const MAJOR = "version-update:semver-major";
const SECURITY_PHRASE = /This update includes (?:a )?security fix(?:es)?/i;
const SECURITY_GROUP = /(?:^|[-_])security(?:$|[-_])/i;

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

function isGitHubActions(ecosystem) {
  return ecosystem === "github_actions" || ecosystem === "github-actions";
}

function isSecurityGroup(group) {
  return SECURITY_GROUP.test(group);
}

function bodyMarksSecurity(body, dependencyName, single) {
  if (!body || !SECURITY_PHRASE.test(body)) {
    return false;
  }
  if (single) {
    return SECURITY_PHRASE.test(body.slice(0, 800));
  }
  if (!dependencyName) {
    return false;
  }
  const needle = `Updates \`${dependencyName}\``;
  let from = 0;
  while (from < body.length) {
    const start = body.indexOf(needle, from);
    if (start < 0) {
      return false;
    }
    const window = body.slice(start, start + needle.length + 160);
    if (SECURITY_PHRASE.test(window)) {
      return true;
    }
    from = start + needle.length;
  }
  return false;
}

function isSecurityUpdate(dependency, context, single) {
  if (text(dependency.ghsaId)) {
    return true;
  }
  if (text(dependency.alertState)) {
    return true;
  }
  if (isSecurityGroup(text(dependency.dependencyGroup))) {
    return true;
  }
  return bodyMarksSecurity(context.pullRequestBody, text(dependency.dependencyName), single);
}

function normalizeDependencies(dependencies, scalars) {
  return dependencies.map((dependency, index) => {
    const next = { ...dependency };
    if (!text(next.packageEcosystem)) {
      next.packageEcosystem = text(scalars.packageEcosystem);
    }
    if (!text(next.dependencyGroup)) {
      next.dependencyGroup = text(scalars.dependencyGroup);
    }
    if (!text(next.updateType) && dependencies.length === 1) {
      next.updateType = text(scalars.updateType);
    }
    if (index === 0) {
      if (!text(next.ghsaId)) {
        next.ghsaId = text(scalars.ghsaId);
      }
      if (!text(next.alertState)) {
        next.alertState = text(scalars.alertState);
      }
    }
    return next;
  });
}

export function decide(input) {
  const raw = Array.isArray(input.dependencies) ? input.dependencies : [];
  if (raw.length === 0) {
    return {
      action: "skip",
      reason: "Dependabot metadata did not list any updates",
    };
  }

  const dependencies = normalizeDependencies(raw, input);
  const single = dependencies.length === 1;
  const majors = [];
  const unclassified = [];

  for (const dependency of dependencies) {
    const ecosystem = text(dependency.packageEcosystem);
    const updateType = text(dependency.updateType);
    const name = text(dependency.dependencyName) || "unknown";
    if (isGitHubActions(ecosystem) || isSecurityUpdate(dependency, input, single)) {
      continue;
    }
    if (updateType === PATCH || updateType === MINOR) {
      continue;
    }
    if (updateType === MAJOR) {
      majors.push(name);
      continue;
    }
    unclassified.push(`${name} (${updateType || "unknown update type"})`);
  }

  if (majors.length > 0) {
    return {
      action: "review",
      reason: `semver-major left for review: ${majors.join(", ")}`,
    };
  }
  if (unclassified.length > 0) {
    return {
      action: "skip",
      reason: `unclassified update left open: ${unclassified.join(", ")}`,
    };
  }
  return {
    action: "merge",
    reason: "patch, minor, GitHub Actions, or security update",
  };
}

function pullRequestBody() {
  if (process.env.DEPENDABOT_PR_BODY) {
    return process.env.DEPENDABOT_PR_BODY;
  }
  if (!process.env.GITHUB_EVENT_PATH) {
    return "";
  }
  const event = JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, "utf8"));
  return event.pull_request?.body ?? "";
}

function readDependencies() {
  const raw = process.env.DEPENDABOT_UPDATED_JSON ?? "";
  if (!raw.trim()) {
    return [];
  }
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed : [];
}

function runCli() {
  const result = decide({
    dependencies: readDependencies(),
    packageEcosystem: process.env.DEPENDABOT_ECOSYSTEM ?? "",
    dependencyGroup: process.env.DEPENDABOT_GROUP ?? "",
    updateType: process.env.DEPENDABOT_UPDATE_TYPE ?? "",
    alertState: process.env.DEPENDABOT_ALERT_STATE ?? "",
    ghsaId: process.env.DEPENDABOT_GHSA_ID ?? "",
    pullRequestBody: pullRequestBody(),
  });
  const output = `action=${result.action}\nreason=${result.reason.replaceAll("\n", " ")}\n`;
  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(process.env.GITHUB_OUTPUT, output);
  }
  process.stdout.write(`${result.reason}\n`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  runCli();
}
