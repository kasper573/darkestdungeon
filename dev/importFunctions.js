const fs = require("fs");
const path = require("path");
const glob = require("glob");
const {split_fsb, extract_fsb, clean_audio_names} = require("darkest_dungeon_tools");

// Paths

const folders = {
  localDDAssets: path.join(__dirname, "../assets/dd"),
  fsbExtractBinaryPath: path.join(__dirname, "../bin/extract_fsb.exe"),
  steam: process.argv[2],
};

folders.localDDAudio = path.join(folders.localDDAssets, "audio");
folders.localDDImages = path.join(folders.localDDAssets, "images");
folders.dd = path.join(folders.steam, "steamapps/common/DarkestDungeon");
folders.ddAudio = path.join(folders.dd, "audio");

if (!fs.existsSync(folders.dd)) {
  console.error("Could not find Darkest Dungeon folder: " + folders.dd);
  process.exit(1);
  return;
}

// Audio

function importAudio (audioToImport) {
  removeFolder(folders.localDDAudio);
  ensureFolderExists(folders.localDDAudio);
  return extractAudioFromDD(audioToImport)
    .then(() => clean_audio_names.clean_directory.sync(folders.localDDAudio));
}

function getAudioBankNames (paths) {
  for (const folder in paths) {
    if (!paths[folder] || paths[folder].length === 0) {
      // Get all banks in the folder if no custom banks are specified
      const folderPath = path.join(folders.ddAudio, folder);
      paths[folder] = fs.readdirSync(folderPath).filter(
        (f) => fs.statSync(path.join(folderPath, f)).isFile()
      )
    } else {
      // Make sure custom bank names have .bank extensions
      paths[folder] = paths[folder].map(
        (bankName) => /\.bank$/.test(bankName) ? bankName : bankName + ".bank"
      );
    }
  }
  return paths;
}

function extractAudioFromDD (audioToImport) {
  const extractPromises = [];
  for (const categoryName in audioToImport) {
    audioToImport[categoryName].forEach((bankFile) => {
      const bankPath = path.join(folders.ddAudio, categoryName, bankFile);
      const fsbPath = path.join(folders.localDDAudio, bankFile);
      console.log("Importing", bankPath);

      // Wait for each extraction
      extractPromises.push(
        new Promise((resolve) => {
          // Create an fsb file to use for extraction
          split_fsb.async(bankPath, fsbPath, () => {
            // Extract audio files from bank
            const childProcess = extract_fsb.extract(
              fsbPath,
              folders.localDDAudio,
              folders.fsbExtractBinaryPath
            );

            // Let the child process determine when extraction is done
            childProcess.on("exit", () => {
              fs.unlinkSync(fsbPath); // Remove the fsb file as we're now done with it
              console.log("Finished importing", bankPath);
              resolve();
            });
          });
        })
      );
    });
  }

  // We're finished when all extractions are done
  return Promise.all(extractPromises);
}

// Image

function importImages (ddPaths) {
  return new Promise((resolve) => {
    removeFolder(folders.localDDImages);
    ensureFolderExists(folders.localDDImages);

    const localPaths = ddPaths.map((p) => path.join(folders.localDDImages, p.replace(folders.dd, "")));
    copyFiles(ddPaths, localPaths);

    resolve();
  });
}

function getImagePaths (queries) {
  return queries.reduce((paths, query) => {
    const fullQuery = path.join(folders.dd, query);
    console.log(fullQuery);
    glob.sync(fullQuery).forEach((p) => {
      paths.push(path.normalize(p));
    })
    return paths;
  }, []);
}

// Generic

function ensureFolderExists (folderPath) {
  const pathBase = path.isAbsolute(folderPath) ? path.sep : '';
  folderPath.split(path.sep)
    .reduce((pathBase, folderName) => {
      const currentPath = path.resolve(pathBase, folderName);
      if (!fs.existsSync(currentPath)) {
        fs.mkdirSync(currentPath);
      }

      return currentPath;
    }, pathBase);
}

function removeFolder (folderPath) {
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach(function(file){
      const curPath = path.join(folderPath, file);
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        removeFolder(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(folderPath);
  }
}

function copyFiles (sourceList, destList) {
  for (let i = 0; i < sourceList.length; i++) {
    const source = sourceList[i];
    const dest = destList[i];
    ensureFolderExists(path.dirname(dest));
    fs.createReadStream(source).pipe(fs.createWriteStream(dest));
  }
}

module.exports = {
  folders: folders,
  importAudio: importAudio,
  getAudioBankNames: getAudioBankNames,
  importImages: importImages,
  getImagePaths: getImagePaths
};
