// createFolder.gs - Google Apps Script
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents || '{}');
    if (data.action === 'createFolder') {
      var name = data.name || 'New Folder';
      // 例: 特定親フォルダに作る場合は parentId を使う
      var parentId = 'YOUR_PARENT_FOLDER_ID'; // 省略可
      var folder;
      if (parentId) {
        var parent = DriveApp.getFolderById(parentId);
        folder = parent.createFolder(name);
      } else {
        folder = DriveApp.createFolder(name);
      }
      var result = {
        status: 'ok',
        folderId: folder.getId(),
        folderUrl: folder.getUrl()
      };
      return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
    } else {
      return bad('unknown action');
    }
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({status:'error', message: err.message})).setMimeType(ContentService.MimeType.JSON);
  }
}

function bad(msg) {
  return ContentService.createTextOutput(JSON.stringify({status:'error', message: msg})).setMimeType(ContentService.MimeType.JSON);
}
