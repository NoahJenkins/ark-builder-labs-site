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

auto_source = File.read(File.join(ROOT, ".github/workflows/dependabot-auto-merge.yml"))
triggers = workflow_triggers(auto_merge)
%w[pull_request_target workflow_run status deployment_status schedule workflow_dispatch].each do |event|
  assert(triggers.key?(event), "controller must reconcile #{event}")
end
%w[controller claim worker validate publish reconcile].each do |job|
  assert(auto_merge.fetch("jobs").key?(job), "isolated #{job} stage is required")
end
assert(auto_source.include?("ref: ${{ github.workflow_sha }}"), "checkout must use immutable trusted source")
assert(auto_source.include?("persist-credentials: false"), "checkout must not persist credentials")
assert(!auto_source.include?("REPO_ADMIN_TOKEN"), "broad legacy credential must not reach controller")
assert(!File.exist?(File.join(ROOT, ".github/workflows/dependabot-behind-refresh.yml")), "no competing unbounded refresh workflow")
assert(system("node", "--test", File.join(ROOT, ".github/scripts/dependabot-recovery.contract.cjs")), "controller behavior tests")
assert(system("node", "--test", File.join(ROOT, ".github/scripts/dependabot-gate-lifecycle.contract.cjs")), "controller gate lifecycle tests")

branch_protection = read_json(".github/branch-protection/main.json")
required_status_checks = branch_protection.fetch("required_status_checks")
assert_equal(true, required_status_checks.fetch("strict"), "main protection must require the current base")
assert_equal(REQUIRED_CHECKS, required_status_checks.fetch("contexts"), "protected check names")

ci_check_names = ci.fetch("jobs").values.map { |job| job.fetch("name") }
assert_equal(REQUIRED_CHECKS.sort, ci_check_names.sort, "CI job names must match protected checks exactly")

# Bound setup costs independently from test execution. Cache hits must never
# skip Linux system dependencies or restore browsers from an unrelated lockfile.
ci.fetch("jobs").each do |name, job|
  timeout = job.fetch("timeout-minutes")
  assert(timeout.is_a?(Integer) && timeout.between?(1, 15), "#{name} job timeout must be at most 15 minutes")
  job.fetch("steps").each do |step|
    command = step.fetch("run", "")
    next unless command.include?("pnpm install ") || command.include?("playwright install")

    timeout = step.fetch("timeout-minutes")
    assert(timeout.is_a?(Integer) && timeout.between?(1, 5), "#{name} install timeout must be at most 5 minutes")
    assert(!step.fetch("continue-on-error", false), "#{name} must fail on an install timeout")
  end
end
browser_steps = ci.fetch("jobs").fetch("playwright-tests").fetch("steps")
browser_cache = browser_steps.find { |step| step["id"] == "playwright-cache" }.fetch("with")
assert_equal("~/.cache/ms-playwright", browser_cache.fetch("path"), "browser cache must contain browser binaries only")
%w[runner.os runner.arch pnpm-lock.yaml].each do |part|
  assert(browser_cache.fetch("key").include?(part), "browser cache key must include #{part}")
end
assert(!browser_cache.key?("restore-keys"), "browser cache must require the exact lockfile key")
system_install = browser_steps.find { |step| step["run"] == "pnpm exec playwright install-deps" }
assert(system_install && !system_install.key?("if"), "Linux system dependencies must install on cache hits and misses")
browser_install = browser_steps.find { |step| step["run"] == "pnpm exec playwright install" }
assert_equal("steps.playwright-cache.outputs.cache-hit != 'true'", browser_install.fetch("if"), "cached browser binaries must skip the download")

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
