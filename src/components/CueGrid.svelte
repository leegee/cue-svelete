<!-- CueGrid.svelte -->
<script lang="ts">
    import "ag-grid-community/styles/ag-grid.css";
    import "ag-grid-community/styles/ag-theme-alpine.css";

    import { onMount } from "svelte";
    import { createGrid } from "ag-grid-community";
    import type { GridApi } from "ag-grid-community";

    import {
        updateCue,
        timeline,
        NO_CURRENT_CUE_INDEX,
        setCurrentCueIndex,
    } from "../stores/timeline";
    import { isPlaying } from "../stores/is-playing.js";
    import { newTime } from "../stores/new-time";
    import { formatTime } from "../lib/format-time";
    import { CUE_TYPES } from "../cue-types";

    let gridDiv: HTMLElement;
    let gridApi: GridApi;

    onMount(() => {
        const gridOptions = {
            defaultColDef: {
                editable: true,
                filter: true,
                flex: 1,
                minWidth: 150,
                resizable: true,
                sortable: false,
            },
            columnDefs: [
                {
                    headerName: "",
                    minWidth: 36,
                    width: 36,
                    maxWidth: 36,
                    editable: false,
                    flex: 0,
                    cellRenderer: (params) => {
                        const eButton = document.createElement("button");
                        eButton.innerHTML = "▶";
                        eButton.className = "cell-ctrl";
                        eButton.addEventListener("click", () => {
                            console.log("btn clicked");
                            newTime.update((state) => {
                                state = params.data.start;
                                return state;
                            });
                            setCurrentCueIndex(params.rowIndex);
                        });
                        return eButton;
                    },
                },
                {
                    headerName: "Start",
                    field: "start",
                    valueFormatter: (params) => formatTime(params.value),
                    cellStyle: {
                        textAlign: "center",
                        width: "10em",
                        fontFamily: "monospace",
                    },
                },
                {
                    headerName: "End",
                    field: "end",
                    valueFormatter: (params) => formatTime(params.value),
                    cellStyle: {
                        textAlign: "center",
                        width: "10em",
                        fontFamily: "monospace",
                    },
                },
                {
                    headerName: "Content",
                    field: "content",
                    cellStyle: { textAlign: "left" },
                    cellEditor: "agSelectCellEditor",
                    cellEditorParams: {
                        values: Object.keys(CUE_TYPES),
                    },
                },
            ],
            onCellValueChanged: onCellValueChangedHandler,
            onCellEditingStarted: pauseVideo,
            onCellClicked: pauseVideo,
            rowData: [],
            getRowClass: getRowClassHandler,
            pagination: false,
        };

        gridApi = createGrid(gridDiv, gridOptions);

        // Update grid rows when store changes
        const unsubscribeFromTimeline = timeline.subscribe((state) => {
            gridApi.setGridOption("rowData", state.cues);
            gridApi.redrawRows();
            ensureRowVisible(state.currentCueIndex);
            console.log("timeline subscriber cuegrid ran an update", state);
        });

        return () => {
            unsubscribeFromTimeline();
            if (gridApi) {
                gridApi.destroy();
            }
        };
    });

    // Pause the video when cell editing starts
    function pauseVideo() {
        console.log("cell clicked, shall pause");
        $isPlaying = false;
    }

    // Revert any change if the start and end are invalid
    function onCellValueChangedHandler(params) {
        console.log(params);
        try {
            updateCue(
                params.rowIndex,
                params.data.start,
                params.data.end,
                params.data.content,
            );
        } catch (e) {
            params.node.setDataValue(params.column.colId, params.oldValue);
            params.api.refreshCells({
                rowNodes: [params.node],
                columns: [params.column.colId],
            });
        }
    }

    function getRowClassHandler(params) {
        return params.node.rowIndex === $timeline.currentCueIndex
            ? "highlight-row"
            : "";
    }

    function ensureRowVisible(index) {
        if (index > NO_CURRENT_CUE_INDEX) {
            gridApi.ensureIndexVisible(index, "middle");
        }
    }
</script>

<section
    class="ag-theme-alpine-dark"
    style="height: 500px; width: 100%;"
    bind:this={gridDiv}
/>
