const fsPromises = require('fs').promises;
const path = require('path')

const fileOps = async () => {
    try {
        const data = await fsPromises.readFile("projectBAAL.txt", "utf8");
        console.log(data)

    } catch (err) {
        console.error(err)
    }
}

fileOps();
// fs.readFile('starter.txt','utf8',(err,data)=> {
//     if (err) throw err;
//     console.log(data);
// })

// fs.writeFile('reply.txt','Nice to meet you', (err) => {
//     if (err) throw err;
//     console.log('writing complete')

//     fs.appendFile("reply.txt","\n\nOrin pocha", (err) => {
//         if (err) throw err;
//         console.log("Modify complete")


//         fs.rename("reply.txt","projectBAAL.txt", (err) => {
//             if (err) throw err;
//             console.log("Rename complete")
//         })
//     })


// })

