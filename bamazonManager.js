//VARIABLES =====================================
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("easy-table");

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "bamazon"
});
var items = [];
//FUNCTIONS =====================================
function chooseAction(){
    inquirer.prompt([
        {
            type: "list",
            message: "Select an option from the list below",
            choices: ["View products for sale", "View low inventory", "Add to inventory", "Add new product", "Exit Application"],
            name: "choice"
        }
    ]).then(function(data){
        switch(data.choice) {
            case "View products for sale":
                viewStore();
                break;
            case "View low inventory":
                viewLowInventory();
                break;
            case "Add to inventory":
                addInventory();
                break;
            case "Add new product":
                addItem();
                break;
            case "Exit Application":
                connection.end();
                break;
        }
    })
}

function viewStore(){
    var query = connection.query(
    "SELECT * FROM products",
    function(error, results) {
        if (error) throw error;
        else {
            var store = new Table;
            results.forEach(function(data){
                store.cell("ID", data.id)
                store.cell("Product", data.product)
                store.cell("Price", data.price, Table.number(2))
                store.cell("Quantity", data.quantity)
                store.newRow()
            });
        console.log(store.toString());
        chooseAction();
        }
    }
)};

function viewLowInventory() {
    var query = connection.query(
    "SELECT * FROM products WHERE quantity BETWEEN 0 AND 10",
        function(err, results) {
            var store = new Table;
            results.forEach(function(data){
                store.cell("ID", data.id)
                store.cell("Product", data.product)
                store.cell("Price", data.price, Table.number(2))
                store.cell("Quantity", data.quantity)
                store.newRow()
            });
        console.log(store.toString());
        chooseAction();
        }
    )
}

function addInventory(){
    var query = connection.query(
    "SELECT * FROM products",
    function(err, results) {
        if (err) throw err;
        else {
            for (var i = 0; i < results.length; i++) {
                items.push(JSON.stringify(results[i].id));
            }
            inquirer.prompt([
                {
                    type: "list",
                    message: "Choose an item to add inventory to",
                    choices: items,
                    name: "choice"
                },
                {
                    message: "How many would you like to add?",
                    name: "amount",
                    validate: function(value) {
                        if (isNaN(value) === false) return true;
                        else return false;
                    }
                }
            ]).then(function(data){
                var query = connection.query(
                "SELECT * FROM products WHERE ?",
                {
                     id: data.choice
                },
                function(err, results) {
                    var quantity = parseInt(results[0].quantity) + parseInt(data.amount);
                var query = connection.query(
                "UPDATE products SET ? WHERE ?",
                [{
                    quantity: quantity
                },
                {
                    id: data.choice
                }],
                function(err, results){
                    console.log("Inventory has been added.");
                    chooseAction();
                });
                })

            })
        }
    })
}

function addItem(){
    inquirer.prompt([
        {
            message: "Name of the product.",
            name: "product"
        },
        {
            message: "Department of the product.",
            name: "department"
        },
        {
            message: "Price of the product.",
            name: "price",
            validate: function(value) {
                if (isNaN(value) === false) return true;
                else return false;
            }

        },
        {
            message: "Quantity of the product.",
            name: "quantity",
            validate: function(value) {
                if (isNaN(value) === false) return true;
                else return false;
            }
        }
    ]).then(function(data){
        var query = connection.query(
        "INSERT INTO products SET ?",
        {
            product: data.product,
            department: data.department,
            price: data.price,
            quantity: data.quantity
        }, function(err, results){
            if (err) throw err;

            else {
                console.log("Your item has been added.");
                chooseAction();
            }
        })
    })

}
//MAIN PROCESS ==================================
connection.connect(function(err){
    if (err) throw err;
});

chooseAction();
