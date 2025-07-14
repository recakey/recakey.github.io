// Libs
import wpower from "./libs/wpower.js";

// Shorthands
var log = console.log;

function _____UTILS_____(){}

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

function _____CORE_____(){}

// Start authentication
async function start_auth(){
    var User = d$("#Username").value;
    var Ans  = d$("#Init-Ans").value;

    if (User!="alice" && User!="bob" && User!="charlie" && User!="dan"){
        alert("Invalid user name. Please choose one of: alice, bob, charlie, dan.");
        return;
    }
    if (Ans!="Blue"){
        alert("Invalid answer. Please enter 'Blue'.");
        return;
    }
    d$("#Auth-Start").style.display = "none";
}

// Show auth info
async function get_auth_pw(){
    const {enc} = wpower;
    const Files={
        "alice":   "https://drive.proton.me/urls/YWH5YJG3S8#EyB0xGQphFjP",        
        "bob":     "https://drive.proton.me/urls/FFQHYCMX74#ahCul4D1GV26",
        "charlie": "https://drive.proton.me/urls/7MY0WPAP6M#1YlvgqwZxKGy",
        "dan":     "https://drive.proton.me/urls/HA91EJ7YER#ir24uwPZC4T1"
    };    
    var V1     = d$("#Shape").value;
    var V2     = d$("#Word").value;
    var V3     = d$("#Town").value;
    var V4     = d$("#Dob").value;
    var V5     = d$("#Father").value;
    var V6     = d$("#Mother").value;
    var V7     = d$("#Pet").value;
    var V8     = d$("#Music").value;
    var V9     = d$("#Club ").value;
    var User   = d$("#User").value;    
    var Pw     = V1+V2+V3+V4+V5+V6+V7+V8+V9;
    var Authpw = (await enc.sha256(Pw)).substring(0,32);
    var Url    = Files[User];
    log(`Calculated auth pw of ${User}:`,Authpw);
    d$("#Info").innerHTML = 
        `Auth password: <input value="${Authpw}"> —> 
        <a target="_blank" href="${Url}">Download Data</a>`;
}
window.get_auth_pw = get_auth_pw;

// Decrypt
async function decrypt(){
    const {enc} = wpower;
    // Username and pw
    var V1   = d$("#Shape").value;
    var V2   = d$("#Word").value;
    var V3   = d$("#Town").value;
    var V4   = d$("#Dob").value;
    var V5   = d$("#Father").value;
    var V6   = d$("#Mother").value;
    var V7   = d$("#Pet").value;
    var V8   = d$("#Music").value;
    var V9   = d$("#Club ").value;
    var User = d$("#User").value;    
    var Pw   = V1+V2+V3+V4+V5+V6+V7+V8+V9;    

    // Get file
    var [Handle] = await window.showOpenFilePicker();
    var File     = await Handle.getFile(); // Already a blob
    var Obj      = File;
    var Text     = await unzip_enc_blob(Obj,"recakey.txt",Pw);

    if (Text==null)
        d$("#Result").value = "Not decryptable with entered values";
    else
        d$("#Result").value = Text;

    // Update UI height
    var Ele = d$("#Result");

    while (Ele.clientHeight<1000 && Ele.clientHeight<Ele.scrollHeight)
        Ele.style.height = (Ele.clientHeight+20) + "px";
}
window.decrypt = decrypt;

// Main
async function main(){}
window.onload = main;
// EOF