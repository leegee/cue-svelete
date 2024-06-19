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
    } from "../stores/timeline";
    import { playbackState } from "../stores/playback.js";

    import { CUE_TYPES } from "../cue-types";
    import { formatTime } from "../lib/format-time";

    let gridDiv: HTMLElement;
    let gridApi: GridApi;

    onMount(() => {
        const gridOptions = {
            columnDefs: [
                {
                    headerName: "Start",
                    field: "start",
                    sortable: false,
                    filter: true,
                    editable: true,
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
                    sortable: false,
                    filter: true,
                    editable: true,
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
                    sortable: false,
                    filter: true,
                    cellStyle: { textAlign: "left" },
                    editable: true,
                    cellEditor: "agSelectCellEditor",
                    cellEditorParams: {
                        values: Object.keys(CUE_TYPES),
                    },
                },
                {
                    headerName: "Actions",
                },
            ],
            onCellValueChanged: onCellValueChangedHandler,
            onCellEditingStarted: pauseVideo,
            onCellClicked: pauseVideo,
            defaultColDef: {
                flex: 1,
                minWidth: 150,
                resizable: true,
            },
            rowData: [],
            getRowClass: getRowClassHandler,
            pagination: false,
            paginationPageSize: 10,
        };

        gridApi = createGrid(gridDiv, gridOptions);

        // Update grid rows when store changes
        const unsubscribeFromTimeline = timeline.subscribe((state) => {
            gridApi.setGridOption("rowData", state.cues);
            gridApi.redrawRows();
            console.log(
                "currentCueIndex",
                state.currentCueIndex,
                $timeline.currentCueIndex,
            );
            ensureRowVisible(state.currentCueIndex);
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
        playbackState.set({ playing: false });
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
