export const BUSINESS_CATEGORIES = [
  "Operational",
  "Inventory",
  "Employee",
  "Logistics",
  "Marketing",
  "Software",
  "Utilities",
  "Travel",
  "Compliance",
  "Miscellaneous",
];

export const DEFAULT_BUSINESS_CATEGORY = "Miscellaneous";

const UI_TO_API_CATEGORY = {
  Compliance: "Other",
  Employee: "Healthcare",
  Inventory: "Groceries",
  Logistics: "Transport",
  Marketing: "Entertainment",
  Miscellaneous: "Other",
  Operational: "Food",
  Software: "Utilities",
  Travel: "Transport",
  Utilities: "Utilities",
};

const API_TO_UI_CATEGORY = {
  Entertainment: "Marketing",
  Food: "Operational",
  Groceries: "Inventory",
  Healthcare: "Employee",
  Other: "Miscellaneous",
  Rent: "Operational",
  Transport: "Logistics",
  Utilities: "Utilities",
};

export function mapUiCategoryToApi(category) {
  return UI_TO_API_CATEGORY[category] ?? "Other";
}

export function mapApiCategoryToUi(category) {
  return API_TO_UI_CATEGORY[category] ?? category ?? DEFAULT_BUSINESS_CATEGORY;
}
