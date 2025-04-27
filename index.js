const config = require('./utils/config')
const app = require('./app')
const { log } = require('./utils/logger')

app.listen(config.PORT, () => log('Server running on port', config.PORT))
