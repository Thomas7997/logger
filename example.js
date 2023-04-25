const { LOG } = require('./logger')
const internal = new LOG("./jslogs.log")

for (let i = 0; i < 25; i++) {
    internal.log(`Log ${i} ...`)
}