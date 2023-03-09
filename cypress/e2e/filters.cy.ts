import { RACING_CATEGORIES } from "../config/constants";
//constants being set so we know what we expect in each filter
const CATEGORY_ID_THOROUGHBRED = RACING_CATEGORIES.find(
  (element) => (element.name = "Thoroughbred")
);
const CATEGORY_ID_GREYHOUND = RACING_CATEGORIES.find(
  (element) => (element.name = "Greyhound")
);
const CATEGORY_ID_HARNESS = RACING_CATEGORIES.find(
  (element) => (element.name = "Harness")
);
const baseUrl = "http://localhost:3000/";
let json;
describe("Category Filters", () => {
  //The below fetches the races - we will use the JSON to ensure that the filters are returning the right races

  before(async function () {
    let url =
      "http://localhost:3000/v2/racing/next-races-category-group?count=5&categories=%5B%224a2788f8-e825-4d36-9894-efd4baf1cfae%22%2C%229daef0d7-bf3c-4f50-921d-8e818c60fe61%22%2C%22161d9be2-e909-4326-8c2c-35ed71fb460b%22%5D";
    const response = await fetch(url);
    json = await response.json();
  });
  //I would like the deselect and select filters to be more robust - fetch the elements and for each element perform
  //The action - unsure how to do this in Cypress though
  it("Able to deselect first filter", async function () {
    cy.visit(baseUrl);
    cy.get("[data-testid=category-filter-checkbox]").eq(0).uncheck();
  });
  it("Able to deselect second filter", async function () {
    cy.visit(baseUrl);
    cy.get("[data-testid=category-filter-checkbox]").eq(1).uncheck();
  });
  it("Able to deselect third filter", async function () {
    cy.visit(baseUrl);
    cy.get("[data-testid=category-filter-checkbox]").eq(2).uncheck();
  });

  /**
   * The below tests ensure that the correct items are returned, however
   * These tests have severe limitations as there is simply not enough data within
   * the dom to be sure that the items are correct, even if one were to check
   * the race number, location and race time, there could be overlap
   *
   * In the given data set the data presented in the app, and what is returned by the API are
   * disconnected.. All of these tests should fail..
   */
  it("Correct items are returned on first filter(thoroughbreds)", () => {
    //Initialise a variable that will get set to false if there is a race where it
    //shouldnt be
    cy.visit(baseUrl);
    let correctData = true;
    let arr: string[] = [];
    //unchecks the filters we dont want
    cy.get("[data-testid=category-filter-checkbox]").eq(1).uncheck();
    cy.get("[data-testid=category-filter-checkbox]").eq(2).uncheck();
    //Checks if the category object exists
    if (CATEGORY_ID_THOROUGHBRED) {
      if (json.category_race_map[CATEGORY_ID_THOROUGHBRED.categoryId]) {
        const expectedRaceIds =
          json.category_race_map[CATEGORY_ID_THOROUGHBRED.categoryId].race_ids;
        //intiialise race locations array
        var raceLocations: string[] = [];
        for (const race of expectedRaceIds) {
          raceLocations.push(json.race_summaries[race].meeting_name);
        }
        //The below iterates over the elements on the page
        //and ensures that all race locations are present
        cy.get('[class="race-name"]>p')
          .each(($el, index, $list) => {
            let text = $el.text();
            arr.push(text);
          })
          .then(($lis) => {
            for (const text of arr) {
              if (raceLocations.includes(text)) {
                console.log("noice");
              } else {
                correctData = false;
              }
            }
            // expect(raceLocations).to.be.true;
            expect(correctData).to.be.true;
          });
      }
    }
  });
  it("Correct items are returned on first filter(Greyhounds)", () => {
    //Initialise a variable that will get set to false if there is a race where it
    //shouldnt be
    cy.visit(baseUrl);
    let correctData = true;
    let arr: string[] = [];
    //unchecks the filters we dont want
    cy.get("[data-testid=category-filter-checkbox]").eq(0).uncheck();
    cy.get("[data-testid=category-filter-checkbox]").eq(2).uncheck();
    //Checks if the category object exists
    if (CATEGORY_ID_GREYHOUND) {
      if (json.category_race_map[CATEGORY_ID_GREYHOUND.categoryId]) {
        const expectedRaceIds =
          json.category_race_map[CATEGORY_ID_GREYHOUND.categoryId].race_ids;
        //intiialise race locations array
        var raceLocations: string[] = [];
        for (const race of expectedRaceIds) {
          raceLocations.push(json.race_summaries[race].meeting_name);
        }
        //The below iterates over the elements on the page
        //and ensures that all race locations are present
        cy.get('[class="race-name"]>p')
          .each(($el, index, $list) => {
            let text = $el.text();
            arr.push(text);
          })
          .then(($lis) => {
            for (const text of arr) {
              if (raceLocations.includes(text)) {
                console.log("noice");
              } else {
                correctData = false;
              }
            }
            //  expect(arr).to.be.true;
            expect(correctData).to.be.true;
          });
      }
    }
  });
  it("Correct items are returned on last filter(Harness)", () => {
    //Initialise a variable that will get set to false if there is a race where it
    //shouldnt be
    cy.visit(baseUrl);
    let correctData = true;
    let arr: string[] = [];
    //unchecks the filters we dont want
    cy.get("[data-testid=category-filter-checkbox]").eq(0).uncheck();
    cy.get("[data-testid=category-filter-checkbox]").eq(1).uncheck();
    //Checks if the category object exists
    if (CATEGORY_ID_HARNESS) {
      if (json.category_race_map[CATEGORY_ID_HARNESS.categoryId]) {
        const expectedRaceIds =
          json.category_race_map[CATEGORY_ID_HARNESS.categoryId].race_ids;
        //intiialise race locations array
        var raceLocations: string[] = [];
        for (const race of expectedRaceIds) {
          raceLocations.push(json.race_summaries[race].meeting_name);
        }
        //The below iterates over the elements on the page
        //and ensures that all race locations are present
        cy.get('[class="race-name"]>p')
          .each(($el, index, $list) => {
            let text = $el.text();
            arr.push(text);
          })
          .then(($lis) => {
            for (const text of arr) {
              if (raceLocations.includes(text)) {
                console.log("noice");
              } else {
                correctData = false;
              }
            }
            // expect(raceLocations).to.be.true;
            expect(correctData).to.be.true;
          });
      }
    }
  });
});
