const { BadRequestError } = require("../expressError");

/** Helper function used for generating SQL for PATCH requests.
  * 
  * Accepts data to update (JS object), and another object with potential columns that can be updated
  * Maps through dataToUpdate and creates new list "cols" which contains elements of strings in the format of "colName=$<col#>" where <col#> starts from 1
  * Returns { setCols: ["col1=$1","col2=$2",...], values: [val1, val2,...]}
  **/

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

/** Helper function for generating SQL for filtered searches of companies
  * 
  * Accepts filtered fields (JS object) from query string
  * Converts the JS object to the appropriate SQL syntax to be passed into Company.filter method
  * Returns { selectCols:"col1, col2, etc", filterBy: "col1=$1, col2=$2, ...", values=[val1, val2,...]}
  **/

function sqlForFilteredCompanies(filteredFields) {

  const jsToSql = {
    name: "name",
    minEmployees: "num_employees",
    maxEmployees: "num_employees"
  }
  
  const keys = []
  const values = []

  for(let [key, value] of Object.entries(filteredFields)){
    keys.push(key)
    if(key==="name"){
      values.push(`%${value}%`)
    } else {
      values.push(+value)
    }
  }

  if (keys.length === 0) throw new BadRequestError("No data");

  const where = keys.map((key, idx) => {
    if (key==="minEmployees") {return `${jsToSql[key]} >= $${idx + 1}`}
    if (key==="maxEmployees") {return `${jsToSql[key]} <= $${idx + 1}`}
    if (key==="name") {return `${jsToSql[key]} ILIKE $${idx + 1}`}

  });

  const columns = keys.map((key) => {
    return `${jsToSql[key]}`
  });


  return {
    selectCols: columns.join(", "),
    filterBy: where.join(" AND "),
    values: values
  }

}



module.exports = { sqlForPartialUpdate, sqlForFilteredCompanies };

