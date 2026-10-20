import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'
import matter from 'gray-matter'
import { getBlogPost, getBlogPosts } from '@/lib/blog'

const matterRequire = createRequire(require.resolve('gray-matter'))
const yaml3 = matterRequire('js-yaml')
const eslintRequire = createRequire(require.resolve('eslint'))
const eslintrcRequire = createRequire(eslintRequire.resolve('@eslint/eslintrc'))
const yaml4 = eslintrcRequire('js-yaml')
const cliPath = matterRequire.resolve('js-yaml/bin/js-yaml.js')

describe('YAML dependency compatibility', () => {
  it('reads real blog frontmatter and preserves content and serialization', () => {
    const post = getBlogPost('welcome-to-our-blog')
    expect(post).toMatchObject({
      title: 'Welcome to Our Blog',
      category: 'General',
      publishedAt: '2025-09-30',
      featured: true,
    })
    expect(post?.content).toContain('# Welcome to the Ark Builder Labs Blog')
    expect(getBlogPosts()).toContainEqual(post)

    const serialized = matter.stringify('Body\n', {
      title: 'Quoted: title',
      publishedAt: '2026-10-20',
      featured: false,
    })
    expect(matter(serialized)).toMatchObject({
      data: { title: 'Quoted: title', publishedAt: '2026-10-20', featured: false },
      content: 'Body\n',
    })
  })

  it.each([['blog YAML', yaml3], ['lint YAML', yaml4]])(
    '%s counts empty merge sources toward its work limit',
    (_name, yaml) => {
      const input = 'empty: &empty [{}, {}, {}]\ntargets:\n  - <<: *empty\n  - <<: *empty\n'
      expect(() => yaml.load(input, { maxTotalMergeKeys: 2 })).toThrow(/maxTotalMergeKeys/)
      const directMerge = 'empty: &empty {}\na: { <<: *empty }\nb: { <<: *empty }\n'
      expect(() => yaml.load(directMerge, { maxTotalMergeKeys: 1 })).toThrow(/maxTotalMergeKeys/)
      expect(yaml.load('base: &base { title: Example }\npost: { <<: *base }')).toEqual({
        base: { title: 'Example' }, post: { title: 'Example' },
      })
    },
  )

  it.each([[[]], [['--to-json']], [['--compact']], [['--trace']]])(
    'keeps the YAML CLI stdin conversion with flags %j',
    (args) => {
      const result = spawnSync(process.execPath, [cliPath, ...args], {
        input: 'title: Example\nfeatured: true\n', encoding: 'utf8', timeout: 5000,
      })
      expect(result.status).toBe(0)
      expect(JSON.parse(result.stdout)).toEqual({ title: 'Example', featured: true })
    },
  )

  it('keeps YAML CLI file input and JSON-to-YAML conversion', () => {
    const file = spawnSync(process.execPath, [cliPath, '.github/dependabot.yml'], {
      encoding: 'utf8', timeout: 5000,
    })
    expect(file.status).toBe(0)
    expect(JSON.parse(file.stdout).version).toBe(2)
    const json = spawnSync(process.execPath, [cliPath], {
      input: '{"title":"Example","featured":true}', encoding: 'utf8', timeout: 5000,
    })
    expect(json.status).toBe(0)
    expect(yaml3.safeLoad(json.stdout)).toEqual({ title: 'Example', featured: true })
  })

  it.each(['--compact', '--trace'])('keeps YAML CLI errors with %s', (flag) => {
    const result = spawnSync(process.execPath, [cliPath, flag], {
      input: 'broken: [', encoding: 'utf8', timeout: 5000,
    })
    expect(result.status).toBe(1)
    expect(result.stderr).toContain('YAMLException')
  })

  it('keeps YAML CLI help and version output', () => {
    const help = spawnSync(process.execPath, [cliPath, '--help'], { encoding: 'utf8', timeout: 5000 })
    expect(help.status).toBe(0)
    expect(help.stdout).toContain('--compact')
    expect(help.stdout).not.toContain('--to-json')
    const version = spawnSync(process.execPath, [cliPath, '--version'], { encoding: 'utf8', timeout: 5000 })
    expect(version.status).toBe(0)
    expect(version.stdout.trim()).toBe(matterRequire('js-yaml/package.json').version)
  })
})
