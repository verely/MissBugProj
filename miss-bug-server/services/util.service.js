import fs from 'fs'
import fr from 'follow-redirects'
const { http, https } = fr

export const utilService = {
    readJsonFile,
    makeId,
    download,
}

function readJsonFile(path) {
    //console.log('read json', path)
    const str = fs.readFileSync(path, 'utf8')
    const json = JSON.parse(str)
    //console.log(json)
    return json
}

function makeId(length = 6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}

function download(url, fileName) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(fileName)
        https.get(url, (content) => {
            content.pipe(file)
            file.on('error', reject)
            file.on('finish', () => {
                file.close()
                resolve()
            })
        })
    })
}
