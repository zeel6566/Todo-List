	const express = require('express');
	const bodyParser = require('body-parser');
	const mongoose = require('mongoose'); 
	const _ = require('lodash');
	const app = express();
	//var items=["buy","cook","eat"];
	var workitems = [];

	app.set('view engine','ejs');

	app.use(bodyParser.urlencoded({extended:true}));
	app.use(express.static("public"));

    mongoose.connect("mongodb+srv://admin-zeel:zeel123@cluster0.rfkal.mongodb.net/todolistDB" , {useNewUrlParser:true} , { useUnifiedTopology: true });

	const itemsschema = {
		name : String,
	};

	const Item =mongoose.model("Item",itemsschema);

const item1 = new Item(
	{
		name:"Welcome to todolist",
	});	
	const item2 = new Item(
	{
		name:"hit + to add new item",
	});	
	const item3 = new Item(
	{
		name:"hit --< to delete the item.",
	});

	const defaultitems = [item1,item2,item3];
const listschema ={
	name:String,
	items :[itemsschema]
};

const List = mongoose.model("List",listschema);


	/*Item.insertMany(defaultitems,function(err)
	{
		if(err)
		{
			console.log(err);
		}
		else
		{
			console.log("Successfully saved");
		}
	});*/

	app.get("/",function(request,response)
			{


			Item.find({} , function(err,foundItems)
			{
				if(foundItems.length==0)
				{
					Item.insertMany(defaultitems,function(err)
	{
		if(err)
		{
			console.log(err);
		}
		else
		{
			console.log("Successfully saved");
		}
	});
					response.redirect("/");
				}

				else
				{
				response.render('list',{listtitle:"Today",newlistitem:foundItems});
			}
			});		
			
	
	});

app.post("/",function(request,response)
		{
const itemName = request.body.newitem;
const listName = request.body.list;
const item = new Item(
	{
		name:itemName,
	});	

if(listName==="Today")
{
	item.save();
	response.redirect("/");
}
else
{
    List.findOne({name: listName} , function(err,foundList)
    {
    	foundList.items.push(item);
    	foundList.save();
    	response.redirect("/" + listName);
    });
}

});






/*if(request.body.list === "Work")
{
	workitems.push(item);
	response.redirect("/work");
}

else
{
	items.push(item)
	response.redirect("/");
}*/			
		//});
	 

	/* app.get("/work",function(request,response)
	 {
	 	response.render("list",{listtitle:"Work",newlistitem:workitems});
	 });*/


	 app.get("/:customlist",function(request,response)
	 {
const customlist = _.capitalize(request.params.customlist);

List.findOne({name: customlist},function(err,foundList)
{
	if(!err)
	{
		if(!foundList)
		{
			//new list console.log("not exist");
		const list = new List({
	name: customlist,
	items: defaultitems,
});
list.save();  
response.redirect("/" + customlist);
		}

		else
		{
			
			// existing listconsole.log("exist");
		response.render("list",{listtitle: foundList.name,newlistitem: foundList.items});
		}
	}
});


	 });



	/* app.get("/:customListName", function(req, res){
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({name: customListName}, function(err, foundList){
    if (!err){
      if (!foundList){
        //Create a new list
        const list = new List({
          name: customListName,
          items: defaultItems
        });
        list.save();
        res.redirect("/" + customListName);
      } else {
        //Show an existing list

        res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
      }
    }
  });



});*/

app.post("/delete",function(request,response)
{
const checkeditemid = request.body.checkbox;
const listName = request.body.listName;
if(listName==="Today")
{
Item.findByIdAndRemove(checkeditemid,function(err)
{
	if(!err)
	{
		console.log("Successfully deleted checked item");
	response.redirect("/");
	}
	else
	{
		console.log(err);
	}
});	
}
else
{
	List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkeditemid}}}, function(err, foundList){
      if (!err){
        response.redirect("/" + listName);
      }
    });
}

});
	

/*app.listen(3000,function () {
				// body...
				console.log("Server started...");
			});
*/
app.listen(3000, function() {
  console.log("Server started on port 3000");
});