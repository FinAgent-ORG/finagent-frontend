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

const API_TO_UI_CATEGORY = {
  Entertainment: "Marketing",
  Food: "Operational",
  Groceries: "Inventory",
  Healthcare: "Employee",
  Other: "Miscellaneous",
  Rent: "Operational",
  Transport: "Travel",
};

export function mapUiCategoryToApi(category) {
  return BUSINESS_CATEGORIES.includes(category) ? category : DEFAULT_BUSINESS_CATEGORY;
}

export function mapApiCategoryToUi(category) {
  return API_TO_UI_CATEGORY[category] ?? category ?? DEFAULT_BUSINESS_CATEGORY;
}
