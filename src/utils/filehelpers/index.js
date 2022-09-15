export const downloadBase64File=(contentBase64)=> {
    var hiddenElement = document.createElement('a');

    hiddenElement.href = 'data:attachment/text,' + encodeURI(contentBase64);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'myFile.txt';
    hiddenElement.click();
}





var fileTypes = [

    'jpg', 'jpeg', 'png',
    'ppt', 'pptx',
    'doc', 'docx',
    'xls', 'xlsx',
    'pdf', 'mp4'

];  //acceptable file types

export const readURL = (input) => {
    
    var extension = input.name.split('.').pop().toLowerCase(),  //file extension from input file
        success = fileTypes.indexOf(extension) > -1;  //is extension in acceptable types
    if (success) {
        return extension
    }
    return false;
}

export const typeToColor = (type) => {

    switch (type) {
        case 'jpg': case 'jpeg': case 'png': return "#232F3E";
        case 'ppt': case 'pptx': return "#f74a00";
        case 'doc': case 'docx': return "#007bed";
        case 'xls': case 'xlsx': return "#39825a";
        case 'pdf': return "#f70046";
        default: return "#232F3E"

    }

};







export const getMimeTypeB64 = (b64) => {
    let mimeType = b64.split(':');
    mimeType = mimeType[1].split(';');
    mimeType = mimeType[0];
    return mimeType;
};


export const blobToType = (blob) => {
    let mimeType = blob.split(':');
    mimeType = mimeType[1].split(';');
    mimeType = mimeType[0];


    mimeType = mimeType.split('/');
    mimeType =mimeType[1];

    
    


    return mimeType;
};





// :::: CARGA EN MEMORIA UN JS FILE
export const blobToFile = (dataurl, filename) => {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}

// :::: CREA UN LINK
export const blobToUrl = (data) => {


   
    const  mimeType = getMimeTypeB64(data);

    data = data.split(',');
    data = data[1];

    var byteCharacters = atob(data);
    var byteNumbers = new Array(byteCharacters.length);
    for (var i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    var byteArray = new Uint8Array(byteNumbers);
    var file = new Blob([byteArray], { type: mimeType + ';base64' });
    var fileURL = URL.createObjectURL(file);

    
    return fileURL;

};

// :: DESCARGA LINK
export const urlDownload = (fileURL, name)=>{
    
    const link = document.createElement('a');
    link.href = fileURL;
    link.download = name;

    // this is necessary as link.click() does not work on the latest firefox
    link.dispatchEvent(
      new MouseEvent('click', { 
        bubbles: true, 
        cancelable: true, 
        view: window 
      })
    );

    setTimeout(() => {
      window.URL.revokeObjectURL(fileURL);
      link.remove();
    }, 100);

}


// ::: FILE TO BLOB
export const jsFileToBlob = file => {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file)
        fileReader.onload = () => {
            resolve(fileReader.result)
        };
        fileReader.onerror = error => {
            reject(error)
        };
    });
};
