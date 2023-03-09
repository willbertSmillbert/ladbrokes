import { RACING_CATEGORIES } from "../config/constants";

const baseUrl = "http://localhost:3000/";

describe("Page Content", () => {
  //This test sometimes fails - needs rework - render speed is too fast for cypress to pick it up possibly?
  it("Should render the spinner when loading", () => {
    cy.visit(baseUrl);
    cy.get('[class="loading-spinner"]').and("be.visible");
  });
  it("Should correctly display page title", () => {
    cy.visit(baseUrl);
    cy.get("[data-testid=page-title]")
      .contains("Next To Go Races")
      .and("be.visible");
  });

  it("Should have all filters checked by default", () => {
    cy.visit(baseUrl);
    cy.get("[data-testid=category-filters]").within(() => {
      RACING_CATEGORIES.forEach((category) => {
        cy.get(`[data-testid=category-filter-${category.categoryId}]`).within(
          () => {
            cy.get("[data-testid=category-filter-label]")
              .contains(category.name)
              .and("be.visible");
            cy.get("[data-testid=category-filter-checkbox]").should(
              "be.checked"
            );
          }
        );
      });
    });
  });
//This is a little lame - but the API ALWAYS returns 5 items so we will roll with it
  it("renders the next 5 races", () => {
    cy.visit(baseUrl);
    cy.get('[class="race-name"]').should("have.length", 5);
  });

  //This test should be a unit test, or maybe an API e2e test, cypress was definitely not the tool for the job here.
  //But heres the chungus
  it("Should list the races in correct order", () => {
    cy.visit(baseUrl);
    let texts: any[] = [];
    cy.get('[class="race-name"]>p')
      .each(($el, index, $list) => {
        let text = $el.text();
        texts.push(text);
      })
      .then(($lis) => {
        //now we ensure the array is in the correct order
        //we need to convert the time to one digit (seconds will be usedz)
        let newText: any = [];
        for (let item of texts) {
          const hour = 3600;
          const min = 60;
          const hoursRegx = /\d+(?=h)/;
          const minsRegx = /\d+(?=m)/;
          const secsRegx = /\d+(?=s)/;

          //lets check if the number is negative
          if (item.includes("-")) {
            let hours = item.match(hoursRegx);
            let minutes = item.match(minsRegx);
            let secs = item.match(secsRegx);
            let totalSecs = 0;
            if (hours?.[0] > 0) {
              totalSecs += +hours * hour;
            }
            if (minutes?.[0] > 0) {
              totalSecs += +minutes * min;
            }
            if (secs?.[0] > 0) {
              totalSecs += +secs;
            }
            newText.push(totalSecs * -1);
          } else {
            let hours = item.match(hoursRegx);
            let minutes = item.match(minsRegx);
            let secs = item.match(secsRegx);
            let totalSecs = 0;
            if (hours?.[0] > 0) {
              totalSecs += +hours * hour;
            }
            if (minutes?.[0] > 0) {
              totalSecs += +minutes * min;
            }
            if (secs?.[0] > 0) {
              totalSecs += +secs;
            }
            newText.push(totalSecs);
          }
        } //The below called function checks to make sure the array is in order from smallest to biggest
        let sort = sorted(newText);
        function sorted(arr) {
          let second_index;
          for (let first_index = 0; first_index < arr.length; first_index++) {
            second_index = first_index + 1;
            if (arr[second_index] - arr[first_index] < 0) return false;
          }
          return true;
        }
        expect(sort).to.be.true;
      });
  });
});
