const {
    G_DRIVE_LINK_TYPES,
    G_DRIVE_BASE_LINK
} = require('../../src/constants.js');


// Function to generate Resume Google Drive links
module.exports.generateDriveLinks = (fileId) => {

    const previewLink = `${G_DRIVE_BASE_LINK}/file/d/${fileId}/preview`; // Resume Preview Mode
    const sharingLink = `${G_DRIVE_BASE_LINK}/file/d/${fileId}/view?usp=sharing`; // Resume Sharing Mode
    const downloadLink = `${G_DRIVE_BASE_LINK}/u/0/uc?id=${fileId}&export=download`; // Resume Export/Download Mode
  
    return {
      [G_DRIVE_LINK_TYPES.PREVIEW]: previewLink,
      [G_DRIVE_LINK_TYPES.SHARING]: sharingLink,
      [G_DRIVE_LINK_TYPES.DOWNLOAD]: downloadLink
    };
}