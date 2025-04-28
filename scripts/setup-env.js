#!/usr/bin/env node

/**
 * Script to help users set up their environment variables
 * Run with: node scripts/setup-env.js
 */

// Use CommonJS for this script
// This is a special case where we use CommonJS even though the project uses ES modules
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const rootDir = path.join(__dirname, '..');
const envExamplePath = path.join(rootDir, '.env.example');
const envPath = path.join(rootDir, '.env');

// Check if .env already exists
if (fs.existsSync(envPath)) {
  console.log('\x1b[33m%s\x1b[0m', '.env file already exists!');
  rl.question('Do you want to overwrite it? (y/n): ', (answer) => {
    if (answer.toLowerCase() === 'y') {
      createEnvFile();
    } else {
      console.log('\x1b[32m%s\x1b[0m', 'Setup cancelled. Your .env file was not modified.');
      rl.close();
    }
  });
} else {
  createEnvFile();
}

function createEnvFile() {
  // Read the example file
  fs.readFile(envExamplePath, 'utf8', (err, data) => {
    if (err) {
      console.error('\x1b[31m%s\x1b[0m', 'Error reading .env.example file:', err);
      rl.close();
      return;
    }

    console.log('\x1b[36m%s\x1b[0m', '\nSetting up your environment variables...');
    console.log('\x1b[36m%s\x1b[0m', 'You need an OpenWeatherMap API key to use this app.');
    console.log('\x1b[36m%s\x1b[0m', 'Get one for free at: https://openweathermap.org/api\n');

    rl.question('Enter your OpenWeatherMap API key: ', (apiKey) => {
      if (!apiKey.trim()) {
        console.log('\x1b[33m%s\x1b[0m', 'No API key provided. Using placeholder value.');
        apiKey = 'your_openweathermap_api_key_here';
      }

      // Replace the placeholder with the actual API key
      const envContent = data.replace('your_openweathermap_api_key_here', apiKey.trim());

      // Write to .env file
      fs.writeFile(envPath, envContent, 'utf8', (err) => {
        if (err) {
          console.error('\x1b[31m%s\x1b[0m', 'Error writing .env file:', err);
          rl.close();
          return;
        }

        console.log('\x1b[32m%s\x1b[0m', '\n.env file created successfully!');
        console.log('\x1b[32m%s\x1b[0m', 'Your API key has been set up.');
        console.log('\x1b[33m%s\x1b[0m', '\nIMPORTANT: Never commit your .env file to version control.');
        rl.close();
      });
    });
  });
}
