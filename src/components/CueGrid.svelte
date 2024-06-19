<!-- CueGrid.svelte -->
<script lang="ts">
    import "ag-grid-community/styles/ag-grid.css";
    import "ag-grid-community/styles/ag-theme-alpine.css";

    import { onMount } from "svelte";
    import { createGrid } from "ag-grid-community";

    import { updateCue, timeline } from "../stores/timeline";
    import { currentTime } from "../stores/current-time";
    import { playbackState } from "../stores/playback.js";

    import { CUE_TYPES } from "../cue-types";

    let gridDiv;
    let gridApi;

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
                        values: Object.keys(CUE_TYPES),
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
</script>

<div
    class="ag-theme-alpine-dark"
    style="height: 500px; width: 100%;"
    bind:this={gridDiv}
></div>
