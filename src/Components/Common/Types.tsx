interface PreviewMode {
    type: "Child" | "Group";
    groupId: number;
    childId: number;
}

interface ChildSummaryData {
    name: string;
    surname: string;
    id: number;
    groupName: string;
    breakfast: number;
    dinner: number;
    desert: number;
}



export type { PreviewMode, ChildSummaryData };