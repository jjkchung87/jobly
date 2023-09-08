const { sqlForPartialUpdate, sqlForFilteredCompanies } = require("./sql");


describe("sqlForPartialUpdate", function () {
  test("works: users", function () {
    const data = {
        firstName: "Harper",
        lastName: "Chung"
    }
    const jsToSql = {
        firstName: "first_name",
        lastName: "last_name",
        isAdmin: "is_admin"
    }
    const sql = sqlForPartialUpdate(data, jsToSql)

    expect(sql).toEqual(
        {
            setCols:'"first_name"=$1, "last_name"=$2',
            values:["Harper","Chung"]
        }
    );
  });

  test("works: companies", function () {
    const data = {
        numEmployees: 100,
        logoUrl: "https://i.pcmag.com/imagery/reviews/02lLbDwVdtIQN2uDFnHeN41-11..v1569480019.jpg"
    }
    const jsToSql = {
        numEmployees: "num_employees",
        logoUrl: "logo_url"
    }
    const sql = sqlForPartialUpdate(data, jsToSql)

    expect(sql).toEqual(
        {
            setCols:'"num_employees"=$1, "logo_url"=$2',
            values:[100,"https://i.pcmag.com/imagery/reviews/02lLbDwVdtIQN2uDFnHeN41-11..v1569480019.jpg"]
        }
    );
  });


});
