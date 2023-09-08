"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Job = require("./job.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", function () {
  const newjob = {
    title: "Bodyguard",
    salary: 500000,
    equity: 0.05,
    company_handle: "c1",
  };

  test("works", async function () {
    let job = await Job.create(newjob);
    expect(job).toEqual( {
        id: expect.any(Number),
        title: "Bodyguard",
        salary: 500000,
        equity: "0.05",
        companyHandle: "c1"
      });

    const result = await db.query(
          `SELECT id, title, salary, equity, company_handle AS "companyHandle"
           FROM jobs
           WHERE id = ${job.id}`);
    expect(result.rows).toEqual([
      {
        id: expect.any(Number),
        title: "Bodyguard",
        salary: 500000,
        equity: "0.05",
        companyHandle: "c1",
      },
    ]);
  });

//   test("bad request with dupe", async function () {
//     try {
//       await Job.create(newjob);
//       await Job.create(newjob);
//       fail();
//     } catch (err) {
//       expect(err instanceof BadRequestError).toBeTruthy();
//     }
//   });
});

/************************************** findAll */

describe("findAll", function () {
  test("works: no filter", async function () {
    let jobs = await Job.findAll();
    expect(jobs).toEqual([
      {
        id: 1,
        title: "Golfer",
        salary: 1000000,
        equity: "0.05",
        companyHandle: "c1",
      },
      {
        id: 2,
        title: "MMA Fighter",
        salary: 50000,
        equity: "0",
        companyHandle: "c2",
      }      
    ]);
  });
});

/************************************** get */

describe("get", function () {
  test("works", async function () {
    let job = await Job.get(1);
    expect(job).toEqual({
        id: 1,
        title: "Golfer",
        salary: 1000000,
        equity: "0.05",
        companyHandle: "c1",
    });
  });

  test("not found if no such job", async function () {
    try {
      await Job.get("nope");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update */

describe("update", function () {
  const updateData = {
    title: "BJJ Fighter",
    salary: 25000,
    equity: "0.25"
  };

  test("works", async function () {
    let job = await Job.update(2, updateData);
    expect(job).toEqual({
      id: 2,
      companyHandle:"c2",
      ...updateData,
    });

    const result = await db.query(
          `SELECT id, title, salary, equity, company_handle AS "companyHandle"
           FROM jobs
           WHERE id = 2`);
    expect(result.rows).toEqual([{
      id: 2,
      title: "BJJ Fighter",
      salary: 25000,
      equity: "0.25",
      companyHandle: "c2",
    }]);
  });

  
  test("not found if no such job", async function () {
    try {
      await Job.update("nope", updateData);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request with no data", async function () {
    try {
      await Job.update(1, {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await Job.remove(1);
    const res = await db.query(
        "SELECT id FROM jobs WHERE id=1");
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such job", async function () {
    try {
      await Job.remove("nope");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});


/************************************** filter */

// describe("filter", function () {
//   test("filter name", async function () {
//     const filter = {
//       name: 'C'
//     }
    
//     let jobs = await Job.filter(filter);
//     expect(jobs).toEqual([
//       {
//         handle: "c1",
//         name: "C1",
//         description: "Desc1"
//       },
//       {
//         handle: "c2",
//         name: "C2",
//         description: "Desc2"
//       },
//       {
//         handle: "c3",
//         name: "C3",
//         description: "Desc3"
//       },
//     ]);
//   });

//   test("filter minEmployees", async function () {
//     const filter = {
//       minEmployees: 2
//     }
    
//     let jobs = await Job.filter(filter);
//     expect(jobs).toEqual([
//       {
//         handle: "c2",
//         description: "Desc2",
//         num_employees: 2
//       },
//       {
//         handle: "c3",
//         description: "Desc3",
//         num_employees: 3
//       }
//     ]);
//   });
  
//   test("filter maxEmployees", async function () {
//     const filter = {
//       maxEmployees: 1
//     }
    
//     let jobs = await Job.filter(filter);
//     expect(jobs).toEqual([
//       {
//         handle: "c1",
//         description: "Desc1",
//         num_employees: 1
//       }
//     ]);
//   });


// });
