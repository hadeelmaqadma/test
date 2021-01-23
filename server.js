
const {Pool} = require("pg")
const express = require ("express")
const app = express();
app.use(express.json())

const dbReadPool = new Pool({
  
})

const dbDeletePool = new Pool({
   
})



const dbCreatePool = new Pool({
    
})

app.get("/", (req, res) => res.sendFile(`${__dirname}/index.html`))

app.get("/todos", async (req, res) => {
    const rows = await readTodos();
    res.setHeader("content-type", "application/json")
    res.send(JSON.stringify(rows))
})



app.post("/todos", async (req, res) => {
    let result = {}
    try{
        const reqJson = req.body;
        result.success = await createTodo(reqJson.todo)
    }
    catch(e){
        result.success=false;
    }
    finally{
        res.setHeader("content-type", "application/json")
        res.send(JSON.stringify(result))
    }
   
})





app.delete("/todos", async (req, res) => {
    let result = {}
    try{

        const reqJson = req.body;
        result.success = await deleteTodo(reqJson.id)
    }
    catch(e){
        result.success=false;
    }
    finally{
        res.setHeader("content-type", "application/json")
        res.send(JSON.stringify(result))
    }
   
})


app.listen(8080, () => console.log("Web server is listening.. on port 8080"))

start()

async function start() {
    await connect();

}

async function connect() {
    try {
        await dbCreatePool.connect();
        await dbDeletePool.connect();
        await dbReadPool.connect();
    }
    catch(e) {
        console.error(`Failed to connect ${e}`)
    }
}

async function readTodos() {
    try {
    const results = await dbReadPool.query("select id, text from todos");
    return results.rows;
    }
    catch(e){
        return [];
    }
}

async function createTodo(todoText){

    try {
        await dbCreatePool.query("insert into todos (text) values ($1)", [todoText]);
        return true
        }
        catch(e){
            return false;
        }
}



async function deleteTodo(id){

    try {
        await dbDeletePool.query("delete from todos where id = $1", [id]);
        return true
        }
        catch(e){
            return false;
        }
}