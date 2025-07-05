// Shorthands
var log = console.log;

// Select
function d$(Sel){
    return document.querySelector(Sel);
}

// Select many
function d$$(Sel){
    return [...document.querySelectorAll(Sel)];
}

// Zip.js suggestion: Copilot
// This func: Copilot (reviewed, edited)
async function unzip_enc_blob(blob, file, password) {
    var zipReader;
    try{
        // Create a reader for the blob
        const blobReader = new zip.BlobReader(blob);
        // Create a ZipReader with the password
        zipReader = new zip.ZipReader(blobReader, { password });

        // Get all entries
        const entries = await zipReader.getEntries();

        for (const entry of entries) {
            // console.log(`Extracting: ${entry.filename}`);
            // Choose a writer depending on the content type
            const writer = new zip.TextWriter(); // or BlobWriter, etc.

            const content = await entry.getData(writer);
            //console.log(`Content of ${entry.filename}:`, content);

            if (entry.filename == file){
                await zipReader.close();
                return content;        
            }
        }
        await zipReader.close();
        return null;
    }
    catch{
        await zipReader.close();
        return null;
    }
}


// Decrypt
async function decrypt(){
    var User = d$("#User").value;
    var Obj  = await (await fetch(User+".zip")).blob();
    var V1   = d$("#Shape").value;
    var V2   = d$("#Word").value;
    var V3   = d$("#Town").value;
    var V4   = d$("#Dob").value;
    var V5   = d$("#Father").value;
    var V6   = d$("#Mother").value;
    var V7   = d$("#Pet").value;
    var V8   = d$("#Music").value;
    var V9   = d$("#Club ").value;
    var Pw   = V1+V2+V3+V4+V5+V6+V7+V8+V9;
    var Text = await unzip_enc_blob(Obj,"recakey.txt",Pw);

    if (Text==null)
        d$("#Result").value = "Not decryptable with entered values";
    else
        d$("#Result").value = Text;
}

// Main
async function main(){}
window.onload = main;
// EOF