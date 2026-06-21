import { describe, expect, it } from "vitest";
import { retrievePortfolioContext } from "@/lib/portfolio-retrieval";

describe("retrievePortfolioContext", () => {
  it("retrieves education for graduation phrasing", () => {
    const context = retrievePortfolioContext("when and where did he graduate from?");

    expect(context).toContain("Education");
    expect(context).toContain("Drexel University");
    expect(context).toContain("March 2023");
    expect(context).toContain("Savitribai Phule Pune University");
    expect(context).toContain("April 2020");
  });

  it("retrieves education for college phrasing", () => {
    const context = retrievePortfolioContext("where did Akshay go to college for?");

    expect(context).toContain("M.S. in Business Analytics");
    expect(context).toContain("Drexel University");
    expect(context).toContain("B.E. in Electronics and Telecommunication");
    expect(context).toContain("Savitribai Phule Pune University");
  });

  it("force-includes contact details for reach-out phrasing", () => {
    const context = retrievePortfolioContext("how can I reach Akshay or get his resume?");

    expect(context).toContain("Evidence 1: Contact");
    expect(context).toContain("akshayjain128@gmail.com");
    expect(context).toContain("/resume.pdf");
  });

  it("force-includes skills for tool and stack questions", () => {
    const context = retrievePortfolioContext("what tools and technologies does he use?");

    expect(context).toContain("Evidence 1: Skills");
    expect(context).toContain("Power BI");
    expect(context).toContain("dbt");
    expect(context).toContain("Azure Databricks");
  });

  it("force-includes project evidence for product build questions", () => {
    const context = retrievePortfolioContext("what products or apps has Akshay built?");

    expect(context).toContain("H-1B Wage Map");
    expect(context).toContain("GitDecode");
    expect(context).toContain("Contextly");
  });

  it("force-includes Holman evidence for impact questions", () => {
    const context = retrievePortfolioContext("what measurable impact did he have at Holman?");

    expect(context).toContain("Evidence 1: Analytics Engineer at Holman");
    expect(context).toContain("1,000+ employees");
    expect(context).toContain("2,000+ hours");
  });

  it("force-includes work authorization for visa questions", () => {
    const context = retrievePortfolioContext("does Akshay need sponsorship or have work authorization?");

    expect(context).toContain("Evidence 1: Work Authorization");
    expect(context).toContain("Authorized to work in the U.S. on an H-1B visa");
  });

  it("force-includes narrative evidence for working-style questions", () => {
    const context = retrievePortfolioContext("how does Akshay approach ambiguous stakeholder problems?");

    expect(context).toContain("Working Style");
    expect(context).toContain("Problem Solving");
    expect(context).toContain("internal consultant");
  });
});
