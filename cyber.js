const url = "https://jsonplaceholder.typicode.com/todos/";
 
async function change(){
    try{
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
    } catch(e){
        console.log(e);
    }
}
change();