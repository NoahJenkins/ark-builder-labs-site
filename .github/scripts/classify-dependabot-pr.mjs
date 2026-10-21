import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const allowedPnpmFiles = new Set([
  "package.json",
  "pnpm-lock.yaml",
  "pnpm-workspace.yaml",
  "apps/app/package.json",
  "packages/contracts/package.json",
]);

const githubActionsFilePattern = /^\.github\/workflows\/[^/]+\.ya?ml$/;

const versionTransitionPattern =
  /(?:Bumps|Updates)\s+(?:\[([^\]]+)\]\([^)]+\)|`([^`]+)`|(\S+))\s+from\s+`?v?(\d+(?:\.\d+){0,2}(?:-[0-9A-Za-z.-]+)?)`?\s+to\s+`?v?(\d+(?:\.\d+){0,2}(?:-[0-9A-Za-z.-]+)?)`?/gi;

const metadataUpdateTypePattern =
  /^\s*update-type:\s*version-update:semver-(major|minor|patch)\s*$/gim;

function parseVersion(version) {
  const [core, prerelease] = version.split("-", 2);
  const parts = core.split(".").map(Number);
  while (parts.length < 3) {
    parts.push(0);
  }
  if (parts.length !== 3 || parts.some(Number.isNaN)) {
    return undefined;
  }
  return { parts, prerelease };
}

function updateKind(from, to) {
  const previousVersion = parseVersion(from);
  const nextVersion = parseVersion(to);
  if (!previousVersion || !nextVersion) {
    return "unproven";
  }
  const previous = previousVersion.parts;
  const next = nextVersion.parts;

  if (
    next[0] < previous[0] ||
    (next[0] === previous[0] && next[1] < previous[1]) ||
    (next[0] === previous[0] &&
      next[1] === previous[1] &&
      next[2] < previous[2])
  ) {
    return "unproven";
  }
  if (next[0] > previous[0]) {
    return "major";
  }
  if (next[1] > previous[1]) {
    return "minor";
  }
  if (next[2] > previous[2]) {
    return "patch";
  }
  if (previousVersion.prerelease !== nextVersion.prerelease) {
    return "unproven";
  }
  return "unproven";
}

function versionTransitions(body) {
  return [...body.matchAll(versionTransitionPattern)].map((match) => ({
    from: match[4],
    kind: updateKind(match[4], match[5]),
    name: match[1] ?? match[2] ?? match[3],
    to: match[5],
  }));
}

function updateKinds(body, declaredCount) {
  const metadataKinds = [...body.matchAll(metadataUpdateTypePattern)].map(
    (match) => match[1],
  );
  if (metadataKinds.length > 0 &&
      (declaredCount === undefined || metadataKinds.length >= declaredCount)) {
    return metadataKinds;
  }
  // Partial group metadata must not discard the complete transition list.
  // The caller still requires exactly the declared count and proven versions.
  return versionTransitions(body).map(({ kind }) => kind);
}

function groupReason(ecosystem, counts) {
  const majorSuffix = counts.major > 0 ? `, and ${counts.major} major` : "";
  return `verified ${ecosystem} group containing ${counts.patch} patch and ${counts.minor} minor${majorSuffix} update`;
}

function deny(reason) {
  return { eligible: false, reason };
}

export function classifyDependabotPullRequest(pullRequest) {
  if (pullRequest.author?.login !== "dependabot[bot]") {
    return deny("pull request author is not dependabot[bot]");
  }

  const filenames = pullRequest.files.map(({ filename }) => filename);
  if (filenames.length === 0) {
    return deny("pull request must change a dependency file");
  }

  const isPnpmUpdate = filenames.every((filename) =>
    (allowedPnpmFiles.has(filename) || /(^|\/)package\.json$/.test(filename)),
  );
  const isGitHubActionsUpdate = filenames.every((filename) =>
    githubActionsFilePattern.test(filename),
  );
  const unexpectedFile = filenames.find(
    (filename) =>
      !(allowedPnpmFiles.has(filename) || /(^|\/)package\.json$/.test(filename)) &&
      !githubActionsFilePattern.test(filename),
  );
  if (unexpectedFile) {
    return deny(`unexpected file requires human review: ${unexpectedFile}`);
  }
  if (!isPnpmUpdate && !isGitHubActionsUpdate) {
    return deny("mixed package ecosystems require human review");
  }
  if (isPnpmUpdate && !filenames.includes("pnpm-lock.yaml")) {
    return deny("pnpm-lock.yaml is required to prove a pnpm update");
  }

  const body = pullRequest.body ?? "";
  const groupMatch = (pullRequest.body ?? "").match(
    /group(?: across \d+ directories?)? with\s+(\d+)\s+updates?/i,
  );
  const declaredCount = groupMatch ? Number(groupMatch[1]) : undefined;
  const kinds = updateKinds(body, declaredCount);
  if (groupMatch) {
    if (
      kinds.length !== declaredCount ||
      kinds.some((kind) => kind === "unproven")
    ) {
      return deny(`could not prove all ${declaredCount} grouped updates`);
    }
  } else if (kinds.length !== 1) {
    return deny("could not prove exactly one package version transition");
  }

  if (kinds.some((kind) => kind === "unproven")) {
    return deny("update type could not be proven");
  }

  const counts = kinds.reduce(
    (result, kind) => {
      result[kind] += 1;
      return result;
    },
    { major: 0, minor: 0, patch: 0 },
  );
  const ecosystem = isPnpmUpdate ? "pnpm" : "GitHub Actions";

  if (groupMatch) {
    return {
      eligible: true,
      reason: groupReason(ecosystem, counts),
    };
  }

  return {
    eligible: true,
    reason: `verified ${ecosystem} ${kinds[0]} update`,
  };
}

async function main() {
  const inputPath = process.argv[2];
  if (!inputPath) {
    throw new Error("Usage: classify-dependabot-pr.mjs <pull-request.json>");
  }

  const pullRequest = JSON.parse(await readFile(inputPath, "utf8"));
  const decision = classifyDependabotPullRequest(pullRequest);
  console.log(decision.reason);
  if (!decision.eligible) {
    process.exitCode = 1;
  }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  await main();
}
