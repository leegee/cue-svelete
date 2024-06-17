<!-- EventGrid.svelte -->
<script>
    import { onMount, onDestroy } from "svelte";
    import { timelineEvents } from "../stores/timeline-events";
    import { currentTime } from "../stores/current-time";
    import "ag-grid-community/styles/ag-grid.css";
    import "ag-grid-community/styles/ag-theme-alpine.css";
    import { Grid } from "ag-grid-community";

    let gridDiv;
    let gridOptions;

    const setPlayheadPosition = (time) => {
        currentTime.set(time);
    };

    onMount(() => {
        gridOptions = {
            columnDefs: [
                {
                    headerName: "Start",
                    field: "start",
                    sortable: true,
                    filter: true,
                },
                {
                    headerName: "End",
                    field: "end",
                    sortable: true,
                    filter: true,
                },
                {
                    headerName: "Content",
                    field: "content",
                    sortable: true,
                    filter: true,
                },
                {
                    headerName: "Actions",
                    field: "actions",
                },
            ],
            rowData: [],
            defaultColDef: {
                flex: 1,
                minWidth: 150,
                resizable: true,
            },
            pagination: true,
            paginationPageSize: 10,
        };

        const grid = new Grid(gridDiv, gridOptions);

        // Subscribe to changes in timelineEvents store
        const unsubscribe = timelineEvents.subscribe((state) => {
            if (gridOptions.api) {
                // Update rowData when store changes
                gridOptions.api.setRowData(state.events);
            }
        });

        return () => {
            unsubscribe();
            if (gridOptions.api) {
                gridOptions.api.destroy();
            }
        };
    });

    onDestroy(() => {
        if (gridOptions && gridOptions.api) {
            gridOptions.api.destroy();
        }
    });
</script>

<div
    class="ag-theme-alpine-dark"
    bind:this={gridDiv}
    style="height: 500px; width: 100%;"
></div>

<style>
    button {
        margin: 2px;
        padding: 5px;
        border: none;
        border-radius: 3px;
        cursor: pointer;
    }
    button:hover {
        background-color: #555;
        color: white;
    }
</style>
