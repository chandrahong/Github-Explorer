import { createSlice } from "@reduxjs/toolkit";

export const issueSlice = createSlice({
    name: "issue",
    initialState: {
        issueData: null,
        issueClicked: null,
        labelClicked: null,
        repoSearchName : null,
        showIssue: false,
        updated : false,
        searchupdated : false,
    },
    reducers:{
        set_issue: (state, action) =>{
            state.issueData = action.payload
        },
        set_labelValue:(state, action) => {
            state.labelClicked= action.payload
        },
        set_issueClick: (state, action) => {
            state.issueClicked = action.payload
        },
        show_issueClick: (state, action) => {
            state.showIssue = action.payload
        },
        set_searchRepoName : (state, action) => {
            state.repoSearchName = action.payload
        },
        set_updated : (state, action) => {
            state.updated = action.payload
        },
        set_search_update: (state, action) => {
            state.searchupdated = action.payload
        },
    }
});

export const {set_issue, set_issueClick, show_issueClick, set_labelValue, set_searchRepoName, set_updated, set_search_update} = issueSlice.actions;

export const SelectIssue = (state) => state.issue.issueData;
export const SelectClickedIssue = (state) => state.issue.issueClicked;
export const SelectShowIssue = (state) => state.issue.showIssue;

export const SelectLabelValue = (state) => state.issue.labelClicked;
export const SelectSearchRepo = (state) => state.issue.repoSearchName;


//Bool after updating the issuedata
export const SelectUpdateBool = (state) => state.issue.updated;
export const SelectSearchUpdatedBool = (state) => state.issue.searchupdated;

export default issueSlice.reducer