//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.0;

contract DDBox {
  string public name="DDBox";
  // Number of files
  uint public fileCount=0;
  // Mapping fileId=>Struct 
  mapping(uint => File) public files;

  // Struct
  struct File{
      uint fileId;
      uint fileSize;
      uint uploadTime;
      string fileHash;
      string fileType;
      string fileName;
      string fileDescription;
      address payable uploader;
  }

  // Event
  event FileUploaded(
      uint fileId,
      uint fileSize,
      uint uploadTime,
      string fileHash,
      string fileType,
      string fileName,
      string fileDescription,
      address payable uploader
  );

  constructor(){
  }

  // Upload File function
    function uploadFile ( uint _fileSize,string memory _fileHash,string memory _fileType,string memory _fileName, string memory _fileDescription) public {
   
      require(bytes(_fileHash).length>0);
      require(bytes(_fileType).length>0);
      require(bytes(_fileDescription).length>0);
      require(bytes(_fileName).length>0);
      require(msg.sender != address(0));
    
      fileCount++;
      files[fileCount]= File(fileCount,_fileSize,block.timestamp,_fileHash,_fileType,_fileName,_fileDescription,payable(msg.sender));

    // Trigger an event
      emit FileUploaded(fileCount,_fileSize,block.timestamp,_fileHash,_fileType,_fileName,_fileDescription,payable(msg.sender));
    }

}