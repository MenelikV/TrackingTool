const base_url = "http://localhost:1337"
const request_module = require("request")
// Folder with files to upload
const root_folder = "D:\\DEV\\XLSX_Parsing\\"
const path = require("path")
const fs = require("fs")

var cookie = request_module.jar()
const request = request_module.defaults({
  jar: cookie,
  forever: true
})
// User which should have the right to upload
var user = {
    emailAddress: "mvero-ext@assystemtechnologies.com",
    password: "TEST"
}
var doPostRequest = function (form, encoding, url) {
    var used_url = url || base_url
    // TODO Check Server Status Message and Raise an Error
    if (encoding === undefined) {
      var enc = "utf8"
    } else {
      var enc = encoding
    }
    //console.log(form)
    return new Promise(function (resolve, reject) {
      request.post({
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
var doPutRequest = function (form, encoding, url) {
    var used_url = url || base_url
    // TODO Check Server Status Message and Raise an Error
    if (encoding === undefined) {
      var enc = "utf8"
    } else {
      var enc = encoding
    }
    //console.log(form)
    return new Promise(function (resolve, reject) {
      request.put({
        url: url,
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
// Login
var login_path = '/api/v1/entrance/login'
var complete_url = base_url+login_path
let res = doPutRequest(user, null, complete_url)
// Read Folder Content
var content = fs.readdirSync(root_folder)
var streams = content.map(d=>fs.createReadStream(path.join(root_folder, d)))
// Create the form to upload
var upload_path = '/account/file/upload'
var complete_url = base_url + upload_path
var formdata = {
    file:streams
}
try{
    doPostRequest(formdata, null, complete_url)
}
catch(error){
    console.log('\x1b[36m%s\x1b[0m', error)
}
module.exports = {}

