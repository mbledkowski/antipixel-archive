
let matches = []
let match
for (let i=0; i<nojson.length; i++){
  const regex = /(?:src=')([^']*)/g
  match = regex.exec(nojson[i])
  matches.push(match[1])
}

for (let i=0; i<matches.length; i++){
  console.log(`https://web.badges.world/${matches[i]}`)
}