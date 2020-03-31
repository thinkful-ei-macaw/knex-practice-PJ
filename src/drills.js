require("dotenv").config();
const knex = require("knex");

const knexInstance = knex({
  client: "pg",
  connection: process.env.DB_URL
});

function getItemsByText(searchTerm) {
  knexInstance
    .select("name")
    .from("shopping_list")
    .where("name", "ILIKE", `%${searchTerm}%`)
    .then(result => {
      console.log(result);
    });
}

getItemsByText("fried");

// 2. Get all items paginated

// A function that takes one parameter for pageNumber which will be a number
// The function will query the shopping_list table using Knex methods and select the pageNumber page of rows paginated to 6 items per page.

function paginateItems(number) {
  const productsPerPage = 6;
  const offset = productsPerPage * (number - 1);
  knexInstance
    .select("*")
    .from("shopping_list")
    .limit(productsPerPage)
    .offset(offset)
    .then(result => {
      console.log(result);
    });
}

paginateItems(2);

// 3. Get all items added after date

// A function that takes one parameter for daysAgo which will be a number representing a number of days.
// This function will query the shopping_list table using Knex methods and select the rows which have a date_added that is greater than the daysAgo.

function allItemsAfterDate(daysAgo) {
  knexInstance
    .select("*")
    .from("shopping_list")
    .where(
      "date_added",
      ">",
      knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
    )
    .then(result => {
      console.log(result);
    });
}

allItemsAfterDate(4);

// 4. Get the total cost for each category

// A function that takes no parameters
// The function will query the shopping_list table using Knex methods and select the rows grouped by their category and showing the total price for each category.

function totalCost() {
  knexInstance
    .select("*")
    .sum("price as total")
    .from("shopping_list")
    .groupBy("category")
    .then(result => {
      console.log(result);
    });
}
