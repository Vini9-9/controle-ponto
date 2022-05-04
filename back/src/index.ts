import { AppDataSource } from "./data-source"

AppDataSource.setOptions({
    host: 'database'
})

AppDataSource.initialize().then(async () => {
    
    console.log("Conectado ao BD")
    AppDataSource.runMigrations()

}).catch(error => console.log(error))
