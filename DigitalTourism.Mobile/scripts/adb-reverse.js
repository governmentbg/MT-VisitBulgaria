const {execSync} = require('child_process');
const path = require('path');

const PORTS = [
  {port: 8080, label: 'Keycloak'},
  {port: 5107, label: 'API Gateway'},
  {port: 8081, label: 'Metro'},
];

function getAdb() {
  // Try ANDROID_HOME / ANDROID_SDK_ROOT first, then fall back to PATH
  const sdkRoot =
    process.env.ANDROID_HOME ||
    process.env.ANDROID_SDK_ROOT ||
    (process.platform === 'win32'
      ? path.join(process.env.LOCALAPPDATA || '', 'Android', 'Sdk')
      : path.join(process.env.HOME || '', 'Android', 'Sdk'));

  const adb = path.join(sdkRoot, 'platform-tools', `adb${process.platform === 'win32' ? '.exe' : ''}`);

  try {
    execSync(`"${adb}" version`, {stdio: 'ignore'});
    return `"${adb}"`;
  } catch {
    // Fall back to adb on PATH
    return 'adb';
  }
}

const adb = getAdb();

console.log('Setting up ADB reverse port forwarding...\n');

for (const {port, label} of PORTS) {
  try {
    execSync(`${adb} reverse tcp:${port} tcp:${port}`, {stdio: 'pipe'});
    console.log(`  tcp:${port} -> localhost:${port}  (${label})`);
  } catch (err) {
    console.warn(`  WARNING: Failed to reverse port ${port} (${label}) - is a device/emulator connected?`);
  }
}

console.log('\nDone.\n');
