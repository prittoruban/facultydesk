export const facultySheets = {
  "Faculty A": "12xF-E0FgD6QG68YX1hQQuJa59isfadd4akLmTF7DCHY",
  "Faculty B": "1P0Zcfzv3zhf2twuu7amZsHJUEc9Jb9sSSiOxBzQ0BVs",
};

export const sheetTabs = [
  "Course Completion",
  "Class Taken", 
  "Unit Test",
  "Internal 1",
  "Internal 2",
  "Model"
] as const;

export type SheetTab = typeof sheetTabs[number];
export type FacultyStatus = Record<SheetTab, boolean>;
export type FacultyData = Record<string, FacultyStatus>;
