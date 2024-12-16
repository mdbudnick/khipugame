const { rimraf } = require('rimraf');
const fs = require('fs-extra');
const { exec } = require('child_process');

// Paths
const paths = {
  docsAssets: './docs/assets',
  assetsSrc: './assets',
  assetsDest: './docs/assets',
  distIndex: './dist/index.html',
  docsIndex: './docs/index.html',
  distAssets: './dist/assets',
};

// Step 1: Clear out the docs/assets folder
const clearDocsAssets = () => {
    return rimraf(paths.docsAssets);
};

// Step 2: Execute `npm run build`
const runBuildCommand = () => {
  return new Promise((resolve, reject) => {
    exec("npm run build", (err, stdout, stderr) => {
      if (err) {
        console.error(stderr);
        reject(err);
      } else {
        console.log(stdout);
        resolve();
      }
    });
  });
};

// Step 3: Copy ./assets folder to docs/assets
const copyAssetsFolder = () => {
  return fs.copy(paths.assetsSrc, paths.assetsDest);
};

// Step 4: Copy dist/index.html to docs folder
const copyIndexHtml = () => {
  return fs.copy(paths.distIndex, paths.docsIndex);
};

// Step 5: Copy files from dist/assets to docs/assets
const copyDistAssets = () => {
    return fs.copy(paths.distAssets, paths.assetsDest);
};

// Run all steps sequentially
const build = async () => {
  try {
    console.log('Clearing docs/assets...');
    await clearDocsAssets();
    console.log('Running build...');
    await runBuildCommand();
    console.log('Copying assets folder...');
    await copyAssetsFolder();
    console.log('Copying index.html...');
    await copyIndexHtml();
    console.log('Copying dist/assets files...');
    await copyDistAssets();
    console.log('Build process complete!');
  } catch (err) {
    console.error('Build process failed:', err);
    process.exit(1);
  }
};

build();
