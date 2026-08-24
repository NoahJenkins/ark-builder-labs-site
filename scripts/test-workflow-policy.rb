#!/usr/bin/env ruby
# frozen_string_literal: true

require "json"
require "yaml"

ROOT = File.expand_path("..", __dir__)
REQUIRED_CHECKS = [
  "TypeScript & Lint",
  "Jest Tests",
  "Build Check",
  "Playwright Tests"
].freeze

def read_yaml(path)
  YAML.safe_load(File.read(File.join(ROOT, path)), aliases: true)
end

def read_json(path)
  JSON.parse(File.read(File.join(ROOT, path)))
end

def assert(condition, message)
  raise "Policy contract failed: #{message}" unless condition
end

def assert_equal(expected, actual, message)
  return if expected == actual

  raise "Policy contract failed: #{message}\nExpected: #{expected.inspect}\nActual:   #{actual.inspect}"
end

def workflow_triggers(workflow)
  workflow["on"] || workflow[true]
end

def assert_group(groups, name, applies_to:, update_types: nil)
  group = groups.fetch(name)
  assert_equal(applies_to, group.fetch("applies-to"), "#{name} applies-to")
  assert_equal(["*"], group.fetch("patterns"), "#{name} patterns")

  if update_types
    assert_equal(update_types.sort, group.fetch("update-types").sort, "#{name} update-types")
  else
    assert(!group.key?("update-types"), "#{name} must not restrict security update severity")
  end
end

dependabot = read_yaml(".github/dependabot.yml")
auto_merge = read_yaml(".github/workflows/dependabot-auto-merge.yml")
refresh = read_yaml(".github/workflows/dependabot-behind-refresh.yml")
ci = read_yaml(".github/workflows/ci.yaml")

updates = dependabot.fetch("updates")
assert_equal(2, updates.length, "Dependabot must define npm and GitHub Actions ecosystems")

npm_updates = updates.find { |entry| entry["package-ecosystem"] == "npm" }
actions_updates = updates.find { |entry| entry["package-ecosystem"] == "github-actions" }
assert(npm_updates, "npm update configuration is required")
assert(actions_updates, "GitHub Actions update configuration is required")

updates.each do |entry|
  ecosystem = entry.fetch("package-ecosystem")
  assert(!entry.key?("reviewers"), "#{ecosystem} must not request a reviewer")
  assert(!entry.key?("assignees"), "#{ecosystem} must not assign a maintainer")
  assert(!entry.key?("ignore"), "#{ecosystem} must not suppress standalone safe major updates")
end

assert_equal(
  ["npm-patch-minor", "npm-security"],
  npm_updates.fetch("groups").keys,
  "npm must use one routine group and one security group"
)
assert_group(
  npm_updates.fetch("groups"),
  "npm-patch-minor",
  applies_to: "version-updates",
  update_types: %w[patch minor]
)
assert_group(
  npm_updates.fetch("groups"),
  "npm-security",
  applies_to: "security-updates"
)

assert_equal(
  ["github-actions-patch-minor", "github-actions-security"],
  actions_updates.fetch("groups").keys,
  "GitHub Actions must use one routine group and one security group"
)
assert_group(
  actions_updates.fetch("groups"),
  "github-actions-patch-minor",
  applies_to: "version-updates",
  update_types: %w[patch minor]
)
assert_group(
  actions_updates.fetch("groups"),
  "github-actions-security",
  applies_to: "security-updates"
)

auto_job = auto_merge.fetch("jobs").fetch("dependabot-auto-merge")
assert_equal(5, auto_job.fetch("timeout-minutes"), "auto-merge timeout")

auto_source = File.read(File.join(ROOT, ".github/workflows/dependabot-auto-merge.yml"))
[
  "github.actor == 'dependabot[bot]'",
  "github.event.pull_request.user.login == 'dependabot[bot]'",
  "github.event.pull_request.base.ref == 'main'",
  "github.event.pull_request.draft == false",
  "npm|npm_and_yarn|github_actions",
  "version-update:semver-patch|version-update:semver-minor|version-update:semver-major",
  "^\\.github\\/workflows\\/[^/]+\\.ya?ml$",
  "^\\.github\\/dependabot\\.ya?ml$",
  "enablePullRequestAutoMerge",
  "mergeMethod: SQUASH"
].each do |contract|
  assert(auto_source.include?(contract), "auto-merge workflow must retain #{contract}")
end
assert(!auto_source.include?("pulls.merge"), "workflow must use native auto-merge, not a direct merge")
assert(!auto_source.include?("pulls.update"), "workflow must not close or rewrite ineligible PRs")

allowed_file_patterns = [
  /(^|\/)package\.json$/,
  /(^|\/)pnpm-lock\.yaml$/,
  /(^|\/)package-lock\.json$/,
  /(^|\/)yarn\.lock$/,
  /(^|\/)bun\.lockb$/,
  /(^|\/)npm-shrinkwrap\.json$/,
  /^\.github\/workflows\/[^\/]+\.ya?ml$/,
  /^\.github\/dependabot\.ya?ml$/
]
allowed_files = [
  "package.json",
  "apps/site/package.json",
  "pnpm-lock.yaml",
  ".github/workflows/ci.yaml",
  ".github/dependabot.yml"
]
disallowed_files = ["README.md", "src/app/page.tsx", "scripts/release.sh"]
assert(
  allowed_files.all? { |file| allowed_file_patterns.any? { |pattern| pattern.match?(file) } },
  "dependency-only files must satisfy the allowlist"
)
assert(
  disallowed_files.none? { |file| allowed_file_patterns.any? { |pattern| pattern.match?(file) } },
  "non-dependency files must fail the allowlist"
)

auto_merge_eligible = lambda do |actor:, author:, base:, draft:, ecosystem:, update_type:, files:|
  actor == "dependabot[bot]" &&
    author == "dependabot[bot]" &&
    base == "main" &&
    !draft &&
    %w[npm npm_and_yarn github_actions].include?(ecosystem) &&
    %w[
      version-update:semver-patch
      version-update:semver-minor
      version-update:semver-major
    ].include?(update_type) &&
    files.all? { |file| allowed_file_patterns.any? { |pattern| pattern.match?(file) } }
end

base_pr = {
  actor: "dependabot[bot]",
  author: "dependabot[bot]",
  base: "main",
  draft: false,
  ecosystem: "npm_and_yarn",
  files: ["package.json", "pnpm-lock.yaml"]
}
assert(
  auto_merge_eligible.call(**base_pr, update_type: "version-update:semver-minor"),
  "grouped routine npm updates must be eligible"
)
assert(
  auto_merge_eligible.call(**base_pr, update_type: "version-update:semver-patch"),
  "grouped security patches must be eligible without a separate gate"
)
assert(
  auto_merge_eligible.call(**base_pr, update_type: "version-update:semver-major"),
  "dependency-only major updates must remain eligible"
)
assert(
  auto_merge_eligible.call(
    **base_pr,
    ecosystem: "github_actions",
    update_type: "version-update:semver-minor",
    files: [".github/workflows/ci.yaml"]
  ),
  "grouped GitHub Actions updates must be eligible"
)
assert(
  !auto_merge_eligible.call(
    **base_pr,
    update_type: "version-update:semver-patch",
    files: ["package.json", "src/app/page.tsx"]
  ),
  "updates with disallowed files must remain open"
)

protected_merge_ready = lambda do |check_conclusions|
  REQUIRED_CHECKS.all? { |name| check_conclusions[name] == "success" }
end
passing_checks = REQUIRED_CHECKS.to_h { |name| [name, "success"] }
failed_checks = passing_checks.merge("Jest Tests" => "failure")
assert(protected_merge_ready.call(passing_checks), "all four protected checks must permit native auto-merge")
assert(!protected_merge_ready.call(failed_checks), "a failed protected check must keep the update open")

refresh_eligible = lambda do |auto_merge_enabled:, mergeable_state:, failed:, pending:|
  auto_merge_enabled && mergeable_state == "behind" && failed.zero? && pending.zero?
end
assert(
  refresh_eligible.call(auto_merge_enabled: true, mergeable_state: "behind", failed: 0, pending: 0),
  "a green behind branch must be refreshed"
)
assert(
  !refresh_eligible.call(auto_merge_enabled: true, mergeable_state: "behind", failed: 1, pending: 0),
  "a failed behind branch must stay open without repeated refresh"
)
assert(
  !refresh_eligible.call(auto_merge_enabled: true, mergeable_state: "dirty", failed: 0, pending: 0),
  "a conflicting branch must stay open"
)

refresh_on = workflow_triggers(refresh)
assert(refresh_on.key?("push"), "refresh must retain the main push trigger")
assert(refresh_on.key?("pull_request_target"), "refresh must retain the merged-PR trigger")
assert(refresh_on.key?("workflow_dispatch"), "refresh must retain manual recovery")
assert_equal(
  ["23 20 * * *"],
  refresh_on.fetch("schedule").map { |entry| entry.fetch("cron") },
  "refresh must use one measured daily fallback"
)

refresh_job = refresh.fetch("jobs").fetch("refresh-behind-prs")
assert_equal(5, refresh_job.fetch("timeout-minutes"), "refresh timeout")

refresh_source = File.read(File.join(ROOT, ".github/workflows/dependabot-behind-refresh.yml"))
[
  "details.data.auto_merge !== null",
  "mergeableState !== 'behind'",
  "failedChecks.length > 0",
  "failedStatuses.length > 0",
  "pendingChecks.length > 0",
  "pendingStatuses.length > 0",
  "github.rest.pulls.updateBranch",
  "core.setFailed"
].each do |contract|
  assert(refresh_source.include?(contract), "refresh workflow must retain #{contract}")
end

branch_protection = read_json(".github/branch-protection/main.json")
required_status_checks = branch_protection.fetch("required_status_checks")
assert_equal(true, required_status_checks.fetch("strict"), "main protection must require the current base")
assert_equal(REQUIRED_CHECKS, required_status_checks.fetch("contexts"), "protected check names")

ci_check_names = ci.fetch("jobs").values.map { |job| job.fetch("name") }
assert_equal(REQUIRED_CHECKS.sort, ci_check_names.sort, "CI job names must match protected checks exactly")

repository_settings = read_json(".github/repository-settings/repository.json")
assert_equal(true, repository_settings.fetch("allow_auto_merge"), "repository must allow auto-merge")
assert_equal(true, repository_settings.fetch("allow_update_branch"), "repository must allow branch updates")
assert_equal(true, repository_settings.fetch("allow_squash_merge"), "repository must allow squash merges")

workflow_permissions = read_json(".github/repository-settings/workflow-permissions.json")
assert_equal("read", workflow_permissions.fetch("default_workflow_permissions"), "default workflow permission")
assert_equal(true, workflow_permissions.fetch("can_approve_pull_request_reviews"), "workflow review permission")

package_json = read_json("package.json")
assert_equal(
  "ruby scripts/test-workflow-policy.rb",
  package_json.fetch("scripts").fetch("test:workflow-policy"),
  "package script for policy verification"
)
assert(
  File.read(File.join(ROOT, ".github/workflows/ci.yaml")).include?("pnpm run test:workflow-policy"),
  "the protected TypeScript and lint job must run the policy contract"
)

puts "Dependency automation policy contract passed."
