const Repository = require('../models/Repository');

module.exports = 
class BookmarksController extends require('./Controller') {

    constructor(req, res){
        super(req, res);
        this.bookmarkRepository = new Repository('bookmarks');
    }

    getAll(){
        this.response.JSON(this.bookmarkRepository.getAll());
    }

    get(id){

        var keys = this.getQueryStringParams();
        var contenu = [];
        var value = null;

        if(keys != null)
            value = Object.keys(keys);

        if(!isNaN(id))
            contenu = this.bookmarkRepository.get(id);
        else
        {
            if(keys != null){
                contenu = availableParam;
                if(value.includes("sort"))
                    contenu = this.sortBy(keys.sort); 
                if(value.includes("name"))
                    contenu = this.findName(keys.name);
                if(value.includes("category")){
                    contenu = this.findCategory(keys.category);
                }
                
            }
            else
                contenu = this.bookmarkRepository.getAll();
        }
        this.response.JSON(contenu);
    }

    findCategory(name) {
        var temp = this.bookmarkRepository.getAll();
        var c = [];

        for(var i = 0; i < temp.length; ++i){
            if(temp[i].Category.includes(name)){
                c.push(this.bookmarkRepository.get(temp[i].Id));
            }
        }
        
        return c;
    }

    findName(name) {
        var temp = this.bookmarkRepository.getAll();
        var c = [];

        for(var i = 0; i < temp.length; ++i){
            if(temp[i].Name.includes(name)){
                c.push(this.bookmarkRepository.get(temp[i].Id));
            }
        }
        
        return c;
    }
    
    sortBy(sorter)
    {
        switch(sorter){
            case "name":
                return this.bookmarkRepository.getAll().sort((a, b) => a.Name > b.Name ? 1 : -1)
            case "category":
                return this.bookmarkRepository.getAll().sort((a, b) => a.Category > b.Category ? 1 : -1)
            default:
                return this.response.JSON(this.bookmarkRepository.getAll());
        }
    }
        
    post(bookmark){  
        // todo : validate contact before insertion
        // todo : avoid duplicates

        if (this.bookmarkRepository.checkIfValid(bookmark)){
            let newBookmark = this.bookmarkRepository.add(bookmark);
            if (newBookmark)
                this.response.created(JSON.stringify(newBookmark));
            else
                this.response.internalError();
        }
        else{
            this.response.badRequest();
        }
       
    }

    put(bookmark){
        // todo : validate contact before updating

        if (this.bookmarkRepository.checkIfValid(bookmark)){
            if (this.bookmarkRepository.update(bookmark))
                this.response.ok();
            else 
                this.response.notFound();
        }
        else {
            this.response.badRequest();
        }
    }
    
    remove(id){
        if (this.bookmarkRepository.remove(id))
            this.response.accepted();
        else
            this.response.notFound();
    }
}
const availableParam = [
    "name",
    "category",
    "sort"
]