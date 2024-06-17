<!-- CueGrid.svelte -->
<script lang="ts">
    import "ag-grid-community/styles/ag-grid.css";
    import "ag-grid-community/styles/ag-theme-alpine.css";

    import { onMount } from "svelte";
    import { createGrid } from "ag-grid-community";

    import { timeline } from "../stores/timeline";
    import { currentTime } from "../stores/current-time";

    let gridDiv;

    const setPlayheadPosition = (time) => {
        currentTime.set(time);
    };

    onMount(() => {
        const gridOptions = {
            columnDefs: [
                {
                    headerName: "Start",
                    field: "start",
                    sortable: true,
                    filter: true,
                    editable: true,
                },
                {
                    headerName: "End",
                    field: "end",
                    sortable: true,
                    filter: true,
                    editable: true,
                },
                {
                    headerName: "Content",
                    field: "content",
                    sortable: true,
                    filter: true,
                    editable: true,
                },
                {
                    headerName: "Actions",
                    field: "actions",
                },
            ],
            onCellValueChangedEvent: onCellValueChangedHandler,
            rowData: [],
            defaultColDef: {
                flex: 1,
                minWidth: 150,
                resizable: true,
            },
            pagination: true,
            paginationPageSize: 10,
        };

        const gridApi = createGrid(gridDiv, gridOptions);

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

    function onCellValueChangedHandler(...args) {
        console.log("aha", args);
    }
</script>

<div
    class="ag-theme-alpine-dark"
    style="height: 500px; width: 100%;"
    bind:this={gridDiv}
></div>
