function doGet() {
  return HtmlService.createHtmlOutputFromFile('index').setTitle("Folder Dedupelifier");
}

var root_id = "";

function getRootName(id) {
  return DriveApp.getFolderById(id).getName();  
}

function folderCompare(f1, f2) {
  var itr1 = f1.getFiles();
  var itr2 = f2.getFiles();
  while (itr1.hasNext() && itr2.hasNext()) {
    itr1.next();
    itr2.next();
  }
  if (itr1.hasNext()) {
    return 1;
  }
  return 0;
}



function trashDupes (folderObj) {
  var rootFolder = DriveApp.getFolderById(root_id);
  var folderItr = rootFolder.getFoldersByName(folderObj.name);
  var bestFolder = folderItr.next();
  var otherFolders = [];
  while (folderItr.hasNext()) {
    var folder = folderItr.next();
    if (folderCompare(folder, bestFolder)) {
      otherFolders.push(bestFolder);
      bestFolder = folder;
    } else {
      otherFolders.push(folder);
    }
  }
  Logger.log("other" + otherFolders.length);
  for (i = 0; i < otherFolders.length; ++i) {
    otherFolders[i].setTrashed(true);  
  }
  return otherFolders.length;
}



function dedupe(userRootId) {
  root_id = userRootId;
  if (!root_id) {
    return null;
  }
  var rootFolder;
  try {
    rootFolder = DriveApp.getFolderById(root_id);
    
  } catch (e) {
    return null;  
  }
  var folderItr = rootFolder.getFolders();
  var folderArray = [];
  while (folderItr.hasNext()) {
    var next = folderItr.next();
    folderArray.push({id: next.getId(), name: next.getName()});
  }
  return folderArray;
}
