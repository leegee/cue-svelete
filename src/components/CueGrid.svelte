<!-- CueGrid.svelte -->
<script lang="ts">
    import "ag-grid-community/styles/ag-grid.css";
    import "ag-grid-community/styles/ag-theme-alpine.css";

    import { onMount } from "svelte";
    import { createGrid } from "ag-grid-community";

    import { timeline } from "../stores/timeline";
    import { currentTime } from "../stores/current-time";
    import { playbackState } from "../stores/playback.js";

    import { CUE_TYPES } from "../cue-types";

    let gridDiv;
    let gridApi;

    const setPlayheadPosition = (time) => {
        currentTime.set(time);
    };

    onMount(() => {
        const gridOptions = {
            columnDefs: [
                {
                    headerName: "Start",
                    field: "start",
                    sortable: false,
                    filter: true,
                    editable: true,
                },
                {
                    headerName: "End",
                    field: "end",
                    sortable: false,
                    filter: true,
                    editable: true,
                },
                {
                    headerName: "Content",
                    field: "content",
                    sortable: false,
                    filter: true,
                    editable: true,
                    cellEditor: "agSelectCellEditor",
                    cellEditorParams: {
                        values: CUE_TYPES.keys(),
                    },
                },
                {
                    headerName: "Actions",
                    field: "actions",
                },
            ],
            onCellValueChanged: onCellValueChangedHandler,
            onCellEditingStarted: pauseVideo,
            onCellClicked: pauseVideo,
            rowData: [],
            defaultColDef: {
                flex: 1,
                minWidth: 150,
                resizable: true,
            },
            pagination: true,
            paginationPageSize: 10,
        };

        gridApi = createGrid(gridDiv, gridOptions);

        // Update grid rows when store changes
        const unsubscribeFromTimeline = timeline.subscribe((state) => {
            gridApi.setGridOption("rowData", state.cues);
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
        let revert = false;
        if (params.data.start >= params.data.end) {
            alert("The start value must be smaller than the end value");
            revert = true;
        }

        if (params.data.start < 0 || params.data.end < 0) {
            alert("The start value must be smaller than the end value");
            revert = true;
        }

        if (revert) {
            params.node.setDataValue(params.column.colId, params.oldValue);
            params.api.refreshCells({
                rowNodes: [params.node],
                columns: [params.column.colId],
            });
        }
    }
</script>

<div
    class="ag-theme-alpine-dark"
    style="height: 500px; width: 100%;"
    bind:this={gridDiv}
></div>
