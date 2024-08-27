describe("My First Test", () => {
  it("Does not do much!", () => {
    cy.visit(`/`);
    cy.get(".home").should("be.visible");
    expect(true).to.equal(true);
  });
});
