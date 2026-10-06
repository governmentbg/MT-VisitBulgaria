#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default || require('@babel/traverse');

// ─── Configuration ───────────────────────────────────────────────────────────

const ROOT = path.resolve(__dirname, '..');

const CONFIGS = {
  mobile: {
    basePath: path.join(ROOT, 'DigitalTourism.Mobile'),
    languages: ['en', 'bg', 'de', 'ru', 'fr'],
    namespaces: [
      'common', 'navigation', 'events', 'attractions', 'errors',
      'onboarding', 'map', 'profile', 'hotels', 'restaurants',
      'activities', 'favourites', 'routes',
    ],
    excludeDirs: ['node_modules', 'src/i18n', '__tests__', '.expo'],
    loadTranslations: loadMobileTranslations,
    hookNames: ['useTranslation'],
    hookStyle: 'destructured', // const {t} = useTranslation('ns')
  },
  payload: {
    basePath: path.join(ROOT, 'DigitalTourism.Cloud', 'DigitalTourism.Cloud.PayloadCms'),
    languages: ['en', 'bg', 'de', 'fr', 'ru'],
    namespaces: null, // discovered from translation files
    excludeDirs: ['node_modules', 'src/i18n/messages', 'src/i18n/admin', 'src/i18n/translations', '.next'],
    loadTranslations: loadPayloadTranslations,
    hookNames: ['useTranslations', 'getTranslations'],
    hookStyle: 'direct', // const t = useTranslations('ns')
  },
};

// User-visible JSX component names (for static text detection)
const USER_VISIBLE_TAGS = new Set([
  'Text', 'Typography', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'span', 'label', 'Button', 'Title', 'Subtitle', 'Paragraph',
  'Link', 'a', 'li', 'td', 'th', 'caption', 'summary', 'legend',
  'option', 'MenuItem', 'Tab', 'Chip', 'Badge', 'Alert',
]);

// JSX attributes that typically contain user-visible text
const USER_VISIBLE_ATTRS = new Set([
  'title', 'label', 'placeholder', 'description', 'accessibilityLabel',
  'headerTitle', 'alt', 'aria-label', 'buttonText', 'message',
  'errorMessage', 'helperText', 'tooltip',
]);

// Known code/style identifiers to exclude from static text detection
const CODE_IDENTIFIERS = new Set([
  'primary', 'secondary', 'tertiary', 'default', 'none', 'auto',
  'bold', 'normal', 'inherit', 'initial', 'unset',
  'center', 'left', 'right', 'top', 'bottom', 'middle',
  'flex', 'row', 'column', 'block', 'inline', 'grid', 'absolute', 'relative', 'fixed', 'sticky',
  'xs', 's', 'sm', 'm', 'md', 'l', 'lg', 'xl', 'xxl', '2xl', '3xl',
  'small', 'medium', 'large',
  'solid', 'dashed', 'dotted', 'transparent', 'white', 'black',
  'contained', 'outlined', 'text', 'filled', 'standard',
  'horizontal', 'vertical', 'wrap', 'nowrap',
  'body', 'body1', 'body2', 'caption', 'overline', 'subtitle1', 'subtitle2',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'error', 'warning', 'info', 'success',
  'submit', 'reset', 'button', 'input', 'select', 'textarea',
  'get', 'post', 'put', 'delete', 'patch',
  'true', 'false', 'null', 'undefined',
  'asc', 'desc',
  'light', 'dark',
  'ios', 'android', 'web',
  'en', 'bg', 'de', 'fr', 'ru',
]);

// ─── Translation Loading ─────────────────────────────────────────────────────

function flattenKeys(obj, prefix = '') {
  const keys = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      keys.push(...flattenKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

function loadMobileTranslations(config) {
  // Structure: src/i18n/locales/{lang}/{namespace}.json
  // Returns: Map<namespace, Map<language, Set<key>>>
  const dict = new Map();
  const localesDir = path.join(config.basePath, 'src', 'i18n', 'locales');

  for (const ns of config.namespaces) {
    const langMap = new Map();
    for (const lang of config.languages) {
      const filePath = path.join(localesDir, lang, `${ns}.json`);
      try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        langMap.set(lang, new Set(flattenKeys(data)));
      } catch {
        langMap.set(lang, new Set());
      }
    }
    dict.set(ns, langMap);
  }
  return dict;
}

function loadPayloadTranslations(config) {
  // Structure: src/i18n/messages/{lang}.json (top-level keys = namespaces)
  // Returns: Map<namespace, Map<language, Set<key>>>
  const dict = new Map();
  const messagesDir = path.join(config.basePath, 'src', 'i18n', 'messages');
  const discoveredNamespaces = new Set();

  // First pass: discover all namespaces from all language files
  for (const lang of config.languages) {
    const filePath = path.join(messagesDir, `${lang}.json`);
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      for (const ns of Object.keys(data)) {
        discoveredNamespaces.add(ns);
      }
    } catch { /* skip */ }
  }

  // Second pass: load keys per namespace per language
  for (const ns of discoveredNamespaces) {
    const langMap = new Map();
    for (const lang of config.languages) {
      const filePath = path.join(messagesDir, `${lang}.json`);
      try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (data[ns] && typeof data[ns] === 'object') {
          langMap.set(lang, new Set(flattenKeys(data[ns])));
        } else {
          langMap.set(lang, new Set());
        }
      } catch {
        langMap.set(lang, new Set());
      }
    }
    dict.set(ns, langMap);
  }

  config.namespaces = [...discoveredNamespaces];
  return dict;
}

// ─── File Discovery ──────────────────────────────────────────────────────────

function discoverSourceFiles(basePath, excludeDirs) {
  const files = [];
  const srcDir = path.join(basePath, 'src');

  function walk(dir) {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relPath = path.relative(basePath, fullPath).replace(/\\/g, '/');

      if (entry.isDirectory()) {
        if (excludeDirs.some(ex => relPath === ex || relPath.startsWith(ex + '/'))) continue;
        walk(fullPath);
      } else if (entry.isFile() && /\.(tsx?|jsx?)$/.test(entry.name)) {
        files.push(fullPath);
      }
    }
  }

  walk(srcDir);
  return files;
}

// ─── AST Parsing ─────────────────────────────────────────────────────────────

function parseFile(filePath, content) {
  try {
    return parser.parse(content, {
      sourceType: 'module',
      plugins: [
        'typescript',
        'jsx',
        'decorators-legacy',
        'classProperties',
        'optionalChaining',
        'nullishCoalescingOperator',
        'dynamicImport',
      ],
      errorRecovery: true,
    });
  } catch (err) {
    console.warn(`  Warning: Could not parse ${path.relative(ROOT, filePath)}: ${err.message}`);
    return null;
  }
}

// ─── Key Extraction ──────────────────────────────────────────────────────────

function extractKeysFromFile(filePath, content, config) {
  const ast = parseFile(filePath, content);
  if (!ast) return [];

  const aliasToNamespace = new Map(); // alias name -> namespace
  const keys = [];

  traverse(ast, {
    // Step A: Find useTranslation / useTranslations / getTranslations calls
    CallExpression(nodePath) {
      const callee = nodePath.node.callee;
      let hookName = null;

      // Direct call: useTranslation('ns') or useTranslations('ns')
      if (callee.type === 'Identifier' && config.hookNames.includes(callee.name)) {
        hookName = callee.name;
      }

      if (!hookName) return;

      // Extract namespace from arguments
      let namespace = null;
      const args = nodePath.node.arguments;

      if (args.length > 0) {
        if (args[0].type === 'StringLiteral') {
          namespace = args[0].value;
        } else if (args[0].type === 'ObjectExpression') {
          // getTranslations({ locale, namespace: 'ns' })
          const nsProp = args[0].properties.find(
            p => p.type === 'ObjectProperty' && p.key.type === 'Identifier' && p.key.name === 'namespace'
          );
          if (nsProp && nsProp.value.type === 'StringLiteral') {
            namespace = nsProp.value.value;
          }
        }
      }

      if (!namespace) return;

      // Find the variable declarator parent to get the alias name(s)
      const declarator = nodePath.findParent(p => p.isVariableDeclarator());
      if (!declarator) return;

      const id = declarator.node.id;

      if (config.hookStyle === 'destructured') {
        // Mobile: const {t} = useTranslation('ns') or const {t: tAlias} = useTranslation('ns')
        if (id.type === 'ObjectPattern') {
          for (const prop of id.properties) {
            if (prop.type === 'ObjectProperty') {
              const keyName = prop.key.type === 'Identifier' ? prop.key.name : null;
              if (keyName === 't') {
                const alias = prop.value.type === 'Identifier' ? prop.value.name : keyName;
                aliasToNamespace.set(alias, namespace);
              }
            }
          }
        }
      } else if (config.hookStyle === 'direct') {
        // Payload: const t = useTranslations('ns')
        if (id.type === 'Identifier') {
          aliasToNamespace.set(id.name, namespace);
        }
      }
    },
  });

  // Step B: Find all t() calls using the collected aliases
  traverse(ast, {
    CallExpression(nodePath) {
      const callee = nodePath.node.callee;

      // Check for alias('key') calls
      if (callee.type === 'Identifier' && aliasToNamespace.has(callee.name)) {
        const args = nodePath.node.arguments;
        if (args.length > 0 && args[0].type === 'StringLiteral') {
          let key = args[0].value;
          let namespace = aliasToNamespace.get(callee.name);

          // Handle i18next cross-namespace syntax: t('otherNamespace:key')
          const colonIdx = key.indexOf(':');
          if (colonIdx > 0) {
            namespace = key.substring(0, colonIdx);
            key = key.substring(colonIdx + 1);
          }

          // Check for defaultValue in second argument
          let hasDefaultValue = false;
          if (args.length > 1 && args[1].type === 'ObjectExpression') {
            hasDefaultValue = args[1].properties.some(
              p => p.type === 'ObjectProperty' &&
                p.key.type === 'Identifier' &&
                p.key.name === 'defaultValue'
            );
          }

          keys.push({
            namespace,
            key,
            line: nodePath.node.loc?.start.line || 0,
            hasDefaultValue,
            file: path.relative(ROOT, filePath).replace(/\\/g, '/'),
          });
        }
        // Dynamic keys (Identifier, TemplateLiteral, etc.) are silently skipped
      }

      // Check for i18n.t('namespace:key') pattern (mobile only)
      if (
        callee.type === 'MemberExpression' &&
        callee.object.type === 'Identifier' &&
        callee.object.name === 'i18n' &&
        callee.property.type === 'Identifier' &&
        callee.property.name === 't'
      ) {
        const args = nodePath.node.arguments;
        if (args.length > 0 && args[0].type === 'StringLiteral') {
          const fullKey = args[0].value;
          const colonIdx = fullKey.indexOf(':');
          if (colonIdx > 0) {
            const namespace = fullKey.substring(0, colonIdx);
            const key = fullKey.substring(colonIdx + 1);

            let hasDefaultValue = false;
            if (args.length > 1 && args[1].type === 'ObjectExpression') {
              hasDefaultValue = args[1].properties.some(
                p => p.type === 'ObjectProperty' &&
                  p.key.type === 'Identifier' &&
                  p.key.name === 'defaultValue'
              );
            }

            keys.push({
              namespace,
              key,
              line: nodePath.node.loc?.start.line || 0,
              hasDefaultValue,
              file: path.relative(ROOT, filePath).replace(/\\/g, '/'),
            });
          }
        }
      }
    },
  });

  return keys;
}

// ─── Static Text Detection ───────────────────────────────────────────────────

function isUserVisibleText(text) {
  const trimmed = text.trim();

  // Skip empty, whitespace, or single character
  if (!trimmed || trimmed.length <= 1) return false;

  // Skip purely numeric
  if (/^\d+([.,]\d+)?$/.test(trimmed)) return false;

  // Skip known code identifiers (case-insensitive)
  if (CODE_IDENTIFIERS.has(trimmed.toLowerCase())) return false;

  // Skip camelCase identifiers
  if (/^[a-z]+([A-Z][a-zA-Z]*)+$/.test(trimmed)) return false;

  // Skip UPPER_CASE / SCREAMING_SNAKE_CASE
  if (/^[A-Z][A-Z0-9_]+$/.test(trimmed)) return false;

  // Skip kebab-case
  if (/^[a-z]+(-[a-z0-9]+)+$/.test(trimmed)) return false;

  // Skip dot-notation (object paths)
  if (/^[a-zA-Z]+(\.[a-zA-Z]+)+$/.test(trimmed)) return false;

  // Skip URLs and paths
  if (/^(https?:\/\/|\/|#|mailto:)/.test(trimmed)) return false;

  // Skip hex colors
  if (/^#[0-9a-fA-F]{3,8}$/.test(trimmed)) return false;

  // Skip CSS values
  if (/^\d+(\.\d+)?(px|rem|em|%|vh|vw|pt|deg|s|ms|fr)$/.test(trimmed)) return false;

  // Skip date/time format patterns
  if (/^[YMDHhmsaAzZ\-\/.:,\s]+$/.test(trimmed) && /[YMDHhms]/.test(trimmed)) return false;

  // Skip strings that look like file extensions or mime types
  if (/^\.[a-z]+$/.test(trimmed) || /^[a-z]+\/[a-z]+/.test(trimmed)) return false;

  // Skip single lowercase word (likely enum/prop value)
  if (/^[a-z]+$/.test(trimmed)) return false;

  // Skip icon names (e.g., "chevron-right", "map-pin")
  if (/^[a-z]+-[a-z]+(-[a-z]+)*$/.test(trimmed)) return false;

  // Flag: multi-word strings (contains space) = likely user-visible
  if (/\s/.test(trimmed)) return true;

  // Flag: single capitalized word not in code identifiers
  if (/^[A-Z][a-z]+$/.test(trimmed) && !CODE_IDENTIFIERS.has(trimmed.toLowerCase())) return true;

  return false;
}

function getJSXElementName(node) {
  if (!node || node.type !== 'JSXElement') return null;
  const opening = node.openingElement;
  if (!opening) return null;
  const name = opening.name;
  if (name.type === 'JSXIdentifier') return name.name;
  if (name.type === 'JSXMemberExpression') return name.property.name;
  return null;
}

function detectStaticTexts(filePath, content, config) {
  // Only process TSX/JSX files
  if (!/\.(tsx|jsx)$/.test(filePath)) return [];

  // Skip test/story files
  if (/\.(test|spec|stories)\.(tsx|jsx|ts|js)$/.test(filePath)) return [];

  const ast = parseFile(filePath, content);
  if (!ast) return [];

  const statics = [];
  const relFile = path.relative(ROOT, filePath).replace(/\\/g, '/');

  traverse(ast, {
    // Check JSXText nodes
    JSXText(nodePath) {
      const text = nodePath.node.value;
      if (!isUserVisibleText(text)) return;

      // Check parent JSXElement tag name
      const parent = nodePath.findParent(p => p.isJSXElement());
      if (!parent) return;
      const tagName = getJSXElementName(parent.node);
      if (!tagName || !USER_VISIBLE_TAGS.has(tagName)) return;

      statics.push({
        file: relFile,
        line: nodePath.node.loc?.start.line || 0,
        text: text.trim(),
        context: `<${tagName}>`,
      });
    },

    // Check JSXAttribute string values
    JSXAttribute(nodePath) {
      const attrName = nodePath.node.name?.name;
      if (!attrName || !USER_VISIBLE_ATTRS.has(attrName)) return;

      const value = nodePath.node.value;
      if (!value || value.type !== 'StringLiteral') return;

      if (!isUserVisibleText(value.value)) return;

      statics.push({
        file: relFile,
        line: nodePath.node.loc?.start.line || 0,
        text: value.value,
        context: `${attrName}=`,
      });
    },
  });

  return statics;
}

// ─── Missing Translation Check ───────────────────────────────────────────────

const PLURAL_SUFFIXES = ['_one', '_other', '_few', '_many', '_zero', '_two'];

function keyExistsInDict(key, langKeys) {
  if (langKeys.has(key)) return true;

  // Check if plural variants exist (i18next convention)
  for (const suffix of PLURAL_SUFFIXES) {
    if (langKeys.has(key + suffix)) return true;
  }

  // Also check if the key IS a plural form, and the base exists
  for (const suffix of PLURAL_SUFFIXES) {
    if (key.endsWith(suffix)) {
      const baseKey = key.slice(0, -suffix.length);
      if (langKeys.has(baseKey)) return true;
      // Check other plural forms
      for (const otherSuffix of PLURAL_SUFFIXES) {
        if (langKeys.has(baseKey + otherSuffix)) return true;
      }
    }
  }

  return false;
}

function checkMissingTranslations(allKeys, dict, languages) {
  // Deduplicate keys by namespace+key
  const uniqueKeys = new Map(); // `${ns}::${key}` -> {namespace, key, hasDefaultValue, files: [{file, line}]}
  for (const entry of allKeys) {
    const mapKey = `${entry.namespace}::${entry.key}`;
    if (!uniqueKeys.has(mapKey)) {
      uniqueKeys.set(mapKey, {
        namespace: entry.namespace,
        key: entry.key,
        hasDefaultValue: entry.hasDefaultValue,
        files: [],
      });
    }
    const existing = uniqueKeys.get(mapKey);
    existing.files.push({ file: entry.file, line: entry.line });
    if (entry.hasDefaultValue) existing.hasDefaultValue = true;
  }

  const missing = [];

  for (const [, entry] of uniqueKeys) {
    const nsDict = dict.get(entry.namespace);
    if (!nsDict) {
      // Namespace not found in dictionaries - skip (might be from a different system)
      continue;
    }

    const missingLangs = [];
    for (const lang of languages) {
      const langKeys = nsDict.get(lang);
      if (!langKeys || !keyExistsInDict(entry.key, langKeys)) {
        missingLangs.push(lang);
      }
    }

    if (missingLangs.length > 0) {
      missing.push({
        namespace: entry.namespace,
        key: entry.key,
        missingLanguages: missingLangs,
        hasDefaultValue: entry.hasDefaultValue,
        files: entry.files,
      });
    }
  }

  // Sort by namespace, then key
  missing.sort((a, b) => a.namespace.localeCompare(b.namespace) || a.key.localeCompare(b.key));
  return missing;
}

// ─── Report ──────────────────────────────────────────────────────────────────

const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
  bold: '\x1b[1m',
};

function c(color, text) {
  if (!process.stdout.isTTY) return text;
  return `${COLORS[color]}${text}${COLORS.reset}`;
}

function formatReport(missing, staticTexts, totalKeys, languages) {
  console.log('');

  // Section 1: Missing translations
  if (missing.length > 0) {
    console.log(c('bold', '=== MISSING TRANSLATIONS ==='));
    console.log('');

    for (const entry of missing) {
      const icon = entry.hasDefaultValue ? c('yellow', '\u26A0') : c('red', '\u2717');
      console.log(`${icon} ${c('cyan', `[${entry.namespace}]`)} ${entry.key}`);
      console.log(`  Missing: ${c('red', entry.missingLanguages.join(', '))}`);
      for (const loc of entry.files.slice(0, 3)) {
        console.log(`  ${c('dim', `Used in: ${loc.file}:${loc.line}`)}`);
      }
      if (entry.files.length > 3) {
        console.log(`  ${c('dim', `... and ${entry.files.length - 3} more`)}`);
      }
      if (entry.hasDefaultValue) {
        console.log(`  ${c('yellow', 'Has defaultValue (may be intentional)')}`);
      }
      console.log('');
    }
  }

  // Section 2: Static texts
  if (staticTexts.length > 0) {
    console.log(c('bold', '=== POTENTIAL STATIC TEXTS ==='));
    console.log('');

    for (const entry of staticTexts) {
      console.log(`${c('yellow', '\u26A0')} ${c('dim', `${entry.file}:${entry.line}`)}`);
      console.log(`  ${entry.context}"${c('yellow', entry.text)}"`);
    }
    console.log('');
  }

  // Section 3: Summary
  console.log(c('bold', '=== SUMMARY ==='));
  console.log('');

  const okKeys = totalKeys - missing.length;
  const withDefault = missing.filter(m => m.hasDefaultValue).length;
  const withoutDefault = missing.length - withDefault;

  console.log(`Total translation keys found in code: ${c('bold', totalKeys)}`);
  console.log(`Keys OK (all ${languages.length} languages):  ${c('green', okKeys)}`);

  if (missing.length > 0) {
    console.log(`Missing in at least one language:   ${c('red', missing.length)}`);
    if (withDefault > 0) {
      console.log(`  ${c('yellow', `With defaultValue (may be intentional): ${withDefault}`)}`);
    }
    if (withoutDefault > 0) {
      console.log(`  ${c('red', `Without defaultValue (likely missing):   ${withoutDefault}`)}`);
    }
  }

  console.log(`Potential static texts:             ${c('yellow', staticTexts.length)}`);
  console.log('');
}

// ─── Main ────────────────────────────────────────────────────────────────────

function main() {
  const mode = process.argv[2];

  if (!mode || !CONFIGS[mode]) {
    console.error('Usage: node check-translations.js <mobile|payload>');
    console.error('');
    console.error('Checks for:');
    console.error('  1. Translation keys used in code but missing from dictionaries');
    console.error('  2. Hardcoded static texts that should be translated');
    process.exit(1);
  }

  const config = CONFIGS[mode];

  console.log(`\nChecking translations for: ${c('bold', mode)}`);
  console.log(`Base path: ${c('dim', config.basePath)}`);

  // 1. Load dictionaries
  console.log('Loading translation dictionaries...');
  const dict = config.loadTranslations(config);
  let totalDictKeys = 0;
  for (const [, langMap] of dict) {
    for (const [, keys] of langMap) {
      totalDictKeys += keys.size;
    }
  }
  console.log(`  Loaded ${dict.size} namespaces, ${totalDictKeys} total key-language entries`);

  // 2. Discover source files
  console.log('Discovering source files...');
  const sourceFiles = discoverSourceFiles(config.basePath, config.excludeDirs);
  console.log(`  Found ${sourceFiles.length} source files`);

  // 3. Extract keys and detect static texts
  console.log('Analyzing source code (AST)...');
  const allKeys = [];
  const allStaticTexts = [];
  let parsed = 0;
  let failed = 0;

  for (const file of sourceFiles) {
    const content = fs.readFileSync(file, 'utf8');
    try {
      const keys = extractKeysFromFile(file, content, config);
      allKeys.push(...keys);
    } catch (err) {
      failed++;
    }

    try {
      const statics = detectStaticTexts(file, content, config);
      allStaticTexts.push(...statics);
    } catch { /* skip */ }

    parsed++;
  }

  console.log(`  Parsed ${parsed} files${failed > 0 ? `, ${failed} failed` : ''}`);

  // Deduplicate keys for counting
  const uniqueKeySet = new Set(allKeys.map(k => `${k.namespace}::${k.key}`));
  console.log(`  Found ${uniqueKeySet.size} unique translation keys`);
  console.log(`  Found ${allStaticTexts.length} potential static texts`);

  // 4. Check missing translations
  const missing = checkMissingTranslations(allKeys, dict, config.languages);

  // 5. Report
  formatReport(missing, allStaticTexts, uniqueKeySet.size, config.languages);

  // 6. Exit code
  const hardMissing = missing.filter(m => !m.hasDefaultValue);
  process.exit(hardMissing.length > 0 ? 1 : 0);
}

main();
