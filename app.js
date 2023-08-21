const https = require('https');
const http = require('http');
const fs = require('fs').promises;
const util = require('util');
const { exec } = require('child_process');

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
};

const IP_BLACKLIST_URLS = [
  'https://cdn.jsdelivr.net/gh/LittleJake/ip-blacklist/abuseipdb_blacklist_ip_score_100.txt',
  'https://raw.githubusercontent.com/borestad/blocklist-ip/main/abuseipdb-s100-90d.ipv4',
];
const BLACKLIST_FILE = 'blacklist.txt';
const startTime = Date.now();

const checkInterval = 5 * 60 * 1000;
const delayBetweenBlocks = 1;

function logWithColor(message, color) {
  console.log(`${color}${message}${colors.reset}`);
}

async function downloadIPBlacklists() {
  logWithColor('Downloading IP blacklists...', colors.yellow);

  try {
    await fs.writeFile(BLACKLIST_FILE, '');
    
    const downloadPromises = IP_BLACKLIST_URLS.map(async (url) => {
      const response = await fetchURL(url);
      await fs.appendFile(BLACKLIST_FILE, response + '\n');
      logWithColor(`IP blacklist from ${url} downloaded successfully.`, colors.green);
    });

    await Promise.all(downloadPromises);
    await processIPBlacklist();
  } catch (error) {
    logWithColor(`Error downloading IP blacklists: ${error.message}`, colors.red);
  }
}

async function processIPBlacklist() {
  logWithColor('Processing IP blacklist...', colors.yellow);

  try {
    const data = await fs.readFile(BLACKLIST_FILE, 'utf-8');
    const uniqueIps = [...new Set(data.split('\n').filter(Boolean))];
    const totalIPsToBlock = uniqueIps.length;
    await sleep(2000);
    let blockedIPs = 0;

    for (const ip of uniqueIps) {
      await blockIP(ip);
      blockedIPs++;
      const elapsedTime = formatTime((Date.now() - startTime) / 1000);
      logWithColor(`[` + colors.green + `${elapsedTime}` + colors.reset + `] Blocked ` + colors.red + `${ip}` + colors.reset + ` and ` + colors.yellow + `${totalIPsToBlock - blockedIPs}` + colors.reset + `/` + colors.yellow + `${totalIPsToBlock}` + colors.reset + ` remaining.`, colors.reset);
    }

    const totalTimeElapsed = (Date.now() - startTime) / 1000;
    logWithColor(`Total: ${totalIPsToBlock} IPs have been blacklisted.`, colors.green);
    logWithColor(`Total Duration: ${formatTime(totalTimeElapsed)}`, colors.green);
    
    return;
  } catch (error) {
    logWithColor(`Error processing IP blacklist: ${error.message}`, colors.red);
  }
}

async function blockIP(ip) {
  try {
    await executeIptablesCommand(
      `-A INPUT -s ${ip} -j DROP && iptables -A OUTPUT -d ${ip} -j DROP`
    );
    await sleep(delayBetweenBlocks);
  } catch (error) {
    logWithColor(`Error blocking IP ${ip}: ${error.message}`, colors.red);
  }
}

async function executeIptablesCommand(command) {
  try {
    const { stdout, stderr } = await util.promisify(exec)(`iptables ${command}`);
    if (stdout) logWithColor(stdout, colors.green);
    if (stderr) logWithColor(stderr, colors.red);
  } catch (error) {
    logWithColor(`Error executing iptables command: ${error.message}`, colors.red);
  }
}

async function fetchURL(url) {
  const protocol = url.startsWith('https') ? https : http;

  return new Promise((resolve, reject) => {
    protocol.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to fetch URL ${url}. Status code: ${response.statusCode}`));
        return;
      }

      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        resolve(data);
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${hours}h ${minutes}m ${remainingSeconds}s`;
}

downloadIPBlacklists();
setInterval(downloadIPBlacklists, checkInterval);
