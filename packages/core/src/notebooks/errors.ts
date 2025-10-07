import { AppError } from "../errors";

export class FilePathAlreadyExistsError extends AppError {
  code = "FILE_PATH_ALREADY_EXISTS";

  constructor(fileName: string) {
    super(fileName + ` already exists`);
  }
}

export class FolderPathAlreadyExistsError extends AppError {
  code = "FOLDER_PATH_ALREADY_EXISTS";
  folderPath: string;

  constructor(folderPath: string) {
    super(folderPath + ` already exists`);
    this.folderPath = folderPath;
  }
}
