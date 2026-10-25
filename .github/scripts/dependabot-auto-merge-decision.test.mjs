import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { decide } from "./dependabot-auto-merge-decision.mjs";

function dependency(overrides) {
  return {
    dependencyName: "example",
    dependencyType: "direct:production",
    updateType: "version-update:semver-patch",
    packageEcosystem: "npm_and_yarn",
    dependencyGroup: "npm-patch-minor",
    alertState: "",
    ghsaId: "",
    ...overrides,
  };
}

describe("dependabot auto-merge decision", () => {
  it("merges npm patch and minor updates, including mixed groups", () => {
    assert.equal(decide({ dependencies: [dependency()] }).action, "merge");
    assert.equal(
      decide({
        dependencies: [dependency({ updateType: "version-update:semver-minor" })],
      }).action,
      "merge",
    );
    assert.equal(
      decide({
        dependencies: [
          dependency({ dependencyName: "next" }),
          dependency({
            dependencyName: "zod",
            updateType: "version-update:semver-minor",
          }),
        ],
      }).action,
      "merge",
    );
  });

  it("merges every GitHub Actions update, including majors", () => {
    assert.equal(
      decide({
        dependencies: [
          dependency({
            dependencyName: "actions/checkout",
            packageEcosystem: "github_actions",
            dependencyGroup: "github-actions-patch-minor",
            updateType: "version-update:semver-major",
          }),
        ],
      }).action,
      "merge",
    );
  });

  it("leaves npm majors for review", () => {
    const result = decide({
      dependencies: [
        dependency({
          dependencyName: "typescript",
          updateType: "version-update:semver-major",
          dependencyGroup: "",
        }),
      ],
    });
    assert.equal(result.action, "review");
    assert.match(result.reason, /typescript/);
  });

  it("does not merge a group that mixes a minor with an npm major", () => {
    const result = decide({
      dependencies: [
        dependency({ dependencyName: "zod", updateType: "version-update:semver-minor" }),
        dependency({
          dependencyName: "typescript",
          updateType: "version-update:semver-major",
          dependencyGroup: "",
        }),
      ],
    });
    assert.equal(result.action, "review");
    assert.match(result.reason, /typescript/);
    assert.doesNotMatch(result.reason, /zod/);
  });

  it("merges security updates marked by group, advisory, or Dependabot body text", () => {
    assert.equal(
      decide({
        dependencies: [
          dependency({
            dependencyName: "brace-expansion",
            updateType: "version-update:semver-major",
            dependencyGroup: "npm-security",
          }),
        ],
      }).action,
      "merge",
    );
    assert.equal(
      decide({
        dependencies: [
          dependency({
            dependencyName: "actions/setup-node",
            packageEcosystem: "github_actions",
            updateType: "version-update:semver-patch",
            dependencyGroup: "github-actions-security",
          }),
        ],
      }).action,
      "merge",
    );
    assert.equal(
      decide({
        dependencies: [
          dependency({
            dependencyName: "minimatch",
            updateType: "version-update:semver-major",
            dependencyGroup: "",
            ghsaId: "GHSA-example",
            alertState: "FIXED",
          }),
        ],
      }).action,
      "merge",
    );
    assert.equal(
      decide({
        dependencies: [
          dependency({
            dependencyName: "minimatch",
            updateType: "version-update:semver-major",
            dependencyGroup: "",
          }),
        ],
        pullRequestBody:
          "Bumps `minimatch` from 3.0.0 to 4.0.0. **This update includes a security fix.**",
      }).action,
      "merge",
    );
  });

  it("does not treat a changelog mention as a security fix for another major", () => {
    const result = decide({
      dependencies: [
        dependency({
          dependencyName: "left-pad",
          updateType: "version-update:semver-patch",
        }),
        dependency({
          dependencyName: "typescript",
          updateType: "version-update:semver-major",
          dependencyGroup: "",
        }),
      ],
      pullRequestBody: [
        "Updates `left-pad` from 1.0.0 to 1.0.1",
        "Release notes: This update includes a security fix for a transitive parser.",
        "Updates `typescript` from 5.0.0 to 6.0.0",
        "Release notes: new compiler.",
      ].join("\n"),
    });
    assert.equal(result.action, "review");
  });

  it("merges only the dependency Dependabot marks inside a group", () => {
    const result = decide({
      dependencies: [
        dependency({
          dependencyName: "brace-expansion",
          updateType: "version-update:semver-major",
          dependencyGroup: "",
        }),
        dependency({
          dependencyName: "typescript",
          updateType: "version-update:semver-major",
          dependencyGroup: "",
        }),
      ],
      pullRequestBody: [
        "Updates `brace-expansion` from 1.0.0 to 2.0.0 **This update includes security fixes.**",
        "Updates `typescript` from 5.0.0 to 6.0.0",
      ].join("\n"),
    });
    assert.equal(result.action, "review");
    assert.match(result.reason, /typescript/);
  });

  it("uses scalar metadata for a single update and keeps alert info on the first dependency", () => {
    assert.equal(
      decide({
        dependencies: [{ dependencyName: "next" }],
        packageEcosystem: "npm_and_yarn",
        dependencyGroup: "npm-patch-minor",
        updateType: "version-update:semver-patch",
      }).action,
      "merge",
    );
    const result = decide({
      dependencies: [
        { dependencyName: "brace-expansion", updateType: "version-update:semver-major" },
        {
          dependencyName: "typescript",
          updateType: "version-update:semver-major",
          packageEcosystem: "npm_and_yarn",
        },
      ],
      ghsaId: "GHSA-first-only",
      alertState: "OPEN",
    });
    assert.equal(result.action, "review");
    assert.match(result.reason, /typescript/);
    assert.doesNotMatch(result.reason, /brace-expansion/);
  });

  it("skips when metadata is missing or an update type cannot be classified", () => {
    assert.equal(decide({ dependencies: [] }).action, "skip");
    assert.equal(
      decide({
        dependencies: [
          dependency({
            dependencyName: "mystery",
            updateType: "",
            dependencyGroup: "",
          }),
        ],
      }).action,
      "skip",
    );
  });
});
