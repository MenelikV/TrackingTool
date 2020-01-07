const base_url = "http://localhost:1337"
const request_module = require("request")
// Folder with files to upload
/*
Script based on this folder architecture
Root folder 
   |
    ------ Aircraft Folder 
                  |
                   ----------- PERFOTO_*.xlsx
                   ----------- *.pdf
*/
const root_folder = ""
const filters = [
  "PERFOTO_[A-Z]+([0-9]).xls",
  "*identification.xlsm",
  "*tabulated results.pdf",
  "*parameters validation.pdf",
  "*airline.pdf",
  "Fleet follow-up.pdf",
  "aircraft*identification.pdf"

]
const fs = require("fs")
const path = require("path")
const glob = require("glob").GlobSync
var cookie = request_module.jar()
const request = request_module.defaults({
  jar: cookie,
  forever: true
})
// User which should have the right to upload
var user = {
    emailAddress: "menelik.vero.external@airbus.com",
    password: "menelik"
}
// Post Request Handler
var doPostRequest = function (form, encoding, url) {
    var used_url = url || base_url
    var enc = encoding || "utf8"
    return new Promise(function (resolve, reject) {
      request.post({
        url: used_url,
        formData: form,
        encoding: enc
      }, function (err, res) {
        if(res === undefined){
          reject(err)
          return
        }
        console.log(res.headers)
        if (!err && res.statusCode === 200) {
          resolve(res.body)
        } else {
          console.error(err)
          reject(err)
        }
      })
    })
}
// Put Request Handler
var doPutRequest = function (form, encoding, url) {
    var used_url = url || base_url
    var enc = encoding || "utf8"
    return new Promise(function (resolve, reject) {
      request.put({
        url: used_url,
        form: form,
        encoding: enc
      }, function (err, res) {
        if(res === undefined){
          reject(err)
          return
        }
        console.log(res.headers)
        if (!err && res.statusCode === 200) {
          resolve(res.body)
        } else {
          console.error(err)
          reject(err)
        }
      })
    })
}
// Read/Upload Airccraft Folder Data Function
var data_upload = function(folder){
  // Read Aircraft Folder
  var aircraft_folder_abs_path = path.join(root_folder, folder)
  console.log(aircraft_folder_abs_path)
  filtered_content = []
  for(let filter of filters){
    var matched = new glob(filter, {cwd: aircraft_folder_abs_path, nocase:true})
    if(matched.found.length != 1){
      console.log()
      console.log("Pattern not found")
      console.log(filter)
      console.log(aircraft_folder_abs_path)
      console.log()
      continue
    }
    else{
      filtered_content.push(matched.found[0])
    }
  }
  if(filtered_content.length != 7){
    console.log(`found ${filtered_content.length} files intead of 7`)
    console.error(`Problem with the matching pattern for the folder ${aircraft_folder_abs_path}`)
    return Promise.reject(`Data has not been crawled properly in the following folder: ${aircraft_folder_abs_path}`)
  }
  var streams = filtered_content.map(d=>fs.createReadStream(path.join(aircraft_folder_abs_path, d)))
  // Create the form to upload
  var upload_path = '/account/file/upload'
  var complete_url = base_url + upload_path
  var formdata = {
      file:streams
  }
  return doPostRequest(formdata, null, complete_url)
}
var main_upload_maker = function(){
    // Read Root Folder Content
    var content = fs.readFileSync("base2.txt", {encoding:"utf8"}).split("\r\n")
    var p = Promise.resolve()
    content.forEach(
      folder => p = p.then(() => data_upload(folder).catch(err => console.error(err)))
    )
}
// Login
var login_path = '/api/v1/entrance/login'
var complete_url = base_url+login_path
let res = doPutRequest(user, null, complete_url)
// Scan and Upload the data found in the different folders
res.then(main_upload_maker)
module.exports = {}

