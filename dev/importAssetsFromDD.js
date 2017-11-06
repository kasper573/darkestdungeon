const fs = require("fs");
const path = require("path");
const {split_fsb, extract_fsb} = require("darkest_dungeon_tools");

const fsbExtractBinaryPath = path.join(__dirname, "../bin/extract_fsb.exe");
const folders = {
  localDDAssets: path.join(__dirname, "../assets/dd"),
  steam: process.argv[2],
};

folders.localDDAudio = path.join(folders.localDDAssets, "audio");
folders.dd = path.join(folders.steam, "steamapps/common/DarkestDungeon");
folders.ddAudio = path.join(folders.dd, "audio");

if (!fs.existsSync(folders.dd)) {
  console.error("Could not find Darkest Dungeon folder: " + folders.dd);
  return;
}

importAudio(
  getAudioBankNames({
    secondary_banks: ["ambience", "town", "ui_shared", "ui_town"]
  })
);

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

function importAudio (audioToImport) {
  ensureFolderExists(folders.localDDAudio);
  removeFilesFromFolder(folders.localDDAudio);
  return extractAudioFromDD(audioToImport)
    .then(() => cleanAudioNames(folders.localDDAudio));
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
              fsbExtractBinaryPath
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

function removeFilesFromFolder (folderPath) {
  fs.readdirSync(folderPath).forEach((file) => {
    const filePath = path.join(folderPath, file);
    fs.unlinkSync(filePath);
  });
}

/**
 * Removes {...} from the end of the names of the audio files imported from Darkest Dungeon
 */
function cleanAudioNames (audioDir) {
  const files = fs.readdirSync(audioDir);
  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    const p = path.join(audioDir, f);
    const stats = fs.statSync(p);

    if (stats.isFile()) {
      fs.rename(p, p.replace(/\s{.*}(\.\w+)$/, "$1"), (err) => {
          if (err) {
          throw new Error(err);
        }
      });
    }
  }
}